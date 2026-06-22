import DbConnection from "../../DB/models/connection.js";

export const getAllProducts = async (req, res) => {
    const letters = req.query.letters; // لو مفيش letters، نخليها string فاضية
    DbConnection.execute('SELECT * FROM products WHERE title LIKE ?', [`%${letters || ''}%`])
        .then(([rows]) => {
            res.json(rows);
        })
        // لو فيه أي خطأ في قاعدة البيانات، نرجع للعميل رسالة خطأ عامة
        .catch((err) => {
            console.error('Error fetching products:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        }); 

}
export const createProduct = async (req, res) => {
    const { title, content, user_id } = req.body;

    if (!title || !content || !user_id) {
        return res.status(400).json({ error: 'Title, content, and user_id are required' });
    }

    try {
        const [result] = await DbConnection.execute(
            'INSERT INTO products (title, content, user_id) VALUES (?,?,?)',
            [title, content, user_id]
        );

        return res.status(201).json({
            message: 'Product created',
            productId: result.insertId
        });
    } catch (err) {
        if (err.code === 'ER_NO_REFERENCED_ROW_2') {
            return res.status(400).json({ error: 'User does not exist' });
        }

        console.error('Error creating product:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};  
