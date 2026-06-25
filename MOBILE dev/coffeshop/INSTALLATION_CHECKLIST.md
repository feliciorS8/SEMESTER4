# Coffee Shop UMKM - Installation Checklist

## ✅ Pre-Installation Requirements

Before running the app, make sure you have:

- [ ] **Node.js** v14+ installed (`node --version`)
- [ ] **npm** or **yarn** installed (`npm --version`)
- [ ] **Expo CLI** installed (`npm install -g expo-cli`)
- [ ] Either:
  - [ ] Android Emulator (Android Studio installed)
  - [ ] iOS Simulator (XCode installed - macOS only)
  - [ ] Expo Go app (Physical device)

## 📦 Installation Steps

### Step 1: Navigate to Project

```bash
cd coffee-shop-umkm
```

- [ ] Confirm you're in the right directory (should see package.json)

### Step 2: Install Dependencies

```bash
npm install
# or
yarn install
```

- [ ] Wait for installation to complete
- [ ] No errors in console

### Step 3: Start Expo Development Server

```bash
npx expo start
```

- [ ] Terminal shows "Metro waiting on http://localhost:19000"
- [ ] QR code is displayed

## 🚀 Running the App

### Option 1: Android Emulator

```bash
# In terminal where expo is running:
a
```

- [ ] Android Emulator starts automatically
- [ ] App installs and launches
- [ ] You see the Home Screen with Coffee Shop header

### Option 2: iOS Simulator (macOS)

```bash
# In terminal where expo is running:
i
```

- [ ] iOS Simulator opens
- [ ] App installs and launches
- [ ] You see the Home Screen

### Option 3: Physical Device

1. [ ] Install Expo Go from App Store / Play Store
2. [ ] Make sure device and laptop on same WiFi
3. [ ] Scan QR code with:
   - [ ] Camera app (iOS)
   - [ ] Expo Go app (Android)
4. [ ] App opens in Expo Go
5. [ ] You see the Home Screen

### Option 4: Web Browser

```bash
# In terminal where expo is running:
w
```

- [ ] Browser opens automatically
- [ ] Web preview loads (limited functionality)

## ✅ First Launch Verification

When app first opens, verify:

- [ ] **Header displays** "☕ Coffee Shop" with correct styling
- [ ] **Home screen shows** empty state message (no data yet)
- [ ] **FAB button** (+ icon) visible at bottom right
- [ ] **+ button** in header works
- [ ] **Back button** styling looks right
- [ ] **Text and icons** are readable
- [ ] **Colors** match warm coffee theme

## ✅ Basic Functionality Test

### Add First Menu Item

1. [ ] Tap + button or FAB
2. [ ] AddProductScreen loads
3. [ ] All input fields visible
4. [ ] "Tambah Menu" header shows
5. [ ] Category options display
6. [ ] Image picker area shows

Fill form:

- [ ] Name: "Espresso"
- [ ] Description: "Kopi murni"
- [ ] Price: "18000"
- [ ] Category: "Kopi"
- [ ] Skip image (optional)
- [ ] Tap "Simpan Menu"

### Verify Save

- [ ] Alert shows "Sukses - Menu berhasil ditambahkan"
- [ ] Back to Home screen
- [ ] Espresso card visible
- [ ] Card shows: name, price, category badge
- [ ] Price shows "Rp 18.000"

### Category Filter

- [ ] Category filter bar visible
- [ ] "Semua" selected (highlighted)
- [ ] Tap "Kopi" category
- [ ] Filter updates
- [ ] Back to "Semua"

### View Detail

- [ ] Tap Espresso card
- [ ] ProductDetailScreen opens
- [ ] Shows full information
- [ ] "Detail Menu" header visible
- [ ] Edit and Delete buttons visible

### Edit Functionality

- [ ] Tap edit (pencil) button
- [ ] EditProductScreen shows pre-filled form
- [ ] Change name to "Double Espresso"
- [ ] Change price to "25000"
- [ ] Tap "Perbarui Menu"
- [ ] Alert shows success
- [ ] Back to detail - updates shown
- [ ] Check home screen - card updated

### Delete Functionality

- [ ] Tap delete (trash) button
- [ ] Confirmation alert appears
- [ ] Tap "Hapus"
- [ ] Alert shows "Menu berhasil dihapus"
- [ ] Back to home screen
- [ ] Menu is gone
- [ ] Empty state shows again

## 🐛 Troubleshooting Checklist

If app won't start:

- [ ] Run `npx expo start --clear` to clear cache
- [ ] Delete `node_modules` and run `npm install` again
- [ ] Check Node.js version is v14+
- [ ] Check no other app using port 19000

If app crashes:

- [ ] Check terminal for error messages
- [ ] Reload app by pressing 'r' in terminal
- [ ] Clear AsyncStorage if needed
- [ ] Restart Expo dev server

If image picker doesn't work:

- [ ] Check permissions are granted in device settings
- [ ] Try on physical device instead of emulator
- [ ] Make sure you have camera/gallery permissions in app.json

If navigation doesn't work:

- [ ] Verify all screens are imported in App.js
- [ ] Check screen names match navigation.navigate() calls
- [ ] Reload app with 'r'

## 📊 After Installation

### Project Structure Verification

Verify these files exist:

- [ ] `App.js`
- [ ] `index.js`
- [ ] `app.json`
- [ ] `package.json`
- [ ] `screens/` folder with 4 screen files
- [ ] `components/` folder with 4 component files
- [ ] `utils/` folder with 3 utility files

### Documentation

- [ ] Read `README.md` for features overview
- [ ] Read `SETUP_GUIDE.md` for detailed guide
- [ ] Read `FEATURES.md` for complete feature list

## ✨ Development Mode

Common commands while developing:

| Command | What it does     |
| ------- | ---------------- |
| `r`     | Reload app       |
| `j`     | Open debugger    |
| `m`     | Toggle menu      |
| `a`     | Run on Android   |
| `i`     | Run on iOS       |
| `w`     | Run on Web       |
| `q`     | Quit development |
| `c`     | Clear console    |

## 🎯 Next Steps After Installation

1. [ ] Add more menu items with images
2. [ ] Test all CRUD operations
3. [ ] Test category filtering
4. [ ] Test on physical device
5. [ ] Customize colors if needed
6. [ ] Review and understand code structure
7. [ ] Plan customizations/enhancements

## 💾 Important Notes

- **Data saved locally**: All menu items stored in AsyncStorage
- **No internet needed**: App works completely offline
- **Photos stored locally**: Images saved as URI in device
- **Persistent storage**: Data survives app restart

## 🆘 Getting Help

If something doesn't work:

1. Check error message in terminal
2. Read SETUP_GUIDE.md troubleshooting section
3. Check that all prerequisites are installed
4. Try clearing cache: `npx expo start --clear`
5. Try fresh install: `rm -rf node_modules && npm install`

---

**✅ All checked? You're ready to go! ☕**

Enjoy building your Coffee Shop UMKM app!
