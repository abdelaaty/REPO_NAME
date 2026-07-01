// Router بيساعدنا نعمل مسارات خاصة بجزء معين من المشروع
// هنا الجزء ده هو users
import { Router } from 'express';

// بنستورد الدوال اللي هتتنفذ لما العميل يطلب مسارات المستخدمين
import { createUser, getAllUsers,updateUser } from './user.controller.js';

// بننشئ router جديد خاص بالمستخدمين
const router = Router();

// لما العميل يعمل GET على /users
// Express هينفذ دالة getAllUsers ويرجع كل المستخدمين
router.get('/', getAllUsers);

// لما العميل يعمل POST على /users
// Express هينفذ دالة createUser ويضيف مستخدم جديد
router.post('/', createUser);

router.put('/:id',updateUser);

// بنصدر router عشان index.js يقدر يستخدمه
export default router;
