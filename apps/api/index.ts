import { QueueName, log, JobPayload, create_redis_client,DELAY_QUEUE } from "../../packages/shared";

const port = 3000;
const redis = create_redis_client("api");

log("API", `Starting Api Server on port ${port}`);
log("API", `Targeting Queue: ${QueueName}`);

Bun.serve({
  port,
  async fetch(req) {
    const url = new URL(req.url);

    if (req.method === "POST" && url.pathname === "/jobs") {
      const job_data = await req.json();

      const job: JobPayload = {
        id: crypto.randomUUID(),
        type: "email",
        data: job_data,
        created_at: Date.now(),
        retries: 0
      };
      const delay = job_data.delay || 0;
      if(delay>0){
        const runAt=Date.now()+delay;
        await redis.zadd(DELAY_QUEUE,runAt,JSON.stringify(job));
        log("API",`Scheduled JOB ${job.id} for ${new Date(runAt).toISOString}`);
      }else{
        await redis.lpush(QueueName, JSON.stringify(job));
        log("API", `Job Enqueued ${job.id}`);
      }


      return new Response(
        JSON.stringify({
          id: job.id,
          status: "queued",
          statusbar: {
            progress: 0,
            message: "Waiting in queue"
          }
        }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response("Not Found", { status: 404 });
  }
});
