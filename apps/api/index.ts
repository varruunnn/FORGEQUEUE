import { QueueName , log } from "../../packages/shared";
const port = 3000;

log("API",`Starting Api Server on port ${port}`);
log("API",`Targeting Queue:  ${QueueName}`);

Bun.serve({
    port: port,
    fetch(req){
        return new Response("Api is running")
    }
})