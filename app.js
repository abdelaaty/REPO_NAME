// بنستورد Express عشان نعمل السيرفر والـ API
import express from 'express';

// بنستورد راوتس المستخدمين والمنتجات
import userRoutes from './modules/Users/user.routes.js';
import productRoutes from './modules/products/product.routes.js';

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

// بنبدأ تشغيل التطبيق
export default app;