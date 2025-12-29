import { QueueName, log, JobPayload, create_redis_client } from "../../packages/shared";

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
        data: job_data
      };

      await redis.lpush(QueueName, JSON.stringify(job));

      log("API", `Job Enqueued ${job.id}`);

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
