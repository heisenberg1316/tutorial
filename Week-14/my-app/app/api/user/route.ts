import { NextRequest } from "next/server";


export async function POST(req : NextRequest) {
    const body = await req.json();
    console.log("body is ", body);

    return Response.json({
        name : body.name,
        email : body.email,
    })
}