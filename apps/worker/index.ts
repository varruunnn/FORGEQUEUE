import { 
  log, QueueName, PROCESSING_QUEUE, FAILED_QUEUE, 
  create_redis_client, JobPayload, RETRY_SCRIPT 
} from "@local/shared";

const redis = create_redis_client("WORKER");

async function startWorker() {
  log("WORKER", "Waiting for jobs...");

  while (true) {
    let rawJob: string | null = null;
    
    try {
      rawJob = await redis.brpoplpush(QueueName, PROCESSING_QUEUE, 0);
      if (!rawJob) continue;

      const job: JobPayload = JSON.parse(rawJob);
      log("WORKER", `Processing Job: ${job.id} (Attempt ${(job.retries || 0) + 1})`);
      if (job.data.sleep) {
        log("WORKER", `Sleeping for ${job.data.sleep}ms... (KILL ME NOW TO TEST RECOVERY)`);
        await new Promise(r => setTimeout(r, job.data.sleep));
      } else {
        await new Promise(r => setTimeout(r, 1000));
      }
      if (job.data.shouldFail) {
        throw new Error("Simulated Failure!");
      }
      await redis.lrem(PROCESSING_QUEUE, 1, rawJob);
      log("WORKER", `Job ${job.id} Completed`);

    } catch (error) {
      console.error(`[WORKER] Job Failed: ${(error as Error).message}`);

      if (rawJob) {
        const action = await redis.eval(
          RETRY_SCRIPT, 
          3, 
          PROCESSING_QUEUE, QueueName, FAILED_QUEUE, 
          rawJob
        );
        log("WORKER", `Job Action: ${action}`);
      }
    }
  }
}

startWorker();