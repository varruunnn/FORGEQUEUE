import { create_redis_client, QueueName, PROCESSING_QUEUE, FAILED_QUEUE } from "./packages/shared";

const redis = create_redis_client("CLEANER");

async function clear() {
  console.log("Clearing all queues...");

  // Delete the specific keys used by our app
  const keys = [QueueName, PROCESSING_QUEUE, FAILED_QUEUE, "default-queue:delayed"];
  
  const result = await redis.del(keys);
  
  console.log(`Deleted ${result} keys.`);
  console.log("Redis is clean. You can start fresh.");
  process.exit(0);
}

clear();