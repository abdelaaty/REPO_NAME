import "dotenv/config";
import app from "./app.js";
import DbConnection from "./DB/models/connection.js";

const PORT = process.env.APP_PORT || 3000;

async function connectWithRetry(retries = 10) {
  while (retries > 0) {
    try {
      const connection = await DbConnection.getConnection();
      console.log("✅ Database connected");
      connection.release();
      return;
    } catch (err) {
      retries--;
      console.log(`Database not ready. Retrying... (${retries} retries left)`);
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }

  throw new Error("Could not connect to database.");
}

async function startServer() {
  try {
    await connectWithRetry();

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

startServer();