from flask import Flask, render_template, request, redirect, url_for, session, flash, jsonify
from flask_mysqldb import MySQL
import os
from werkzeug.utils import secure_filename
from urllib.parse import quote

app = Flask(__name__)
app.secret_key = 'your-secret-key-here-change-in-production'

# Konfigurasi MySQL
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'dijahaechan'  # Ganti dengan password MySQL Anda
app.config['MYSQL_DB'] = 'rs_yasmin'
app.config['MYSQL_CURSORCLASS'] = 'DictCursor'

# Konfigurasi Upload
UPLOAD_FOLDER = 'static/images/doctors'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

mysql = MySQL(app)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

WA_DEFAULT_NUMBER = '6282338530825'

def normalize_wa_number(number: str, default: str = WA_DEFAULT_NUMBER) -> str:
    """
    Bersihkan dan konversi nomor WA ke format internasional tanpa tanda tambah.
    Contoh:
    - "+62812 3456-7890" -> "6281234567890"
    - "0812..." -> "62812..."
    - "812..." -> "62812..."
    """
    if not number:
        return default
    
    digits = ''.join(ch for ch in str(number) if ch.isdigit())
    if not digits:
        return default
    
    if digits.startswith('0'):
        digits = '62' + digits[1:]
    elif digits.startswith('8'):
        digits = '62' + digits
    elif digits.startswith('62'):
        pass  # sudah benar
    else:
        # Format negara lain / tidak dikenal -> fallback
        return default
    
    # Minimal panjang 11-15 digit untuk nomor seluler Indonesia
    if len(digits) < 11 or len(digits) > 15 or not digits.startswith('62'):
        return default
    
    return digits or default

# ========================================
# ROUTES UTAMA
# ========================================

@app.route('/')
def index():
    """Homepage untuk user"""
    cur = mysql.connection.cursor()
    
    # Ambil data poli
    cur.execute("SELECT * FROM poli ORDER BY id")
    polis = cur.fetchall()
    
    # Ambil data dokter dengan info poli
    cur.execute("""
        SELECT d.*, p.nama_poli 
        FROM dokter d 
        LEFT JOIN poli p ON d.poli_id = p.id 
        ORDER BY d.id
    """)
    dokters = cur.fetchall()
    
    # Stats untuk hero section
    cur.execute("SELECT COUNT(*) as total FROM dokter")
    total_dokter = cur.fetchone()['total']
    
    cur.execute("SELECT COUNT(*) as total FROM poli")
    total_poli = cur.fetchone()['total']
    
    cur.execute("SELECT COUNT(*) as total FROM reservasi")
    total_reservasi = cur.fetchone()['total']
    
    cur.close()
    return render_template('index.html', polis=polis, dokters=dokters,
                           total_dokter=total_dokter, total_poli=total_poli,
                           total_reservasi=total_reservasi)

@app.route('/login', methods=['GET', 'POST'])
def login():
    """Halaman login untuk admin dan user"""
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        
        cur = mysql.connection.cursor()
        cur.execute("SELECT * FROM users WHERE username = %s AND password = %s", (username, password))
        user = cur.fetchone()
        cur.close()
        
        if user:
            session['logged_in'] = True
            session['user_id'] = user['id']
            session['username'] = user['username']
            session['role'] = user['role']
            
            if user['role'] == 'admin':
                return redirect(url_for('admin_dashboard'))
            else:
                return redirect(url_for('index'))
        else:
            flash('Username atau password salah!', 'danger')
    
    return render_template('login.html')

@app.route('/logout')
def logout():
    """Logout"""
    session.clear()
    return redirect(url_for('login'))

# ========================================
# ROUTES USER - RESERVASI
# ========================================

@app.route('/reservasi')
def reservasi():
    """Halaman reservasi untuk user"""
    cur = mysql.connection.cursor()
    
    # Ambil data poli
    cur.execute("SELECT * FROM poli ORDER BY nama_poli")
    polis = cur.fetchall()
    
    # Ambil data dokter
    cur.execute("""
        SELECT d.*, p.nama_poli 
        FROM dokter d 
        LEFT JOIN poli p ON d.poli_id = p.id 
        ORDER BY d.nama_dokter
    """)
    dokters = cur.fetchall()
    
    cur.close()
    return render_template('user_reservasi.html', polis=polis, dokters=dokters)

