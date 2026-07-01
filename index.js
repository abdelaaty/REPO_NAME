// بنستورد Express عشان نعمل السيرفر والـ API
import express from 'express';

// بنستورد راوتس المستخدمين والمنتجات
import userRoutes from './modules/Users/user.routes.js';
import productRoutes from './modules/products/product.routes.js';

// بنستورد اتصال قاعدة البيانات عشان نختبر الاتصال قبل تشغيل السيرفر
import DbConnection from './DB/models/connection.js';

// بنستورد دالة بتتأكد إن قاعدة البيانات والجدول موجودين
import { initializeDatabase } from './DB/init_db.js';

// هنا بننشئ تطبيق Express
const app = express();

// Middleware بسيط بينضف الرابط من المسافات
// مثال: /users%20 تتحول إلى /users
app.use((req, res, next) => {
    try {
        req.url = decodeURIComponent(req.url).replace(/\s+/g, '');
    } catch (err) {
        // لو الرابط فيه encoding غلط، بنتجاهل الخطأ ونكمل عادي
    }

    // next معناها: كمل للـ middleware أو route اللي بعده
    next();
});

// السطر ده مهم جدا عشان Express يقدر يقرأ JSON اللي جاي في body
// من غيره req.body هتبقى undefined
app.use(express.json());

// أي request يبدأ بـ /users هيتحول لملف user.routes.js
// مثال: POST /users هيشغل createUser
app.use('/users', userRoutes);

// أي request يبدأ بـ /products هيتحول لملف product.routes.js
app.use('/products', productRoutes);


// دالة مسؤولة عن تجهيز قاعدة البيانات وتشغيل السيرفر
async function startServer() {
    try {
        // بنتأكد إن قاعدة البيانات وجدول users موجودين
        await initializeDatabase();

        // بنجرب ناخد اتصال من قاعدة البيانات
        // لو فيه مشكلة في MySQL، الكود هيدخل catch
        const connection = await DbConnection.getConnection();
        console.log('Database connection established');

        // بنرجع الاتصال للـ pool بعد ما اتأكدنا إنه شغال
        connection.release();

        // هنا بنشغل السيرفر على port 3000
        app.listen(3000, () => {
            console.log('Server is running on port 3000');
        });
    } catch (err) {
        // لو حصل خطأ في الاتصال بقاعدة البيانات أو تشغيلها، بنطبعه
        console.error('Error connecting to the database:', err);

        // بنوقف التطبيق لأن السيرفر من غير قاعدة بيانات مش هيشتغل صح
        process.exit(1);
    }
}

// بنبدأ تشغيل التطبيق
startServer();
