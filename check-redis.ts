import { create_redis_client, FAILED_QUEUE, PROCESSING_QUEUE, QueueName } from "./packages/shared";


const redis = create_redis_client("CHECKER");

async function check() {
  const waiting = await redis.lrange(QueueName, 0, -1);
  const processing = await redis.lrange(PROCESSING_QUEUE, 0, -1);
  const failed = await redis.lrange(FAILED_QUEUE, 0, -1);

  console.log("--- REDIS STATE ---");
  console.log(`WAITING (${waiting.length}):`, waiting.map(j => JSON.parse(j).id));
  console.log(`PROCESSING (${processing.length}):`, processing.map(j => JSON.parse(j).id));
  console.log(`FAILED/DLQ (${failed.length}):`, failed.map(j => JSON.parse(j).id));
  console.log("-------------------");
  process.exit(0);
}

check();