import { NextRequest } from "next/server";
import { RouterCallback } from "./method-router";

export const ParamParser : RouterCallback = (req: NextRequest, next, { passdata, chainResult, query }) => {
    const searchParams = req.nextUrl.searchParams;
    searchParams.forEach((value, key) => {
        query[key] = value;
    })
    next();
}


export const PathParamParser: RouterCallback = (req: NextRequest, next, prop) => {
    Object.entries(prop.nextOptions.params).map(([key, value]) => {
        prop.pathParams[key] = value;
    })
    next();
}


export const BodyParser : RouterCallback = async (req: NextRequest, next, prop) => {
    try{
        prop.body = await req.json();
    }catch(e){} 
    next();
}

