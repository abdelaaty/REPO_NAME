// بنستورد mysql2 بنسخة promise عشان نقدر نستخدم async / await
import mysql2 from 'mysql2/promise';

// createPool معناها إننا بنعمل مجموعة اتصالات بقاعدة البيانات
// ده أفضل من فتح اتصال جديد مع كل request
console.log("MYSQL_HOST =", process.env.MYSQL_HOST);
console.log("MYSQL_USER =", process.env.MYSQL_USER);
console.log("MYSQL_PASSWORD =", process.env.MYSQL_PASSWORD);
const DbConnection = mysql2.createPool({
    // السيرفر اللي عليه MySQL
    // لو شغالين من Docker Compose، القيمة هتبقى db
    // ولو شغالين عادي على الجهاز، القيمة الافتراضية localhost
    host: process.env.MYSQL_HOST || 'localhost',

    // رقم port الخاص بـ MySQL
    port: Number(process.env.MYSQL_PORT) || 3306,

    // اسم مستخدم MySQL
    user: process.env.MYSQL_USER || 'root',

    // كلمة مرور MySQL
    // لو عندك password للـ root حطها هنا
    password: process.env.MYSQL_PASSWORD || '',

    // اسم قاعدة البيانات اللي التطبيق هيشتغل عليها
    database: process.env.MYSQL_DATABASE || 'users'
});

// بنصدر الاتصال عشان نستخدمه في أي ملف محتاج يتعامل مع قاعدة البيانات
export default DbConnection;
