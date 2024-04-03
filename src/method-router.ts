import shortid from 'shortid';
import { NextRequest, NextResponse } from 'next/server';
import { HttpMethods, HttpResponse } from 'standard-http-response-js';






export declare type NextChainCallback = (value?: any | null) => Promise<NextResponse | undefined | null | any>;
export declare type RouterCallback = (req: NextRequest, res: NextResponse, next: NextChainCallback, data?: { passdata?: any, chainResult?: any }) => void | NextResponse | Promise<void> | Promise<NextResponse>;
export declare type FallbackRouterCallback = (req: NextRequest, res: NextResponse, error: any ) => void | NextResponse | Promise<void> |  Promise<NextResponse>;
export declare type MethodCallbacks = Record<HttpMethods, RouterCallback | null | any>;




export class MethodRouter {

    private methodCallbacks: MethodCallbacks = {
        GET: null,
        POST: null,
        PUT: null,
        DELETE: null,
        PATCH: null,
        HEAD: null,
        CONNECT: null,
        TRACE: null,
        OPTIONS: (req: NextRequest, res: NextResponse, next: NextChainCallback) => {
            next();
            return res;
        }
    };


    private fallbackCallback: FallbackRouterCallback | null = null;
    private middlewares: { id: any, method: HttpMethods, callback: RouterCallback }[] = [];



    addMiddleware({ method, callback } : { method: HttpMethods, callback: RouterCallback } ) {
        this.middlewares.push({ id: shortid(), method, callback });
    }


    addMiddlewareByMultipleMethods({ methods = Object.values(HttpMethods), callback } : { methods: HttpMethods[], callback: RouterCallback }){
        methods.map(method => this.addMiddleware({ method, callback }));
    }


    fallback(callback: RouterCallback){
        this.fallbackCallback = callback;
    }


    use(method: HttpMethods = 'GET', callback: RouterCallback) {
        this.methodCallbacks[method] = callback;
    }

    get(callback: RouterCallback) {
        this.methodCallbacks.GET = callback;
    }

    post(callback: RouterCallback) {
        this.methodCallbacks.POST = callback;
    }

    put(callback: RouterCallback) {
        this.methodCallbacks.PUT = callback;
    }

    delete(callback: RouterCallback) {
        this.methodCallbacks.DELETE = callback;
    }

    options(callback: RouterCallback) {
        this.methodCallbacks.OPTIONS = callback;
    }

    trace(callback: RouterCallback) {
        this.methodCallbacks.TRACE = callback;
    }

    connect(callback: RouterCallback) {
        this.methodCallbacks.CONNECT = callback;
    }

    patch(callback: RouterCallback) {
        this.methodCallbacks.PATCH = callback;
    }

    head(callback: RouterCallback) {
        this.methodCallbacks.HEAD = callback;
    }




    private async chainCall(req: NextRequest, callbacks: RouterCallback[] = []) {
        const callbackLength = callbacks.length;
        const res = new NextResponse();
        let index: number = -1;
        let passdata: any = {};
        try{
            const response = await new Promise(async (resolve, reject) => {
                const next = async (chainResult: any | null) => {
                    index = index + 1;
                    const i = index;
                    if(index > callbackLength) return;
                    let r;
                    try{
                        r = await callbacks[index](req, res, next, { passdata, chainResult });
                    }catch(error){
                        r = await this.fallbackCallback?.(req, res, error);
                        return reject(r);
                    }
                    if(r instanceof NextResponse) {
                        resolve(r);
                    }
                }
                await next({ passdata, chainResult: null });
            })
            return response;
        }catch(errorResponse){
            return errorResponse;
        }
    }




    handler() {
        const self = this;
        return Object.entries(HttpMethods).reduce((prev, [key, value]) => {
            const p: any = { ...prev };
            p[value] = async (req: NextRequest) => {
                const middlewares = this.middlewares.filter(mid => mid.method == value).map(mid => mid.callback);
                const cb = self.methodCallbacks[req.method as HttpMethods]
                console.log(req.method);
                if (cb)
                    return await this.chainCall(req, [...middlewares, cb])
                else 
                    return await this.chainCall(req, middlewares);
            }
            return p;
        }, {});
    }
}


