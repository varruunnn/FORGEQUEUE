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

//Logic only man!
/*
job -> increment count (retry) -> retry>  MAX
Move to failed -> else Move to main try again -> remove 
*/
export const RETRY_SCRIPT = `
  local processingQueue = KEYS[1]
  local mainQueue = KEYS[2]
  local failedQueue = KEYS[3]
  local jobRaw = ARGV[1]
  
  local job = cjson.decode(jobRaw)
  job.retries = (job.retries or 0) + 1
  
  local maxRetries = 3
  local newJobJson = cjson.encode(job)

  -- Remove from processing list (ACK the bad attempt)
  redis.call("LREM", processingQueue, 1, jobRaw)

  if job.retries >= maxRetries then
    -- Dead Letter Queue
    redis.call("LPUSH", failedQueue, newJobJson)
    return "failed"
  else
    -- Retry (Re-queue)
    redis.call("LPUSH", mainQueue, newJobJson)
    return "retrying"
  end
`;