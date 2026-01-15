const api_url = "http://localhost:3000/jobs";

async function flood() {
    console.log("launching 50Jobs")
    const start = Date.now();

    const p: Array<Promise<Response>> = [];
    for (let i = 1; i <= 50; i++) {
        p.push(
            fetch(api_url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    msg: `Job ${i}`,
                    sleep: 1000,
                }),
            })
        );
    }

    await Promise.all(p);
    console.log(`50 Jobs sent in ${(Date.now() - start) / 1000}s`);
}

await flood();

export {};
