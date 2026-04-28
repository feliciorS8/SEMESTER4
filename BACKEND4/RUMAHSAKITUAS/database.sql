Buat Database
CREATE DATABASE IF NOT EXISTS rs_yasmin;
USE rs_yasmin;

-- Tabel Users (untuk login admin)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Poli
CREATE TABLE poli (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_poli VARCHAR(100) NOT NULL,
    deskripsi TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Dokter
CREATE TABLE dokter (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_dokter VARCHAR(100) NOT NULL,
    spesialisasi VARCHAR(100) NOT NULL,
    poli_id INT,
    foto VARCHAR(255),
    jadwal_hari VARCHAR(50),
    jadwal_jam VARCHAR(50),
    no_wa VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (poli_id) REFERENCES poli(id) ON DELETE SET NULL
);

-- Tabel Reservasi
CREATE TABLE reservasi (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_pasien VARCHAR(100) NOT NULL,
    no_wa VARCHAR(20) NOT NULL,
    dokter_id INT,
    poli_id INT,
    tanggal_reservasi DATE,
    keluhan TEXT,
    status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (dokter_id) REFERENCES dokter(id) ON DELETE SET NULL,
    FOREIGN KEY (poli_id) REFERENCES poli(id) ON DELETE SET NULL
);

-- Insert data default admin
INSERT INTO users (username, password, role) VALUES 
('admin', 'admin123', 'admin');

-- Insert data poli default
INSERT INTO poli (nama_poli, deskripsi) VALUES
('Poli Umum', 'Pelayanan kesehatan umum untuk berbagai keluhan'),
('Poli Anak', 'Pelayanan kesehatan khusus untuk anak-anak'),
('Poli Gigi', 'Pelayanan kesehatan gigi dan mulut'),
('Poli Mata', 'Pelayanan kesehatan mata');

-- Insert data dokter default
INSERT INTO dokter (nama_dokter, spesialisasi, poli_id, foto, jadwal_hari, jadwal_jam, no_wa) VALUES
('Dr. Ahmad Hidayat, Sp.PD', 'Spesialis Penyakit Dalam', 1, 'default-doctor.jpg', 'Senin - Jumat', '08:00 - 14:00', '081234567890'),
('Dr. Siti Nurhaliza, Sp.A', 'Spesialis Anak', 2, 'default-doctor.jpg', 'Senin - Sabtu', '09:00 - 15:00', '081234567891'),
('Dr. Budi Santoso, Sp.KG', 'Spesialis Gigi', 3, 'default-doctor.jpg', 'Selasa - Kamis', '10:00 - 16:00', '081234567892');