

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// @virtualize
async function evaluate() {
    console.log("Waiting for 1 second...");
    await sleep(1000);
    console.log("Done!");
}

evaluate();
