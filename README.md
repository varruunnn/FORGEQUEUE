## Architecture
This project implements a distributed job queue pattern using **Redis** as the message broker.

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
