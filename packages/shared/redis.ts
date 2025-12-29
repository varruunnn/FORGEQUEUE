import Redis from "ioredis";

const redis_url = process.env.redis_url || "redisLocalhost";

const isTls = redis_url.startsWith("rediss://");

export const create_redis_client=(serviceName:string)=>{
    const client = new Redis(redis_url,{
        maxRetriesPerRequest:null,
        tls: isTls?{
            rejectUnauthorized: false
        } : undefined
    })
    client.on("error",(err)=>{
        console.log(`${serviceName} Redis Error`,err)
    })
    client.on("connect",()=>{
        console.log(`${serviceName} Redis connected`)
    })
    return client;
}