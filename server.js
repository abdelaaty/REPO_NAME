import "dotenv/config";
import app from './app.js';
import DbConnection from './DB/models/connection.js';

console.log(process.env.MYSQL_HOST);
async function startServer(){

 try {

   const connection = await DbConnection.getConnection();

   console.log("Database connected");

   connection.release();


   app.listen(3000,()=>{
     console.log("Server running");
   });


 } catch(error){

   console.error(error);
   process.exit(1);

 }

}


startServer();