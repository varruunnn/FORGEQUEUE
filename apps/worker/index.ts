import { log ,  QueueName } from "../../packages/shared";

log("worker", `Worker started, Listening to ${QueueName}`)

setInterval(()=>{
    log("WORKER", "... => Waiting for jobs");
},5000)