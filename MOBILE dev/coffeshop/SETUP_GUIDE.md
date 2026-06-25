# 🚀 Panduan Instalasi & Running Aplikasi

## Prerequisites

Pastikan Anda sudah memiliki:

- Node.js (v14 atau lebih baru)
- npm atau yarn
- Expo CLI: `npm install -g expo-cli`
- Android Emulator atau iOS Simulator (optional)
- Expo Go app (untuk testing di physical device)

## 📋 Installation Steps

### 1. Install Dependencies

```bash
# Navigate ke project directory
cd coffee-shop-umkm

# Install packages
npm install
# atau jika menggunakan yarn
yarn install
```

### 2. Start Expo Development Server

```bash
# Start development server
npx expo start
```

Output akan menampilkan menu dengan pilihan:

```
› Metro waiting on http://localhost:19000
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)

Press 'a' — open Android
Press 'i' — open iOS simulator
Press 'w' — open web
Press 'r' — reload app
Press 'm' — toggle menu
Press 'q' — quit
```

### 3. Running Options

#### Option A: Android Emulator

```bash
# Press 'a' di terminal
a
```

Pastikan Android Emulator sudah running. Jika belum:

- Buka Android Studio
- Buka AVD Manager
- Start Android Emulator
- Jalankan command di atas

#### Option B: iOS Simulator (macOS Only)

```bash
# Press 'i' di terminal
i
```

#### Option C: Physical Device

1. Install **Expo Go** dari:
   - Google Play Store (Android)
   - Apple App Store (iOS)
2. Pastikan device dan laptop di network yang sama
3. Scan QR code yang ditampilkan di terminal
4. Aplikasi akan membuka otomatis di Expo Go

#### Option D: Web Browser

```bash
# Press 'w' di terminal
w
```

## ✅ Testing Aplikasi

### First Time Setup

Saat pertama kali membuka, aplikasi akan kosong karena belum ada data.

### Menambah Menu

1. Tekan tombol **+ (plus)** di header atau Floating Action Button
2. Isi form:
   - Nama Menu (wajib)
   - Deskripsi (opsional)
   - Harga (wajib, angka)
   - Kategori (pilih dari dropdown)
   - Foto (opsional - dari galeri atau kamera)
3. Tekan **Simpan Menu**

### Melihat Detail Menu

1. Tekan **card menu** di Home Screen
2. Lihat detail lengkap dengan foto besar
3. Tekan **Edit** atau **Hapus** dari detail screen

### Edit Menu

1. Tekan tombol **pensil** di card atau detail
2. Ubah informasi yang perlu diubah
3. Tekan **Perbarui Menu**

### Hapus Menu

1. Tekan tombol **trash** di card
2. Atau tekan **Hapus Menu** di detail screen
3. Konfirmasi penghapusan
4. Menu akan dihapus langsung

### Filter Kategori

1. Scroll kategori filter di bawah header
2. Tekan kategori yang ingin dilihat
3. Daftar akan terupdate otomatis

## 🔄 Reload & Debugging

### Reload App

Saat ada perubahan code:

- Tekan **'r'** di terminal
- Atau shake device (akan muncul menu)

### Hot Reload vs Full Reload

- **Fast Refresh** (auto): Perubahan minor akan reflect otomatis
- **Full Reload**: Tekan 'r' jika ada error atau perubahan major

### Debugging

Tekan **'j'** di terminal untuk membuka debugger di Chrome/Firefox:

```
j
```

## 📸 Testing Image Picker

### Galeri

1. Saat Add Product, klik area foto
2. Pilih "Galeri"
3. Pilih foto dari device
4. Advance & crop dengan gesture

### Kamera

1. Saat Add Product, klik area foto
2. Pilih "Kamera"
3. Ambil foto baru
4. Advance & crop

**Note**: Di Emulator, gallery dan camera mungkin terbatas. Lebih baik test di physical device.

## 🐛 Common Issues & Solutions

### Issue: "Cannot find module"

```bash
# Solution: Clear cache & reinstall
rm -rf node_modules
npm install
npx expo start --clear
```

### Issue: "Port 19000 already in use"

```bash
# Solution: Kill process or use different port
npx expo start -p 19001
```

### Issue: Image picker crashes

- Check permissions (app akan request otomatis)
- Di physical device: pastikan permissions diberikan
- Di emulator: limitations pada image picker

### Issue: Data tidak tersimpan

- AsyncStorage perlu initialize dulu
- Cek Console di Chrome DevTools (Press 'j')
- Clear AsyncStorage jika perlu reset

### Issue: Blank screen

- Hard restart: quit app dan jalankan ulang
- Clear expo cache: `npx expo start --clear`
- Check console for errors

## 🚀 Publishing & Build

### Build Android APK

```bash
npx expo build:android
# Pilih "apk"
```

### Build iOS IPA (macOS only)

```bash
npx expo build:ios
```

### EAS Build (Recommended)

```bash
# Setup EAS
npm install -g eas-cli
eas login
eas build --platform android
```

## 📝 Project File Structure Reminder

```
coffee-shop-umkm/
├── App.js                    # Main entry point
├── index.js                  # Expo registration
├── screens/                  # All screens
│   ├── HomeScreen.js
│   ├── AddProductScreen.js
│   ├── EditProductScreen.js
│   └── ProductDetailScreen.js
├── components/               # Reusable components
│   ├── Header.js
│   ├── ProductCard.js
│   ├── CategoryFilter.js
│   └── ImagePickerComponent.js
├── utils/                    # Utilities
│   ├── theme.js              # Colors & styles
│   ├── storage.js            # AsyncStorage ops
│   └── sampleData.js         # Sample menu data
├── assets/                   # Images & static files
├── app.json                  # Expo config
└── package.json              # Dependencies
```

## 💡 Tips

1. **Test berbagai ukuran screen**: Gunakan berbagai emulator size
2. **Test portrait & landscape**: Rotate device untuk test responsiveness
3. **Slow network testing**: Hamburger menu → Settings → Slow Motion
4. **Check performance**: DevTools → Profiler

## ✨ Next Steps

Setelah memastikan aplikasi berjalan:

1. Customize warna & styling sesuai preferensi
2. Tambah fitur tambahan (search, sorting, dll)
3. Improve UI/UX dengan animasi more smooth
4. Build dan deploy ke app store

---

**Happy Coding! ☕**
