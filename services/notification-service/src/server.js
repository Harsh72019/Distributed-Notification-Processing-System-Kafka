const connectDB = require('./config/db');
const startConsumer = require('./kafka/consumer');
const app = require('./app');

async function start() {
  await connectDB();
  await startConsumer();

  app.listen(3000, () => {
    console.log("Server started:", process.env.INSTANCE_ID);
  });
}

start();