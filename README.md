# `nextjs-13-api-middleware`



For Nextjs 12, please use this packge [nextjs-12-api-middleware]('https://github.com/jianshangquan/nextjs-12-api-middleware')


### Sample


```javascript

// nextjs 13 folder structure
//     Project folder
//         |   public
//         |   src
//             |   app
//                 |   page
//                 |   api
//                     |   route.js/ts


// @ route.js file

// Replace 
import { NextResponse } from 'next/server';
export function GET(req) {
    return NextResponse.json({})
}


// with
import { MethodRouter } from 'nextjs-13-api-middleware';
const router = new MethodRouter();

router.get(async (req, next, prop) => {
    // your code here...
    return NextResponse.json()
});

const handler = router.handler();
export const GET = handler.GET;
export const POST = handler.POST;
export const PUT = handler.PUT;
export const DELETE = handler.DELETE;
        
```







#### Constructor
```javascript
import { MethodRouter } from 'nextjs-13-api-middleware';

// your middleware 1
const customMiddleware = (req, next, prop) => {
    
}

// your middleware 2
const customMiddleware2 = (req, next, prop) => {
    
}

// CONSTRUCTOR
const router = new MethodRouter({ 
    middlewares: [ 
        customMiddleware, // add middleware when creating router
        customMiddleware2 // add middleware when creating router
    ] 
});

router.get(async (req, next, prop) => {
    // your code here...
    return NextResponse.json()
});

// ... rest of your code

```
##




#### Predefined middlewares
```javascript
import { ParamParser, PathParamParser, BodyParser } from 'nextjs-13-api-middleware';

const router = new MethodRouter({ 
    middlewares: [ ParamParser, PathParamParser, BodyParser ]
})

// ... your entire code

```
##



#### <code>prop</code> object
You will see <code>prop</code> in every middleware which is important.\
<code>prop</code> object contain important data.\

```javascript

// your middleware 1
const customMiddleware = (req, next, prop) => {
    /** 
     * 
     * `prop` object contain following properties
     * {
     *    // you can assign more data to `passdata` object from each middleware which allow to pass down data to every object
     *    passdata: {}, 
     * 
     *    // when calling next() in every middleware, the chain result will pass data to next middleware;
     *    // next('middleware1') => next middleware `chainResult` will be 'middleware1'
     *    // you can pass any data to next middleware by calling next() with param
     *    chainResult: undefined,
     * 
     *    // path param
     *    // this property will added if you use `PathParamParser` middleware 
     *    pathParams: { v1: [ 'v1fsd', 'fdsa', 'fdsa' ] },
     * 
     *    // query
     *    // this property will added if you use `ParamParser` middleware 
     *    query: { id: '1', name: 'aung aung' },
     * 
     *    // this property will added if you use `BodyParser` middleware
     *    body: {},
     * 
     *    // this is Next.js api default param from API
     *    nextOptions: { params: { v1: [Array] } }
     * }
     * 
    */
}
```
##





#### Middlewares
``` javascript

import { MethodRouter } from 'nextjs-13-api-middleware';
const router = new MethodRouter();


// add multiple middlewares
router.addMiddleware({ 
    method: 'GET', 
    callback: async (req, next, prop) => {

    }
})
router.addMiddleware({ 
    method: 'GET', 
    callback: async (req, next, prop) => {

    }
})

router.addMiddlewareByMultipleMethods({ 
    method: ['GET', 'POST', 'PUT'], 
    callback: async (req, next, prop) => {
        // this callback will called when request methods with
        // GET, POST, PUT
    }
})

router.get(async (req, next, prop) => {
    // your code here...
    return NextResponse.json()
});

const handler = router.handler();
export const GET = handler.GET;
export const POST = handler.POST;
export const PUT = handler.PUT;
export const DELETE = handler.DELETE;
```
##




#### <code>use</code> function

```javascript


import { MethodRouter } from 'nextjs-13-api-middleware';
const router = new MethodRouter();


// add multiple middlewares
// ...


/** 
 * 
 * You can also call use instead of post() function
 * router.use('POST', (req, next, prop) => {})
 * router.post((req, next, prop) => {})
 * 
*/
router.use('POST', (req, next, prop) => {

});
router.get(async (req, next, prop) => {
    // your code here...
    // fallback callback will called if you also throw an error;
    return NextResponse.json()
});


// Fallback
// this callback will called if one of chain middlewares throw an errors;
router.fallback(async (req, error, prop) => {

})

const handler = router.handler();
export const GET = handler.GET;
export const POST = handler.POST;
export const PUT = handler.PUT;
export const DELETE = handler.DELETE;

```
##



#### HttpMethods

package support Http methods 
<code>POST</code> <code>PUT</code> <code>DELETE</code> <code>GET</code> <code>PUT</code> <code>TRACE</code> <code>OPTIONS</code> <code>PATCH</code> <code>CONNECT</code> <code>HEAD</code>

```javascript


import { MethodRouter } from 'nextjs-13-api-middleware';
import { NextResponse } from 'next/server';
const router = new MethodRouter();


// add multiple middlewares
// ...

// SUPPORTED HTTP METHODS
router.get(async (req, next, prop) => {});
router.post(async (req, next, prop) => {});
router.put(async (req,  next) => {});
router.delete(async (req,  next) => {});
router.options(async (req,  next) => {});
router.patch(async (req,  next) => {});
router.head(async (req,  next) => {});
router.trace(async (req,  next) => {});
router.connect(async (req,  next) => {});


const handler = router.handler();
export const GET = handler.GET;
export const POST = handler.POST;
export const PUT = handler.PUT;
export const DELETE = handler.DELETE;
export const OPTIONS = handler.OPTIONS;
// ...
// ... also don't forget to add each method;

```
##



#### Fallback

```javascript


import { MethodRouter } from 'nextjs-13-api-middleware';
const router = new MethodRouter();


// add multiple middlewares
// ...
router.addMiddleware({ 
    method: 'GET', 
    callback: async (req, next, prop) => {
        const user = {} // check db from user
        if(!user.allowed) {
            throw new Error('Your are not authorized')
        }
    }
})

router.get(async (req, next, prop) => {
    // your code here...
    // fallback callback will called if you also throw an error;
    return NextResponse.json()
});


// Fallback
// this callback will called if one of chain middlewares throw an errors;
router.fallback(async (req, error) => {

})

const handler = router.handler();
export const GET = handler.GET;
export const POST = handler.POST;
export const PUT = handler.PUT;
export const DELETE = handler.DELETE;

```



