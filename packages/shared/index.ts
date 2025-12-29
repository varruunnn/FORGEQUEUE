export * from "./redis"
export const QueueName = "forge-queue";
export const PROCESSING_QUEUE = "default-queue:processing";
export interface JobPayload {
    id: string;
    type: "email" | "report";
    data: Record<string,any>;
}

export const log = (source: string,msg:string)=>{
    console.log(`[${new Date().toISOString()}] [${source}] ${msg}`);
}