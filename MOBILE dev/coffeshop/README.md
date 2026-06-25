# ☕ Coffee Shop UMKM - Mobile App

Aplikasi mobile management menu untuk UMKM Coffee Shop dengan desain modern, clean, dan memiliki nuansa warm cafe yang hangat.

## 📱 Fitur Utama

### ✨ Core Features

- **CRUD Operations**: Create, Read, Update, Delete menu kopi dan makanan
- **Manajemen Menu**: Tambah, edit, hapus, dan lihat detail menu
- **Kategori Menu**: Filter menu berdasarkan kategori (Kopi, Makanan, Minuman Dingin, Dessert, Snack)
- **Image Support**: Upload foto menu dari galeri atau ambil foto langsung dengan kamera
- **Local Storage**: Menyimpan data menggunakan AsyncStorage (tidak perlu online database)
- **User Friendly**: Desain minimalis dan mudah digunakan

### 🎨 Design Features

- **Warm Coffee Theme**: Kombinasi warna coklat kopi, cream, beige, soft black, dan white
- **Modern UI**: Card-based layout dengan smooth animations
- **Clean Icons**: Icon material design yang elegan
- **Responsive Design**: Sempurna untuk berbagai ukuran layar mobile

## 🚀 Getting Started

### Prerequisites

- Node.js dan npm/yarn terinstall
- Expo CLI terinstall (`npm install -g expo-cli`)
- Android Studio/Emulator atau iOS Simulator (untuk development)
- Device dengan aplikasi Expo Go (untuk testing)

### Installation

1. **Navigate ke project directory**:

   ```bash
   cd coffee-shop-umkm
   ```

2. **Install dependencies**:

   ```bash
   npm install
   # atau
   yarn install
   ```

3. **Start Expo development server**:

   ```bash
   npx expo start
   ```

4. **Run on device/emulator**:
   - **Android**: Tekan `a` di terminal atau gunakan Android Emulator
   - **iOS**: Tekan `i` di terminal
   - **Web**: Tekan `w` di terminal
   - **Physical Device**: Scan QR code dengan Expo Go app

## 📁 Project Structure

```
coffee-shop-umkm/
├── screens/              # Layar aplikasi
│   ├── HomeScreen.js     # Daftar menu dengan kategori filter
│   ├── AddProductScreen.js
│   ├── EditProductScreen.js
│   └── ProductDetailScreen.js
├── components/           # Reusable components
│   ├── Header.js
│   ├── ProductCard.js
│   ├── CategoryFilter.js
│   └── ImagePickerComponent.js
├── utils/                # Utility functions
│   ├── theme.js          # Konfigurasi warna dan style
│   └── storage.js        # AsyncStorage operations
├── assets/               # Folder untuk media
├── App.js                # Main app dengan navigation setup
├── index.js              # Entry point
├── app.json              # Expo configuration
└── package.json          # Dependencies
```

## 🎯 Fitur Detail

### Home Screen

- **Daftar Menu**: Tampilkan semua menu dalam format card
- **Category Filter**: Filter menu berdasarkan kategori
- **Pull to Refresh**: Refresh daftar menu dengan swipe down
- **Floating Action Button**: Tombol cepat untuk tambah menu baru
- **Delete Button**: Hapus menu dari card (dengan konfirmasi)
- **Edit Button**: Edit menu langsung dari card
- **Product Info**: Menampilkan nama, harga, kategori, dan foto

### Add Product Screen

- **Image Picker**: Pilih foto dari galeri atau ambil dengan kamera
- **Form Input**: Input nama, deskripsi, harga
- **Category Selection**: Pilih dari 5 kategori pre-defined
- **Form Validation**: Validasi input sebelum menyimpan
- **Action Buttons**: Tombol Batal dan Simpan

### Edit Product Screen

- **Pre-filled Form**: Form sudah terisi dengan data menu sebelumnya
- **Image Management**: Ubah, hapus, atau ganti foto
- **Same as Add**: Fitur sama dengan Add Product Screen
- **Update Confirmation**: Konfirmasi perubahan data

