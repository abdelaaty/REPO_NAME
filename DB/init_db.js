
// بنستورد mysql2 بنسخة promise عشان نقدر نستخدم async / await  
import mysql from 'mysql2/promise';

// اسم قاعدة البيانات الافتراضية اللي التطبيق هيشتغل عليها
const DB_NAME = process.env.MYSQL_DATABASE || 'users';
 // الدالة دي بتتأكد إن قاعدة البيانات وجدول users موجودين  
async function ensureDbAndTable(conn, dbName) {
  // بننشئ قاعدة البيانات لو مش موجودة، وبعدين بنستخدمها
  await conn.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
  // بنستخدم قاعدة البيانات دي عشان نقدر نشتغل عليها
  await conn.query(`USE \`${dbName}\``);
  // بننشئ جدول users لو مش موجود، وبعدين بنحدد الأعمدة اللي فيه
  await conn.query(`CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY, 
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);
  await conn.query(`CREATE TABLE IF NOT EXISTS products
    (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL ,
    user_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    )`);
  // بنطبع رسالة تأكيد إن قاعدة البيانات وجدول users موجودين
  console.log(`Ensured database ${dbName} and table users`);
}

// الدالة دي مسؤولة عن تجهيز قاعدة البيانات وتشغيل السيرفر
export async function initializeDatabase() {
  const conn = await mysql.createConnection({
    host: process.env.MYSQL_HOST || 'localhost',
    port: Number(process.env.MYSQL_PORT) || 3306,
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || ''
  });

  try {
    await ensureDbAndTable(conn, DB_NAME);
  } catch (err) {
    console.error('Failed to initialize DB:', err);
    throw err;
  } finally {   
    await conn.end();
  }
}
// لو الملف ده اتشغل مباشرة من command line، بننفذ الدالة initializeDatabase
if (process.argv[1] && process.argv[1].endsWith('init_db.js')) {
  initializeDatabase().catch(() => {
    process.exit(1);
  });
}
