import shortid from 'shortid';
import { NextRequest, NextResponse } from 'next/server';
import { HttpMethods, HttpResponse } from 'standard-http-response-js';





export declare type NextAPIOptions = { params: any }
export declare type Data = { nextOptions?: any, passdata?: any, chainResult?: any, query?: any, pathParams?: any, body?: object };
export declare type NextChainCallback = (value?: any | null) => Promise<NextResponse | undefined | null | any>;
export declare type RouterCallback = (req: NextRequest, next: NextChainCallback, data: Data) => void | NextResponse | Promise<void> | Promise<NextResponse>;
export declare type FallbackRouterCallback = (req: NextRequest, error: any, data: Data) => void | NextResponse | Promise<void> |  Promise<NextResponse>;
export declare type MethodCallbacks = Record<HttpMethods, RouterCallback | null | any>;




export class MethodRouter {


    public constructor(prop : { middlewares: RouterCallback[] } = { middlewares: [] } ){
        prop.middlewares.forEach(mid => this.addMiddlewareByMultipleMethods({ callback: mid }));
    }

    private methodCallbacks: MethodCallbacks = {
        GET: null,
        POST: null,
        PUT: null,
        DELETE: null,
        PATCH: null,
        HEAD: null,
        CONNECT: null,
        TRACE: null,
        OPTIONS: (req: NextRequest, next: NextChainCallback) => {
            next();
            return NextResponse.next();
        }
    };


    private fallbackCallback: FallbackRouterCallback | null = null;
    private middlewares: { id: any, method: HttpMethods, callback: RouterCallback }[] = [];



    addMiddleware({ method, callback } : { method: HttpMethods, callback: RouterCallback } ) {
        this.middlewares.push({ id: shortid(), method, callback });
    }


    addMiddlewareByMultipleMethods({ methods = Object.values(HttpMethods), callback } : { methods?: HttpMethods[], callback: RouterCallback }){
        methods.map(method => this.addMiddleware({ method, callback }));
    }


    fallback(callback: FallbackRouterCallback){
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




    private async chainCall(req: NextRequest, nextOptions: any, callbacks: RouterCallback[] = []) {
        const callbackLength = callbacks.length;
        let index: number = -1;
        let passdata: any = {};
        let query = {};
        let body = {};
        let pathParams: any = {};
        try{
            const response = await new Promise(async (resolve, reject) => {
                const next = async (chainResult: any) => {
                    index = index + 1;
                    const i = index;
                    if(index > callbackLength) return;
                    let r;
                    try{
                        r = await callbacks[index](req, next, { passdata, chainResult, pathParams, query, body, nextOptions });
                    }catch(error){
                        r = await this.fallbackCallback?.(req, error, { passdata, chainResult, pathParams, query, body, nextOptions });
                        return reject(r);
                    }
                    if(!!r) {
                        return resolve(r);
                    }
                }
                await next({ passdata, chainResult: null });
            })
            return response;
        }catch(errorResponse){
            return errorResponse;
        }
    }




    handler() : MethodCallbacks {
        const self = this;
        const handle = Object.entries(HttpMethods).reduce((prev, [key, value]) => {
            const p: any = { ...prev };
            p[value] = async (req: NextRequest, opt: any) => {
                const middlewares = this.middlewares.filter(mid => mid.method == value).map(mid => mid.callback);
                const cb = self.methodCallbacks[req.method as HttpMethods]
                console.log(`[METHOD ROUTER: ${req.method}]`);
                if (cb)
                    return await this.chainCall(req, opt, [...middlewares, cb])
                else 
                    return await this.chainCall(req, opt, middlewares);
            }
            return p;
        }, {
            GET: null,
            POST: null,
            PUT: null,
            DELETE: null,
            PATCH: null,
            HEAD: null,
            CONNECT: null,
            TRACE: null,
            OPTIONS: null
        });
        return handle;
    }
}