@app.route('/submit_reservasi', methods=['POST'])
def submit_reservasi():
    """Proses reservasi dan redirect ke WhatsApp"""
    nama_pasien = request.form['nama_pasien']
    no_wa = request.form['no_wa']
    poli_id = request.form['poli_id']
    dokter_id = request.form['dokter_id']
    tanggal = request.form['tanggal']
    keluhan = request.form['keluhan']
    
    # Simpan ke database
    cur = mysql.connection.cursor()
    cur.execute("""
        INSERT INTO reservasi (nama_pasien, no_wa, poli_id, dokter_id, tanggal_reservasi, keluhan)
        VALUES (%s, %s, %s, %s, %s, %s)
    """, (nama_pasien, no_wa, poli_id, dokter_id, tanggal, keluhan))
    mysql.connection.commit()
    
    # Ambil data dokter untuk WhatsApp
    cur.execute("SELECT * FROM dokter WHERE id = %s", [dokter_id])
    dokter = cur.fetchone()
    cur.close()
    
    # Format pesan WhatsApp
    pesan = (
        "Halo, saya ingin reservasi:\n\n"
        f"Nama: {nama_pasien}\n"
        f"Poli: {request.form.get('poli_name', 'Tidak diketahui')}\n"
        f"Dokter: {dokter['nama_dokter'] if dokter else 'Tidak diketahui'}\n"
        f"Tanggal: {tanggal}\n"
        f"Keluhan: {keluhan}\n\n"
        "Terima kasih!"
    )
    encoded_pesan = quote(pesan)
    
    # Nomor WhatsApp RS (gunakan nomor dokter jika valid, fallback ke default)
    wa_number_raw = dokter['no_wa'] if dokter and dokter['no_wa'] else None
    wa_number = normalize_wa_number(wa_number_raw)
    wa_url = f"https://wa.me/{wa_number}?text={encoded_pesan}"
    
    return redirect(wa_url)

@app.route('/get_dokter_by_poli/<int:poli_id>')
def get_dokter_by_poli(poli_id):
    """API untuk mendapatkan dokter berdasarkan poli"""
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM dokter WHERE poli_id = %s", [poli_id])
    dokters = cur.fetchall()
    cur.close()
    return jsonify(dokters)

# ========================================
# ROUTES ADMIN
# ========================================

@app.route('/admin')
def admin_dashboard():
    """Dashboard admin"""
    if 'role' not in session or session['role'] != 'admin':
        return redirect(url_for('login'))
    
    cur = mysql.connection.cursor()
    
    # Hitung statistik
    cur.execute("SELECT COUNT(*) as total FROM dokter")
    total_dokter = cur.fetchone()['total']
    
    cur.execute("SELECT COUNT(*) as total FROM poli")
    total_poli = cur.fetchone()['total']
    
    cur.execute("SELECT COUNT(*) as total FROM reservasi WHERE status = 'pending'")
    total_reservasi = cur.fetchone()['total']
    
    cur.close()
    
    return render_template('admin_dashboard.html', 
                          total_dokter=total_dokter,
                          total_poli=total_poli,
                          total_reservasi=total_reservasi)

# ========================================
# ADMIN - KELOLA DOKTER
# ========================================

@app.route('/admin/dokter')
def admin_dokter():
    """Halaman kelola dokter"""
    if 'role' not in session or session['role'] != 'admin':
        return redirect(url_for('login'))
    
    cur = mysql.connection.cursor()
    
    # Ambil data dokter dengan info poli
    cur.execute("""
        SELECT d.*, p.nama_poli 
        FROM dokter d 
        LEFT JOIN poli p ON d.poli_id = p.id 
        ORDER BY d.id DESC
    """)
    dokters = cur.fetchall()
    
    # Ambil data poli untuk dropdown
    cur.execute("SELECT * FROM poli ORDER BY nama_poli")
    polis = cur.fetchall()
    
    cur.close()
    return render_template('admin_dokter.html', dokters=dokters, polis=polis)

