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

router.get(async (req, res, next) => {
    // your code here...
    return res.json()
});

const handler = router.handler();
export const GET = handler.GET;
export const POST = handler.POST;
export const PUT = handler.PUT;
export const DELETE = handler.DELETE;
        
```




#### Middlewares
``` javascript

import { MethodRouter } from 'nextjs-13-api-middleware';
const router = new MethodRouter();


// add multiple middlewares
router.addMiddleware({ 
    method: 'GET', 
    callback: async (req, res, next) => {

    }
})
router.addMiddleware({ 
    method: 'GET', 
    callback: async (req, res, next) => {

    }
})

router.addMiddlewareByMultipleMethods({ 
    method: ['GET', 'POST', 'PUT'], 
    callback: async (req, res, next) => {
        // this callback will called when request methods with
        // GET, POST, PUT
    }
})

router.get(async (req, res, next) => {
    // your code here...
    return res.json()
});

const handler = router.handler();
export const GET = handler.GET;
export const POST = handler.POST;
export const PUT = handler.PUT;
export const DELETE = handler.DELETE;
```





#### <code>use</code> function

```javascript


import { MethodRouter } from 'nextjs-13-api-middleware';
const router = new MethodRouter();


// add multiple middlewares
// ...


/** 
 * 
 * You can also call use instead of post() function
 * router.use('POST', (req, res, next) => {})
 * router.post((req, res, next) => {})
 * 
*/
router.use('POST', (req, res, next) => {

});
router.get(async (req, res, next) => {
    // your code here...
    // fallback callback will called if you also throw an error;
    return res.json()
});


// Fallback
// this callback will called if one of chain middlewares throw an errors;
router.fallback(async (req, res, error) => {

})

const handler = router.handler();
export const GET = handler.GET;
export const POST = handler.POST;
export const PUT = handler.PUT;
export const DELETE = handler.DELETE;

```


#### HttpMethods

package support Http methods 
<code>POST</code> <code>PUT</code> <code>DELETE</code> <code>GET</code> <code>PUT</code> <code>TRACE</code> <code>OPTIONS</code> <code>PATCH</code> <code>CONNECT</code> <code>HEAD</code>

```javascript


import { MethodRouter } from 'nextjs-13-api-middleware';
const router = new MethodRouter();


// add multiple middlewares
// ...

// SUPPORTED HTTP METHODS
router.get(async (req, res, next) => {});
router.post(async (req, res, next) => {});
router.put(async (req, res, next) => {});
router.delete(async (req, res, next) => {});
router.options(async (req, res, next) => {});
router.patch(async (req, res, next) => {});
router.head(async (req, res, next) => {});
router.trace(async (req, res, next) => {});
router.connect(async (req, res, next) => {});


const handler = router.handler();
export const GET = handler.GET;
export const POST = handler.POST;
export const PUT = handler.PUT;
export const DELETE = handler.DELETE;
export const OPTIONS = handler.OPTIONS;
// ...
// ... also don't forget to add each method;

```




#### Fallback

```javascript


import { MethodRouter } from 'nextjs-13-api-middleware';
const router = new MethodRouter();


// add multiple middlewares
// ...
router.addMiddleware({ 
    method: 'GET', 
    callback: async (req, res, next) => {
        const user = {} // check db from user
        if(!user.allowed) {
            throw new Error('Your are not authorized')
        }
    }
})

router.get(async (req, res, next) => {
    // your code here...
    // fallback callback will called if you also throw an error;
    return res.json()
});


// Fallback
// this callback will called if one of chain middlewares throw an errors;
router.fallback(async (req, res, error) => {

})

const handler = router.handler();
export const GET = handler.GET;
export const POST = handler.POST;
export const PUT = handler.PUT;
export const DELETE = handler.DELETE;

```



