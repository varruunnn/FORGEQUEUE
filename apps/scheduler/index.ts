import { log, QueueName, PROCESSING_QUEUE,DELAY_QUEUE, create_redis_client, JobPayload } from "@local/shared";

const redis = create_redis_client("SCHEDULER");
const TIMEOUT_MS = 30 * 1000; // 30 seconds visibility timeout

async function runScheduler() {
  log("SCHEDULER", "Started. Monitoring for stale jobs...");

  setInterval(async () => {
    const now = Date.now();

    const processingJobs = await redis.lrange(PROCESSING_QUEUE, 0, -1);

    for (const rawJob of processingJobs) {
      try {
        const job: JobPayload = JSON.parse(rawJob);
        
        const jobTime = job.created_at || 0; 
        
        if (now - jobTime > TIMEOUT_MS) {
          log("SCHEDULER", `Found stale job: ${job.id}. Recovering...`);
          job.created_at = Date.now();
          const newJobJson = JSON.stringify(job);
          const multi = redis.multi();
          multi.lrem(PROCESSING_QUEUE, 1, rawJob);
          multi.lpush(QueueName, newJobJson);
          await multi.exec();
          
          log("SCHEDULER", `Recovered Job ${job.id} (Reset Timer)`);
        }
      } catch (e) {
        console.error("Error parsing job", e);
      }
    }
    //10 items per tick to avoid blocking single thread;;;
    const dueJobs = await redis.zrangebyscore(DELAY_QUEUE,0,now,"LIMIT",0,10);
    for(const rawJob of dueJobs){
      const multi = redis.multi();
      multi.zrem(DELAY_QUEUE,rawJob)
      multi.lpush(QueueName,rawJob)
      await multi.exec();
      const job = JSON.parse(rawJob);
      log("sche-",`Promoted delayed job ${job.id} to main`)
    }
  }, 1000); 
}

runScheduler();