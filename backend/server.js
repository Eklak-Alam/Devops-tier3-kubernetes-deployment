const express = require('express');
const cors = require('cors');
const db = require('./config/db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;


// --- AUTO-INITIALIZATION SCRIPT ---
const initDB = async () => {
    try {
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS deployments (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                status VARCHAR(50) DEFAULT 'Pending',
                replicas INT DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        await db.query(createTableQuery);
        console.log('✅ Database Tables Verified/Created');

        const [rows] = await db.query('SELECT COUNT(*) as count FROM deployments');
        if (rows[0].count === 0) {
             const seedQuery = `
                INSERT INTO deployments (name, status, replicas) VALUES 
                ('frontend-service', 'Running', 3),
                ('auth-middleware', 'Stable', 2);
             `;
             await db.query(seedQuery);
             console.log('🌱 Initial Data Seeded');
        }
    } catch (error) {
        console.error('❌ InitDB Error:', error.message);
    }
};

initDB();

// --- CRUD ROUTES ---

// 1. READ (Get All)
app.get('/api/deployments', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM deployments ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 2. CREATE (Post New)
app.post('/api/deployments', async (req, res) => {
    const { name, replicas } = req.body;
    try {
        const query = 'INSERT INTO deployments (name, status, replicas) VALUES (?, ?, ?)';
        const [result] = await db.query(query, [name, 'Initializing', replicas || 1]);
        const [newItem] = await db.query('SELECT * FROM deployments WHERE id = ?', [result.insertId]);
        res.json(newItem[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 3. UPDATE (Scale Replicas)
app.put('/api/deployments/:id', async (req, res) => {
    const { id } = req.params;
    const { replicas } = req.body; // We only update replicas for this demo
    try {
        await db.query('UPDATE deployments SET replicas = ? WHERE id = ?', [replicas, id]);
        // Return the updated object
        const [updatedItem] = await db.query('SELECT * FROM deployments WHERE id = ?', [id]);
        res.json(updatedItem[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 4. DELETE (Remove Deployment)
app.delete('/api/deployments/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM deployments WHERE id = ?', [id]);
        res.json({ message: 'Deployment deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Backend Server Running on Port ${PORT}`);
});