### Product Detail Screen

- **Full View**: Tampilkan detail lengkap menu
- **Large Image**: Foto menu dalam ukuran besar
- **Price Display**: Harga dalam format Rupiah
- **Date Info**: Tanggal ditambahkan dan diperbarui
- **Action Buttons**: Tombol Edit dan Hapus
- **Navigation**: Akses Edit langsung dari tombol header

## 🎨 Warna & Tema

```
Primary Colors:
- Coffee Deep  (#2C1810) - Warna utama coklat kopi
- Coffee Medium (#6F4E37) - Aksen coklat sedang
- Coffee Light  (#A0826D) - Highlight coklat muda

Accent Colors:
- Cream (#F5EDD9) - Warna warm accent
- Beige (#E8DCC8) - Background soft
- Ivory (#FFFAF0) - Warna putih warm

Semantic Colors:
- Success (#6BAA54) - Hijau untuk success
- Error (#E63946) - Merah untuk error/delete
- Warning (#F77F00) - Orange untuk warning
- Info (#457B9D) - Biru untuk info/edit
```

## 📦 Dependencies

```json
{
  "react": "^18.2.0",
  "react-native": "^0.71.8",
  "expo": "^48.0.0",
  "@react-navigation/native": "^6.1.9",
  "@react-navigation/stack": "^6.3.20",
  "@react-native-async-storage/async-storage": "^1.17.12",
  "expo-image-picker": "^14.3.2",
  "react-native-vector-icons": "^9.2.0"
}
```

## 💾 Data Storage

Data menu disimpan di AsyncStorage dengan struktur:

```javascript
{
  id: "timestamp",
  name: "String",
  description: "String",
  price: Number,
  category: "String",
  image: "URI",
  createdAt: "ISO Date",
  updatedAt: "ISO Date"
}
```

### Storage Methods

- `getAllProducts()` - Ambil semua menu
- `addProduct(product)` - Tambah menu baru
- `getProductById(id)` - Ambil detail menu
- `updateProduct(id, data)` - Update menu
- `deleteProduct(id)` - Hapus menu
- `getProductsByCategory(category)` - Filter berdasarkan kategori
- `getAllCategories()` - Ambil daftar kategori yang ada

## 🔐 Permissions

Aplikasi memerlukan permissions:

- `CAMERA` - Untuk ambil foto langsung
- `PHOTO_LIBRARY` - Untuk akses galeri
- `STORAGE` - Untuk akses file lokal

Permissions akan diminta saat user memilih untuk menggunakan fitur tersebut.

## 🎯 Tips Penggunaan

1. **Tambah Menu Baru**: Tekan tombol + di Home Screen atau FAB
2. **Edit Menu**: Tekan tombol edit (pensil) di card atau di detail screen
3. **Lihat Detail**: Tekan card menu untuk melihat detail lengkap
4. **Filter Kategori**: Swipe horizontal pada category filter
5. **Hapus Menu**: Tekan tombol hapus, akan diminta konfirmasi
6. **Refresh**: Pull down pada Home Screen untuk refresh data

## 🚀 Deployment

### Android

```bash
npx expo build:android
```

### iOS

```bash
npx expo build:ios
```

## 📝 Catatan Pengembangan

- Semua data hanya tersimpan lokal (AsyncStorage)
- Tidak ada backend/cloud sync
- Foto disimpan dalam base64/URI di device
- CRUD operations tidak memerlukan internet
- Navigasi menggunakan React Navigation v6

## 🐛 Troubleshooting

### Image picker tidak muncul

- Pastikan permissions sudah diberikan
- Restart Expo development server

### Data hilang saat restart

- Data seharusnya tersimpan di AsyncStorage
- Cek apakah storage belum terisi (reset AsyncStorage jika perlu)

### Stack navigator error

- Pastikan semua screens sudah di-register di App.js

## 📞 Support

Untuk pertanyaan atau saran, silakan buat issue atau contact developer.

---

**Made with ☕ for Coffee Lovers**
