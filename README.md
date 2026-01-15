## Architecture
This project implements a distributed job queue pattern using **Redis** as the message broker.
<img width="1230" height="596" alt="image" src="https://github.com/user-attachments/assets/10772bc9-7356-41a4-acf6-a97ec315bb00" />
<img width="1024" height="559" alt="image" src="https://github.com/user-attachments/assets/f11d9eb6-75e5-41ea-a601-7f64427fb2fb" />

flowchart LR

    P[Producer<br/>(Bun API)]
    R[(Redis List)]
    C[Consumer<br/>(Bun Worker)]
    PQ[(Processing Queue)]
    D[(Done Queue)]
    S[Scheduler<br/>Rescue Service]

    P -- LPUSH --> R
    C -- BRPOPLPUSH --> R
    C -- Move Job --> PQ
    PQ -- ACK --> D
    S -- Rescue<br/>Stale Jobs --> PQ


##  Tech Stack
- **Runtime:** Bun (TypeScript)
- **Broker:** Redis 
- **Reliability:** At-Least-Once Delivery, Dead Letter Queues, Exponential Backoff.