@app.route('/admin/dokter/add', methods=['POST'])
def admin_add_dokter():
    """Tambah dokter baru"""
    if 'role' not in session or session['role'] != 'admin':
        return redirect(url_for('login'))
    
    nama_dokter = request.form['nama_dokter']
    spesialisasi = request.form['spesialisasi']
    poli_id = request.form['poli_id']
    jadwal_hari = request.form['jadwal_hari']
    jadwal_jam = request.form['jadwal_jam']
    no_wa = request.form['no_wa']
    
    # Handle upload foto
    foto = 'default-doctor.jpg'
    if 'foto' in request.files:
        file = request.files['foto']
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            foto = filename
    
    cur = mysql.connection.cursor()
    cur.execute("""
        INSERT INTO dokter (nama_dokter, spesialisasi, poli_id, foto, jadwal_hari, jadwal_jam, no_wa)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
    """, (nama_dokter, spesialisasi, poli_id, foto, jadwal_hari, jadwal_jam, no_wa))
    mysql.connection.commit()
    cur.close()
    
    flash('Dokter berhasil ditambahkan!', 'success')
    return redirect(url_for('admin_dokter'))

@app.route('/admin/dokter/delete/<int:id>')
def admin_delete_dokter(id):
    """Hapus dokter"""
    if 'role' not in session or session['role'] != 'admin':
        return redirect(url_for('login'))
    
    cur = mysql.connection.cursor()
    cur.execute("DELETE FROM dokter WHERE id = %s", [id])
    mysql.connection.commit()
    cur.close()
    
    flash('Dokter berhasil dihapus!', 'success')
    return redirect(url_for('admin_dokter'))

@app.route('/admin/dokter/edit/<int:id>', methods=['POST'])
def admin_edit_dokter(id):
    """Edit data dokter"""
    if 'role' not in session or session['role'] != 'admin':
        return redirect(url_for('login'))
    
    nama_dokter  = request.form['nama_dokter']
    spesialisasi = request.form['spesialisasi']
    poli_id      = request.form['poli_id']
    jadwal_hari  = request.form['jadwal_hari']
    jadwal_jam   = request.form['jadwal_jam']
    no_wa        = request.form['no_wa']
    
    cur = mysql.connection.cursor()
    cur.execute("""
        UPDATE dokter
        SET nama_dokter=%s, spesialisasi=%s, poli_id=%s,
            jadwal_hari=%s, jadwal_jam=%s, no_wa=%s
        WHERE id=%s
    """, (nama_dokter, spesialisasi, poli_id, jadwal_hari, jadwal_jam, no_wa, id))
    mysql.connection.commit()
    cur.close()
    
    flash('Data dokter berhasil diperbarui!', 'success')
    return redirect(url_for('admin_dokter'))

@app.route('/admin/dokter/update-foto/<int:id>', methods=['POST'])
def admin_update_foto_dokter(id):
    """Ganti foto dokter yang sudah ada"""
    if 'role' not in session or session['role'] != 'admin':
        return redirect(url_for('login'))
    
    if 'foto' not in request.files:
        flash('Tidak ada file yang dipilih!', 'danger')
        return redirect(url_for('admin_dokter'))
    
    file = request.files['foto']
    if file.filename == '':
        flash('Tidak ada file yang dipilih!', 'danger')
        return redirect(url_for('admin_dokter'))
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        ext = filename.rsplit('.', 1)[1].lower()
        filename = f"dokter_{id}.{ext}"
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        
        cur = mysql.connection.cursor()
        cur.execute("UPDATE dokter SET foto = %s WHERE id = %s", (filename, id))
        mysql.connection.commit()
        cur.close()
        
        flash('Foto dokter berhasil diperbarui!', 'success')
    else:
        flash('Format file tidak didukung! Gunakan JPG, PNG, atau GIF.', 'danger')
    
    return redirect(url_for('admin_dokter'))

# ========================================
# ADMIN - KELOLA RESERVASI
# ========================================

@app.route('/admin/reservasi')
def admin_reservasi():
    """Halaman kelola reservasi"""
    if 'role' not in session or session['role'] != 'admin':
        return redirect(url_for('login'))
    
    status_filter = request.args.get('status', 'all')
    
    cur = mysql.connection.cursor()
    if status_filter == 'all':
        cur.execute("""
            SELECT r.*, d.nama_dokter, p.nama_poli
            FROM reservasi r
            LEFT JOIN dokter d ON r.dokter_id = d.id
            LEFT JOIN poli   p ON r.poli_id   = p.id
            ORDER BY r.created_at DESC
        """)
    else:
        cur.execute("""
            SELECT r.*, d.nama_dokter, p.nama_poli
            FROM reservasi r
            LEFT JOIN dokter d ON r.dokter_id = d.id
            LEFT JOIN poli   p ON r.poli_id   = p.id
            WHERE r.status = %s
            ORDER BY r.created_at DESC
        """, [status_filter])
    reservasis = cur.fetchall()
    
    # Hitung per status
    cur.execute("SELECT status, COUNT(*) as total FROM reservasi GROUP BY status")
    status_counts = {row['status']: row['total'] for row in cur.fetchall()}
    cur.execute("SELECT COUNT(*) as total FROM reservasi")
    status_counts['all'] = cur.fetchone()['total']
    
    cur.close()
    return render_template('admin_reservasi.html',
                           reservasis=reservasis,
                           status_filter=status_filter,
                           status_counts=status_counts)

