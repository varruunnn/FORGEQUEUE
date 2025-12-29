export const QueueName = "forge-queue";

export interface JobPayload {
    id: string;
    type: "email" | "report";
    data: Record<string,any>;
}

export const log = (source: string,msg:string)=>{
    console.log(`[${new Date().toISOString()}] [${source}] ${msg}`);
}