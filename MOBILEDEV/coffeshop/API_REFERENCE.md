# 📚 API Reference - Coffee Shop UMKM

## Storage Functions (AsyncStorage Operations)

Located in: `utils/storage.js`

### Get Operations

#### `getAllProducts()`

**Description**: Retrieve all menu items from storage

```javascript
import { getAllProducts } from "./utils/storage";

const products = await getAllProducts();
// Returns: Array<Product>
```

**Returns**:

```javascript
[
  {
    id: "1234567890",
    name: "Espresso",
    description: "Kopi espresso murni",
    price: 18000,
    category: "Kopi",
    image: "file:///path/to/image.jpg" or null,
    createdAt: "2024-01-15T10:30:00.000Z",
    updatedAt: "2024-01-16T14:20:00.000Z"
  }
]
```

---

#### `getProductById(id)`

**Description**: Get specific menu item by ID

```javascript
const product = await getProductById("1234567890");
// Returns: Product | null
```

**Parameters**:

- `id` (String): Product ID from the product object

---

#### `getProductsByCategory(category)`

**Description**: Get all products in a specific category

```javascript
const coffeeProducts = await getProductsByCategory("Kopi");
// Returns: Array<Product> matching category
```

**Available Categories**:

- `"Kopi"` - Coffee drinks
- `"Makanan"` - Food items
- `"Minuman Dingin"` - Cold beverages
- `"Dessert"` - Sweet items
- `"Snack"` - Snack items

---

#### `getAllCategories()`

**Description**: Get list of all categories in use

```javascript
const categories = await getAllCategories();
// Returns: Array<String> ["Kopi", "Makanan", ...]
```

---

### Create Operations

#### `addProduct(product)`

**Description**: Add new menu item to storage

```javascript
const newProduct = await addProduct({
  name: "Cappuccino",
  description: "Espresso with steamed milk",
  price: 25000,
  category: "Kopi",
  image: "file:///path/to/image.jpg", // optional
});
// Returns: Product (with auto-generated id, createdAt)
```

**Parameters**:

```javascript
{
  name: String (required, max 50 chars),
  description: String (optional),
  price: Number (required, positive),
  category: String (required),
  image: String (optional, URI format)
}
```

**Auto-generated**:

- `id`: Timestamp-based unique ID
- `createdAt`: ISO timestamp

---

### Update Operations

#### `updateProduct(id, updatedData)`

**Description**: Update existing menu item

```javascript
const updated = await updateProduct("1234567890", {
  name: "Double Cappuccino",
  price: 30000,
});
// Returns: Updated Product object
```

**Parameters**:

- `id` (String): Product ID to update
- `updatedData` (Object): Fields to update (any field except id)

**Auto-updated**:

- `updatedAt`: Auto-set to current ISO timestamp

---

### Delete Operations

#### `deleteProduct(id)`

**Description**: Remove menu item from storage

```javascript
const success = await deleteProduct("1234567890");
// Returns: true if successful
```

**Parameters**:

- `id` (String): Product ID to delete

---

#### `clearAllProducts()`

**Description**: Remove all menu items (use with caution!)

```javascript
const success = await clearAllProducts();
// Returns: true if successful
```

⚠️ **Warning**: This deletes ALL data permanently!

---

## Theme Variables (Design System)

Located in: `utils/theme.js`

### Colors

```javascript
import { colors } from "./utils/theme";

// Coffee Themed
colors.coffeeDeep; // #2C1810 - Dark brown
colors.coffeeMedium; // #6F4E37 - Medium brown
colors.coffeeLight; // #A0826D - Light brown

// Warm Accents
colors.cream; // #F5EDD9
colors.beige; // #E8DCC8
colors.ivory; // #FFFAF0

// Neutrals
colors.white; // #FFFFFF
colors.softBlack; // #3D3D3D
colors.lightGray; // #F0F0F0
colors.mediumGray; // #D4D4D4
colors.darkGray; // #808080

// Semantic
colors.success; // #6BAA54 - Green
colors.error; // #E63946 - Red
colors.warning; // #F77F00 - Orange
colors.info; // #457B9D - Blue
```

---

### Typography

```javascript
import { typography } from "./utils/theme";

typography.h1; // 28px bold
typography.h2; // 24px 600weight
typography.h3; // 20px 600weight
typography.body; // 16px 500weight
typography.bodySmall; // 14px 400weight
typography.caption; // 12px 400weight
typography.button; // 16px 600weight
```

---

### Spacing (in pixels)

```javascript
import { spacing } from "./utils/theme";

spacing.xs; // 4px
spacing.sm; // 8px
spacing.md; // 12px
spacing.lg; // 16px
spacing.xl; // 24px
spacing.xxl; // 32px
```

---

### Border Radius

```javascript
import { borderRadius } from "./utils/theme";

borderRadius.sm; // 6px
borderRadius.md; // 12px
borderRadius.lg; // 16px
borderRadius.xl; // 24px
```

---

### Shadows

```javascript
import { shadows } from './utils/theme';

shadows.light          // Subtle shadow
shadows.medium         // Medium elevation
shadows.heavy          // Strong shadow

// Example usage:
<View style={[styles.card, shadows.medium]} />
```

---

## Component Props

### Header Component

**File**: `components/Header.js`

