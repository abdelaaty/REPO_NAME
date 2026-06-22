// بنستورد اتصال قاعدة البيانات عشان نقدر ننفذ أوامر SQL
import DbConnection from '../../DB/models/connection.js';

// الدالة دي مسؤولة عن جلب كل المستخدمين من جدول users
export const getAllUsers = async (req, res) => 
    {
        const letters = req.query.letters; // لو مفيش letters، نخليها string فاضية
        //
        DbConnection.execute('SELECT * FROM users WHERE name LIKE ?', [`%${letters  || ''}%`])
            .then(([rows]) => {
                res.json(rows);
            })
            // لو فيه أي خطأ في قاعدة البيانات، نرجع للعميل رسالة خطأ عامة
            .catch((err) => {
                console.error('Error fetching users:', err);
                res.status(500).json({ error: 'Internal Server Error' });
            });
    };

// الدالة دي مسؤولة عن إنشاء مستخدم جديد
export const createUser = async (req, res) => {
    // بنقرأ البيانات اللي جاية من جسم الطلب body
    // مثال body:
    // {
    //   "name": "Ahmed",
    //   "email": "ahmed@test.com",
    //   "password": "123456"
    // }
    const { name, email, password } = req.body;

    // هنا بنتأكد إن المستخدم بعت كل البيانات المطلوبة
    // لو أي قيمة ناقصة، بنرجع خطأ 400 ومعناه إن الطلب نفسه ناقص أو غلط
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    try {
        // بنضيف المستخدم الجديد في جدول users
        // علامات ? بتحمي الكود من SQL Injection وبتخلي القيم تتبعت بشكل آمن
        const [result] = await DbConnection.execute(
            'INSERT INTO users (name, email, password) VALUES (?,?,?)',
            [name, email, password]
        );

        // لو الإضافة نجحت، بنرجع status 201 ومعناه إن حاجة جديدة اتعملت
        // insertId هو رقم المستخدم الجديد اللي اتولد تلقائيا في قاعدة البيانات
        return res.status(201).json({
            message: 'User created',
            userId: result.insertId
        });
    } catch (err) {
        // لو الإيميل موجود قبل كده، MySQL بيرجع الكود ده لأن عمود email معمول unique
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'Email already exists' });
        }

        // أي خطأ تاني بنطبعه في التيرمنال عشان نقدر نصلحه
        console.error('Error creating user:', err);

        // وبنرجع رسالة عامة للعميل بدل ما نعرض تفاصيل تقنية
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
