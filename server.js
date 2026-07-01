import "dotenv/config";
import app from "./app.js";
import DbConnection from "./DB/models/connection.js";

const PORT = process.env.APP_PORT || 3000;

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));


async function connectWithRetry() {

  let retries = 20;

  while (retries > 0) {

    try {

      const connection = await DbConnection.getConnection();

      console.log("✅ Database connected");

      connection.release();

      return;

    } catch (error) {

      retries--;

      console.log(
        `⏳ Database not ready. retries left: ${retries}`
      );

      await sleep(3000);
    }
  }


  throw new Error("❌ Database connection failed");

}



async function startServer(){

 try {

   await connectWithRetry();


   app.listen(PORT, "0.0.0.0", ()=>{

    console.log(`🚀 Server running on port ${PORT}`);

   });


 }catch(error){

   console.error(error);

   process.exit(1);

 }

}


startServer();