const axios = require("axios");

const TOTAL_REQUESTS = 50;
const CONCURRENCY = 10;

async function sendNotification(i) {
  try {
    const res = await axios.post("http://localhost:8080/send", {
      userId: `user-${i % 5}`,   // repeating users to test idempotency/lock
      message: `Message ${i}`,
      type: "INFO"
    });

    console.log(`✅ Sent ${i}:`, res.data.status);
  } catch (err) {
    console.error(`❌ Error ${i}:`, err.message);
  }
}

async function runLoadTest() {
  console.log("🚀 Starting stress test...\n");

  const batches = Math.ceil(TOTAL_REQUESTS / CONCURRENCY);

  for (let b = 0; b < batches; b++) {
    const promises = [];

    for (let i = 0; i < CONCURRENCY; i++) {
      const index = b * CONCURRENCY + i;
      if (index >= TOTAL_REQUESTS) break;

      promises.push(sendNotification(index));
    }

    await Promise.all(promises);
  }

  console.log("\n🔥 Stress test completed.");
}

runLoadTest();