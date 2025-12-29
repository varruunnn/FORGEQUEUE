import { create_redis_client, PROCESSING_QUEUE } from "./packages/shared";
const redis = create_redis_client("CHECKER");
const items = await redis.lrange(PROCESSING_QUEUE, 0, -1);
console.log("Stalled Jobs:", items);
process.exit(0);