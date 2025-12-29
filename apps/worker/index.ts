import { log, QueueName, create_redis_client, JobPayload, PROCESSING_QUEUE } from "@local/shared";
const redis = create_redis_client("WORKER");
async function startWorker() {
    log("WORKER", "Waiting for jobs...");
    while (true) {
        try {
            const rawJob = await redis.brpoplpush(QueueName, PROCESSING_QUEUE, 0);

            if (rawJob) {
                const job: JobPayload = JSON.parse(rawJob);

                log("WORKER", `Processing Job: ${job.id}`);
                await new Promise(r => setTimeout(r, 1000))
                await redis.lrem(PROCESSING_QUEUE, 1, rawJob);
                log("WORKER", `Job ${job.id} Completed & Removed from Processing Queue`);
            }
        } catch (error) {
            console.error("Worker Error:", error);
            await new Promise(r => setTimeout(r, 1000));
        }
    }
}

startWorker();