```javascript
<Header
  title="Menu List" // Required
  showBackButton={true} // Optional
  onBackPress={() => nav.goBack()} // Optional callback
  rightIcon="plus-circle" // Optional icon name
  onRightPress={() => nav.navigate()} // Optional callback
/>
```

---

### ProductCard Component

**File**: `components/ProductCard.js`

```javascript
<ProductCard
  product={{
    // Required
    id: "123",
    name: "Espresso",
    price: 18000,
    category: "Kopi",
    image: "uri" | null,
    description: "optional",
  }}
  onPress={() => viewDetail()} // Required
  onEdit={() => goToEdit()} // Required
  onDelete={() => deleteItem()} // Required
/>
```

---

### CategoryFilter Component

**File**: `components/CategoryFilter.js`

```javascript
<CategoryFilter
  categories={["Kopi", "Makanan"]} // Required
  selectedCategory="Kopi" // Required
  onSelectCategory={(cat) => filter()} // Required callback
/>
```

---

### ImagePickerComponent

**File**: `components/ImagePickerComponent.js`

```javascript
<ImagePickerComponent
  imageUri="file://path" | null      // Current image
  onImageSelect={(uri) => setImage()} // Required
  onRemoveImage={() => removeImg()}   // Required
/>
```

---

## Navigation Reference

### Screen Names & Routes

```javascript
// Available screens
"Home"; // HomeScreen - List & filter
"AddProduct"; // AddProductScreen - Create
"EditProduct"; // EditProductScreen - Update
"ProductDetail"; // ProductDetailScreen - View & delete

// Navigation examples
navigation.navigate("Home");
navigation.navigate("AddProduct");
navigation.navigate("EditProduct", { productId: "123" });
navigation.navigate("ProductDetail", { productId: "123" });
navigation.goBack();
```

---

## Hook Usage

### useFocusEffect

Reload data when screen comes into focus:

```javascript
useFocusEffect(
  React.useCallback(() => {
    loadProducts(); // Refresh data
  }, []),
);
```

---

### useState

```javascript
const [products, setProducts] = useState([]);
const [loading, setLoading] = useState(false);
```

---

## Common Patterns

### Loading Data on Mount

```javascript
useEffect(() => {
  loadProducts();
}, []);
```

### Loading Data on Focus

```javascript
useFocusEffect(
  React.useCallback(() => {
    loadProducts();
  }, []),
);
```

### Validation

```javascript
const validateForm = () => {
  if (!name.trim()) {
    Alert.alert("Error", "Name required");
    return false;
  }
  if (isNaN(price) || price <= 0) {
    Alert.alert("Error", "Valid price required");
    return false;
  }
  return true;
};
```

### Error Handling

```javascript
try {
  await Storage.addProduct(data);
  Alert.alert("Success", "Product added");
} catch (error) {
  Alert.alert("Error", "Failed to add product");
  console.error("Error:", error);
}
```

### Confirmation Dialog

```javascript
Alert.alert("Delete Product", "Are you sure?", [
  { text: "Cancel", onPress: () => {} },
  {
    text: "Delete",
    onPress: () => deleteItem(),
    style: "destructive",
  },
]);
```

---

## Data Persistence

### How Data is Stored

- **Storage Key**: `'COFFEE_SHOP_MENU'`
- **Format**: JSON stringified array
- **Location**: Device AsyncStorage
- **Survives**: App restart, system reboot

### Data Structure

```javascript
// Single Product
{
  id: String,              // Auto-generated
  name: String,            // Required
  description: String,     // Optional
  price: Number,           // Required
  category: String,        // Required
  image: String|null,      // Optional - File URI
  createdAt: String,       // ISO timestamp - Auto
  updatedAt: String        // ISO timestamp - Optional
}

// Stored as
[
  { ...product1 },
  { ...product2 },
  { ...productN }
]
```

---

## Image Handling

### Image URI Format

```javascript
// From Image Picker
image: "file:///data/user/0/com.example/image.jpg"

// Usage in <Image>
<Image source={{ uri: imageUri }} style={styles.image} />
```

### Image Dimensions

- **Card Image**: 100% width, 200px height
- **Detail Image**: 100% width, 300px height
- **Recommended Aspect Ratio**: 1:1 or 3:4

---

## Error Codes & Messages

| Error                        | Solution                                                   |
| ---------------------------- | ---------------------------------------------------------- |
| "Cannot find module"         | Run `npm install`                                          |
| "Port already in use"        | Kill process or use `npx expo start -p 19001`              |
| "Image picker error"         | Check permissions in device settings                       |
| "AsyncStorage not available" | Ensure @react-native-async-storage/async-storage installed |
| "Blank screen"               | Clear expo cache: `npx expo start --clear`                 |

---

## Performance Tips

1. **Use FlatList** for long lists instead of ScrollView
2. **Memoize components** to prevent unnecessary re-renders
3. **Lazy load images** with placeholder
4. **Clear AsyncStorage** periodically for old data
5. **Limit form complexity** for better UX

---

## Environment Variables

Create `.env` file if needed:

```env
# Not currently used, but can add:
EXPO_ACCOUNT_OWNER=your_expo_username
```

---

## Resources

- [React Native Docs](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation Docs](https://reactnavigation.org/)
- [AsyncStorage Guide](https://react-native-async-storage.github.io/async-storage/)

---

**Happy Coding! ☕**