@app.route('/admin/reservasi/update-status/<int:id>', methods=['POST'])
def admin_update_status_reservasi(id):
    """Update status reservasi"""
    if 'role' not in session or session['role'] != 'admin':
        return redirect(url_for('login'))
    
    new_status = request.form.get('status')
    if new_status not in ('pending', 'confirmed', 'cancelled'):
        flash('Status tidak valid!', 'danger')
        return redirect(url_for('admin_reservasi'))
    
    cur = mysql.connection.cursor()
    cur.execute("UPDATE reservasi SET status=%s WHERE id=%s", (new_status, id))
    mysql.connection.commit()
    cur.close()
    
    flash(f'Status reservasi berhasil diubah ke {new_status}!', 'success')
    return redirect(request.referrer or url_for('admin_reservasi'))

@app.route('/admin/reservasi/delete/<int:id>')
def admin_delete_reservasi(id):
    """Hapus reservasi"""
    if 'role' not in session or session['role'] != 'admin':
        return redirect(url_for('login'))
    
    cur = mysql.connection.cursor()
    cur.execute("DELETE FROM reservasi WHERE id=%s", [id])
    mysql.connection.commit()
    cur.close()
    
    flash('Reservasi berhasil dihapus!', 'success')
    return redirect(url_for('admin_reservasi'))

# ========================================
# ADMIN - KELOLA POLI
# ========================================

@app.route('/admin/poli')
def admin_poli():
    """Halaman kelola poli"""
    if 'role' not in session or session['role'] != 'admin':
        return redirect(url_for('login'))
    
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM poli ORDER BY id DESC")
    polis = cur.fetchall()
    cur.close()
    
    return render_template('admin_poli.html', polis=polis)

@app.route('/admin/poli/add', methods=['POST'])
def admin_add_poli():
    """Tambah poli baru"""
    if 'role' not in session or session['role'] != 'admin':
        return redirect(url_for('login'))
    
    nama_poli = request.form['nama_poli']
    deskripsi = request.form['deskripsi']
    
    cur = mysql.connection.cursor()
    cur.execute("INSERT INTO poli (nama_poli, deskripsi) VALUES (%s, %s)", (nama_poli, deskripsi))
    mysql.connection.commit()
    cur.close()
    
    flash('Poli berhasil ditambahkan!', 'success')
    return redirect(url_for('admin_poli'))

@app.route('/admin/poli/delete/<int:id>')
def admin_delete_poli(id):
    """Hapus poli"""
    if 'role' not in session or session['role'] != 'admin':
        return redirect(url_for('login'))
    
    cur = mysql.connection.cursor()
    cur.execute("DELETE FROM poli WHERE id = %s", [id])
    mysql.connection.commit()
    cur.close()
    
    flash('Poli berhasil dihapus!', 'success')
    return redirect(url_for('admin_poli'))

@app.route('/admin/poli/edit/<int:id>', methods=['POST'])
def admin_update_poli(id):
    """Update nama/deskripsi poli"""
    if 'role' not in session or session['role'] != 'admin':
        return redirect(url_for('login'))
    
    nama_poli = request.form.get('nama_poli', '').strip()
    deskripsi = request.form.get('deskripsi', '').strip()
    
    if not nama_poli or not deskripsi:
        flash('Nama poli dan deskripsi wajib diisi.', 'danger')
        return redirect(url_for('admin_poli'))
    
    cur = mysql.connection.cursor()
    cur.execute(
        "UPDATE poli SET nama_poli = %s, deskripsi = %s WHERE id = %s",
        (nama_poli, deskripsi, id)
    )
    mysql.connection.commit()
    cur.close()
    
    flash('Poli berhasil diperbarui!', 'success')
    return redirect(url_for('admin_poli'))

# ========================================
# JALANKAN APLIKASI
# ========================================

if __name__ == '__main__':
    # Buat folder upload jika belum ada
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    app.run(debug=True, port=5000)