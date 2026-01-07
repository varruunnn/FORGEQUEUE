export * from "./redis"
export const QueueName = "forge-queue";
export const PROCESSING_QUEUE = "default-queue:processing";
export const FAILED_QUEUE = "default-queue:failed";
export interface JobPayload {
    id: string;
    type: "email" | "report";
    data: Record<string,any>;
    created_at :number;
    retries :number;
}

export const log = (source: string,msg:string)=>{
    console.log(`[${new Date().toISOString()}] [${source}] ${msg}`);
}