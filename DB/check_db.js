// بنستورد mysql2 بنسخة promise عشان نستخدم async / await
import mysql from 'mysql2/promise';

// الدالة دي ملف مساعد للتأكد من قواعد البيانات الموجودة
async function check() {
  // بنفتح اتصال مباشر مع MySQL
  // هنا مش بنحدد database لأننا عايزين نشوف كل قواعد البيانات
  const conn = await mysql.createConnection({
    host: process.env.MYSQL_HOST || 'localhost',
    port: Number(process.env.MYSQL_PORT) || 3306,
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || ''
  });

  try {
    // الأمر ده بيرجع كل قواعد البيانات الموجودة على MySQL
    const [dbs] = await conn.query('SHOW DATABASES');

    console.log('Databases:');

    // بنلف على كل قاعدة بيانات ونطبع اسمها
    for (const row of dbs) {
      // MySQL بيرجع اسم قاعدة البيانات داخل object
      // Object.values(row)[0] بتجيب أول قيمة، وهي اسم قاعدة البيانات
      const dbName = Object.values(row)[0];

      process.stdout.write(`- ${dbName}`);

      try {
        // بنحاول نجيب الجداول الموجودة داخل قاعدة البيانات الحالية
        const [tables] = await conn.query(`SHOW TABLES FROM \`${dbName}\``);

        // بنحول نتيجة الجداول إلى array فيها أسماء الجداول فقط
        const tableNames = tables.map(r => Object.values(r)[0]);

        // لو قاعدة البيانات فيها جدول users، بنطبع ملاحظة جنبها
        if (tableNames.includes('users')) {
          console.log('  ✅ contains table `users`');
        } else {
          console.log('');
        }
      } catch (err) {
        console.log(`  (cannot list tables: ${err.message})`);
      }
    }
  } catch (err) {
    // لو معرفناش نجيب قواعد البيانات، بنطبع الخطأ ونوقف العملية
    console.error('Failed to list databases:', err.message);
    process.exit(1);
  } finally {
    // بنقفل الاتصال في النهاية سواء حصل نجاح أو خطأ
    await conn.end();
  }
}

// بنشغل الدالة
check();
