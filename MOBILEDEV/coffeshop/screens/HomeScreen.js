import React, { useState, useFocusEffect } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
  SafeAreaView,
  RefreshControl,
  Alert,
} from "react-native";
import { Header, ProductCard, CategoryFilter } from "../components";
import * as Storage from "../utils/storage";
import { colors, spacing, typography } from "../utils/theme";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export const HomeScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Load products when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadProducts();
    }, []),
  );

  const loadProducts = async () => {
    try {
      setLoading(true);
      const allProducts = await Storage.getAllProducts();
      const uniqueCategories = await Storage.getAllCategories();

      setProducts(allProducts);
      setCategories(uniqueCategories);
      filterProducts(allProducts, "Semua");
    } catch (error) {
      Alert.alert("Error", "Gagal memuat menu");
      console.error("Load products error:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = (allProducts, category) => {
    setSelectedCategory(category);
    if (category === "Semua") {
      setFilteredProducts(allProducts);
    } else {
      const filtered = allProducts.filter((p) => p.category === category);
      setFilteredProducts(filtered);
    }
  };

  const handleCategorySelect = (category) => {
    filterProducts(products, category);
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await Storage.deleteProduct(productId);
      await loadProducts();
      Alert.alert("Sukses", "Menu berhasil dihapus");
    } catch (error) {
      Alert.alert("Error", "Gagal menghapus menu");
      console.error("Delete error:", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProducts();
    setRefreshing(false);
  };

  const renderProductCard = ({ item }) => (
    <ProductCard
      product={item}
      onPress={() =>
        navigation.navigate("ProductDetail", { productId: item.id })
      }
      onEdit={() => navigation.navigate("EditProduct", { productId: item.id })}
      onDelete={handleDeleteProduct}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Icon name="coffee-outline" size={64} color={colors.coffeeMedium} />
      <Text style={styles.emptyTitle}>Belum Ada Menu</Text>
      <Text style={styles.emptySubtitle}>
        Mulai dengan menambahkan menu kopi atau makanan pertama Anda
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="☕ Coffee Shop"
        rightIcon="plus-circle"
        onRightPress={() => navigation.navigate("AddProduct")}
      />

      {/* Category Filter */}
      {categories.length > 0 && (
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategorySelect}
        />
      )}

      {/* Products List */}
      <FlatList
        data={filteredProducts}
        renderItem={renderProductCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.coffeeMedium]}
            tintColor={colors.coffeeMedium}
          />
        }
      />

      {/* Floating Action Button */}
      {filteredProducts.length > 0 && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate("AddProduct")}
        >
          <Icon name="plus" size={32} color={colors.white} />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  listContent: {
    paddingBottom: spacing.xl,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: spacing.xxl,
    paddingHorizontal: spacing.lg,
  },
  emptyTitle: {
    ...typography.h2,
    marginTop: spacing.lg,
  },
  emptySubtitle: {
    ...typography.bodySmall,
    marginTop: spacing.md,
    textAlign: "center",
    color: colors.darkGray,
  },
  fab: {
    position: "absolute",
    bottom: spacing.xl,
    right: spacing.xl,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.coffeeMedium,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.coffeeDeep,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
