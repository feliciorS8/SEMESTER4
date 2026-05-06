const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');

const app = express();
const port = 5000;
const SECRET_KEY = 'your-secret-key-here-change-in-production';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Folder upload
const uploadFolder = path.join(__dirname, 'static/images/doctors');
if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder, { recursive: true });
}

// Static route untuk file uploads
app.use('/static', express.static(path.join(__dirname, 'static')));

// Konfigurasi db
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'dijahaechan', // Pass dari config Python
    database: 'rs_yasmin'
};

const pool = mysql.createPool(dbConfig);

// Multer Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadFolder);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// JWT Middleware for Admin Routes
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(403).json({ message: 'No token provided' });
    
    const token = authHeader.split(' ')[1];
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err || decoded.role !== 'admin') return res.status(401).json({ message: 'Unauthorized' });
        req.userId = decoded.id;
        next();
    });
};

/* ========================================
   ROUTES PUBLIK
   ======================================== */

// Home stats
app.get('/api/home', async (req, res) => {
    try {
        const [polis] = await pool.query("SELECT * FROM poli ORDER BY id");
        const [dokters] = await pool.query(`
            SELECT d.*, p.nama_poli 
            FROM dokter d 
            LEFT JOIN poli p ON d.poli_id = p.id 
            ORDER BY d.id
        `);
        const [[{total_dokter}]] = await pool.query("SELECT COUNT(*) as total_dokter FROM dokter");
        const [[{total_poli}]] = await pool.query("SELECT COUNT(*) as total_poli FROM poli");
        const [[{total_reservasi}]] = await pool.query("SELECT COUNT(*) as total_reservasi FROM reservasi");
        
        res.json({
            polis,
            dokters,
            stats: {
                total_dokter,
                total_poli,
                total_reservasi
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get dokter by poli
app.get('/api/dokter/:poli_id', async (req, res) => {
    try {
        const [dokters] = await pool.query("SELECT * FROM dokter WHERE poli_id = ?", [req.params.poli_id]);
        res.json(dokters);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Login
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const [users] = await pool.query("SELECT * FROM users WHERE username = ? AND password = ?", [username, password]);
        
        if (users.length > 0) {
            const user = users[0];
            const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, SECRET_KEY, { expiresIn: '24h' });
            res.json({
                message: 'Login successful',
                token,
                user: { id: user.id, username: user.username, role: user.role }
            });
        } else {
            res.status(401).json({ message: 'Username atau password salah!' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Reservasi
app.post('/api/reservasi', async (req, res) => {
    try {
        const { nama_pasien, no_wa, poli_id, dokter_id, tanggal, keluhan } = req.body;
        await pool.query(`
            INSERT INTO reservasi (nama_pasien, no_wa, poli_id, dokter_id, tanggal_reservasi, keluhan)
            VALUES (?, ?, ?, ?, ?, ?)
        `, [nama_pasien, no_wa, poli_id, dokter_id, tanggal, keluhan]);

        const [[dokter]] = await pool.query("SELECT * FROM dokter WHERE id = ?", [dokter_id]);
        const [[poli]] = await pool.query("SELECT * FROM poli WHERE id = ?", [poli_id]);
        
        // Return info for WhatsApp redirect logic in frontend
        res.json({
            message: 'Reservasi berhasil',
            data: {
                nama_pasien,
                poli_name: poli ? poli.nama_poli : '',
                nama_dokter: dokter ? dokter.nama_dokter : '',
                tanggal,
                keluhan,
                no_wa_dokter: dokter ? dokter.no_wa : ''
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/* ========================================
   ROUTES ADMIN (Requires Token)
   ======================================== */

// Admin Dashboard Stats
app.get('/api/admin/dashboard', verifyToken, async (req, res) => {
    try {
        const [[{total_dokter}]] = await pool.query("SELECT COUNT(*) as total_dokter FROM dokter");
        const [[{total_poli}]] = await pool.query("SELECT COUNT(*) as total_poli FROM poli");
        const [[{total_reservasi}]] = await pool.query("SELECT COUNT(*) as total_reservasi FROM reservasi");
        
        // Revenue per hari & total
        const [revenueData] = await pool.query(`
            SELECT 
                DATE(r.created_at) as tanggal,
                COUNT(r.id) as total_pasien,
                SUM(d.harga_jual) as total_pendapatan,
                SUM(d.harga_beli) as pendapatan_dokter,
                SUM(d.harga_jual - d.harga_beli) as pendapatan_sistem
            FROM reservasi r
            JOIN dokter d ON r.dokter_id = d.id
            GROUP BY DATE(r.created_at)
            ORDER BY DATE(r.created_at) DESC
            LIMIT 7
        `);

        // Total keseluruhan
        const [[totalData]] = await pool.query(`
            SELECT 
                SUM(d.harga_jual) as total_pendapatan,
                SUM(d.harga_beli) as total_dokter,
                SUM(d.harga_jual - d.harga_beli) as total_sistem
            FROM reservasi r 
            JOIN dokter d ON r.dokter_id = d.id
        `);

        res.json({ 
            total_dokter, 
            total_poli, 
            total_reservasi,
            total_pendapatan: totalData.total_pendapatan || 0,
            total_dokter_cut: totalData.total_dokter || 0,
            total_sistem_cut: totalData.total_sistem || 0,
            revenue_harian: revenueData
        });
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin Poli GET/POST/PUT/DELETE
app.get('/api/admin/poli', verifyToken, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const offset = (page - 1) * limit;
        
        const [[{total}]] = await pool.query("SELECT COUNT(*) as total FROM poli");
        const [polis] = await pool.query("SELECT * FROM poli ORDER BY id DESC LIMIT ? OFFSET ?", [limit, offset]);
        
        res.json({
            data: polis,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
        });
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/admin/poli', verifyToken, async (req, res) => {
    try {
        const { nama_poli, deskripsi } = req.body;
        await pool.query(
            "INSERT INTO poli (nama_poli, deskripsi) VALUES (?, ?)", 
            [nama_poli, deskripsi]
        );
        res.json({ message: 'Poli berhasil ditambahkan!' });
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/admin/poli/:id', verifyToken, async (req, res) => {
    try {
        const { nama_poli, deskripsi } = req.body;
        await pool.query(
            "UPDATE poli SET nama_poli = ?, deskripsi = ? WHERE id = ?", 
            [nama_poli, deskripsi, req.params.id]
        );
        res.json({ message: 'Poli berhasil diupdate!' });
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/admin/poli/:id', verifyToken, async (req, res) => {
    try {
        await pool.query("DELETE FROM poli WHERE id = ?", [req.params.id]);
        res.json({ message: 'Poli berhasil dihapus!' });
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin Dokter
app.get('/api/admin/dokter', verifyToken, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const offset = (page - 1) * limit;
        
        const [[{total}]] = await pool.query("SELECT COUNT(*) as total FROM dokter");
        const [dokters] = await pool.query(`
            SELECT d.*, p.nama_poli 
            FROM dokter d 
            LEFT JOIN poli p ON d.poli_id = p.id 
            ORDER BY d.id DESC
            LIMIT ? OFFSET ?
        `, [limit, offset]);
        res.json({
            data: dokters,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
        });
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/admin/dokter', verifyToken, upload.single('foto'), async (req, res) => {
    try {
        const { nama_dokter, spesialisasi, poli_id, jadwal_hari, jadwal_jam, no_wa, harga_beli, harga_jual } = req.body;
        const foto = req.file ? req.file.filename : 'default-doctor.jpg';
        await pool.query(`
            INSERT INTO dokter (nama_dokter, spesialisasi, poli_id, foto, jadwal_hari, jadwal_jam, no_wa, harga_beli, harga_jual)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [nama_dokter, spesialisasi, poli_id, foto, jadwal_hari, jadwal_jam, no_wa, harga_beli || 0, harga_jual || 0]);
        res.json({ message: 'Dokter berhasil ditambahkan!' });
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/admin/dokter/:id', verifyToken, upload.single('foto'), async (req, res) => {
    try {
        const { nama_dokter, spesialisasi, poli_id, jadwal_hari, jadwal_jam, no_wa, harga_beli, harga_jual } = req.body;
        let query = "UPDATE dokter SET nama_dokter=?, spesialisasi=?, poli_id=?, jadwal_hari=?, jadwal_jam=?, no_wa=?, harga_beli=?, harga_jual=? WHERE id=?";
        let params = [nama_dokter, spesialisasi, poli_id, jadwal_hari, jadwal_jam, no_wa, harga_beli || 0, harga_jual || 0, req.params.id];
        
        if (req.file) {
            query = "UPDATE dokter SET nama_dokter=?, spesialisasi=?, poli_id=?, jadwal_hari=?, jadwal_jam=?, no_wa=?, harga_beli=?, harga_jual=?, foto=? WHERE id=?";
            params = [nama_dokter, spesialisasi, poli_id, jadwal_hari, jadwal_jam, no_wa, harga_beli || 0, harga_jual || 0, req.file.filename, req.params.id];
        }
        
        await pool.query(query, params);
        res.json({ message: 'Data dokter berhasil diperbarui!' });
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/admin/dokter/:id', verifyToken, async (req, res) => {
    try {
        await pool.query("DELETE FROM dokter WHERE id = ?", [req.params.id]);
        res.json({ message: 'Dokter berhasil dihapus!' });
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin Reservasi
app.get('/api/admin/reservasi', verifyToken, async (req, res) => {
    try {
        const status = req.query.status || 'all';
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const offset = (page - 1) * limit;
        
        let countQuery = "SELECT COUNT(*) as total FROM reservasi";
        let query = `
            SELECT r.*, d.nama_dokter, p.nama_poli
            FROM reservasi r
            LEFT JOIN dokter d ON r.dokter_id = d.id
            LEFT JOIN poli   p ON r.poli_id   = p.id
        `;
        let params = [];
        let countParams = [];
        if (status !== 'all') {
            countQuery += " WHERE status = ?";
            query += " WHERE r.status = ?";
            params.push(status);
            countParams.push(status);
        }
        query += " ORDER BY r.created_at DESC LIMIT ? OFFSET ?";
        params.push(limit, offset);
        
        const [[{total}]] = await pool.query(countQuery, countParams);
        const [reservasis] = await pool.query(query, params);
        res.json({
            data: reservasis,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
        });
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/admin/reservasi/:id/status', verifyToken, async (req, res) => {
    try {
        const { status } = req.body;
        await pool.query("UPDATE reservasi SET status=? WHERE id=?", [status, req.params.id]);
        res.json({ message: 'Status berhasil diupdate' });
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/admin/reservasi/:id', verifyToken, async (req, res) => {
    try {
        await pool.query("DELETE FROM reservasi WHERE id=?", [req.params.id]);
        res.json({ message: 'Reservasi berhasil dihapus' });
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(port, () => {
    console.log(`Backend server running on http://localhost:${port}`);
});
