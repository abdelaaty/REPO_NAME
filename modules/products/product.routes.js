// Router بيساعدنا نعمل مسارات خاصة بالمنتجات
import { Router } from 'express';

// بنستورد كل دوال المنتجات تحت اسم productController
import { getAllProducts, createProduct } from './product.controller.js';

// بننشئ router جديد خاص بالمنتجات
const router = Router();

// لما العميل يعمل GET على /products
// هتنفذ دالة getAllProducts
router.get('/', getAllProducts);

// لما العميل يعمل POST على /products
// هتنفذ دالة createProduct
router.post('/', createProduct);

// بنصدر router عشان index.js يستخدمه
export default router;
