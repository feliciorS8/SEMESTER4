import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Header } from "../components";
import * as Storage from "../utils/storage";
import {
  colors,
  spacing,
  borderRadius,
  typography,
  shadows,
} from "../utils/theme";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export const ProductDetailScreen = ({ navigation, route }) => {
  const { productId } = route.params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadProduct();
  }, []);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const productData = await Storage.getProductById(productId);
      if (productData) {
        setProduct(productData);
      } else {
        Alert.alert("Error", "Menu tidak ditemukan");
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert("Error", "Gagal memuat menu");
      console.error("Load product error:", error);
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Hapus Menu",
      `Apakah Anda yakin ingin menghapus "${product.name}"?`,
      [
        { text: "Batal", onPress: () => {} },
        {
          text: "Hapus",
          onPress: deleteProduct,
          style: "destructive",
        },
      ],
    );
  };

  const deleteProduct = async () => {
    try {
      setDeleting(true);
      await Storage.deleteProduct(productId);
      Alert.alert("Sukses", "Menu berhasil dihapus", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert("Error", "Gagal menghapus menu");
      console.error("Delete error:", error);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header
          title="Detail Menu"
          showBackButton
          onBackPress={() => navigation.goBack()}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.coffeeMedium} />
        </View>
      </SafeAreaView>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Detail Menu"
        showBackButton
        onBackPress={() => navigation.goBack()}
        rightIcon="pencil"
        onRightPress={() => navigation.navigate("EditProduct", { productId })}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Product Image */}
        <View style={[styles.imageContainer, shadows.medium]}>
          {product.image ? (
            <Image
              source={{ uri: product.image }}
              style={styles.image}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Icon name="coffee" size={80} color={colors.cream} />
            </View>
          )}
        </View>

        {/* Product Info */}
        <View style={styles.infoSection}>
          {/* Category Badge */}
          <View style={styles.categoryRow}>
            <View
              style={[
                styles.categoryBadge,
                { backgroundColor: colors.coffeeMedium },
              ]}
            >
              <Icon name="tag" size={16} color={colors.cream} />
              <Text style={styles.categoryText}>{product.category}</Text>
            </View>
          </View>

          {/* Product Name */}
          <Text style={styles.productName}>{product.name}</Text>

          {/* Price */}
          <View style={styles.priceSection}>
            <Text style={styles.priceLabel}>Harga</Text>
            <Text style={styles.price}>
              Rp {Math.floor(product.price).toLocaleString("id-ID")}
            </Text>
          </View>

          {/* Description */}
          {product.description && (
            <View style={styles.descriptionSection}>
              <Text style={styles.sectionTitle}>Deskripsi</Text>
              <Text style={styles.description}>{product.description}</Text>
            </View>
          )}

          {/* Additional Info */}
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Icon name="calendar" size={20} color={colors.coffeeMedium} />
              <Text style={styles.infoLabel}>Ditambahkan</Text>
              <Text style={styles.infoValue}>
                {new Date(product.createdAt).toLocaleDateString("id-ID")}
              </Text>
            </View>

            {product.updatedAt && (
              <View style={styles.infoItem}>
                <Icon
                  name="pencil-outline"
                  size={20}
                  color={colors.coffeeMedium}
                />
                <Text style={styles.infoLabel}>Diperbarui</Text>
                <Text style={styles.infoValue}>
                  {new Date(product.updatedAt).toLocaleDateString("id-ID")}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.editButton, shadows.light]}
            onPress={() => navigation.navigate("EditProduct", { productId })}
          >
            <Icon name="pencil" size={20} color={colors.white} />
            <Text style={styles.buttonText}>Edit Menu</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.deleteButton,
              shadows.light,
              deleting && styles.buttonDisabled,
            ]}
            onPress={handleDelete}
            disabled={deleting}
          >
            <Icon name="trash-can" size={20} color={colors.white} />
            <Text style={styles.buttonText}>
              {deleting ? "Menghapus..." : "Hapus Menu"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  imageContainer: {
    width: "100%",
    height: 300,
    backgroundColor: colors.lightGray,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: colors.coffeeMedium,
    justifyContent: "center",
    alignItems: "center",
  },
  infoSection: {
    padding: spacing.xl,
  },
  categoryRow: {
    marginBottom: spacing.lg,
  },
  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignSelf: "flex-start",
    gap: spacing.sm,
  },
  categoryText: {
    color: colors.cream,
    fontSize: 14,
    fontWeight: "600",
  },
  productName: {
    ...typography.h1,
    marginBottom: spacing.lg,
  },
  priceSection: {
    backgroundColor: colors.cream,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    marginBottom: spacing.lg,
  },
  priceLabel: {
    ...typography.bodySmall,
    color: colors.softBlack,
    marginBottom: spacing.sm,
  },
  price: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.coffeeMedium,
  },
  descriptionSection: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.h3,
    marginBottom: spacing.md,
  },
  description: {
    ...typography.body,
    color: colors.darkGray,
    lineHeight: 24,
  },
  infoGrid: {
    flexDirection: "row",
    gap: spacing.lg,
    marginBottom: spacing.xl,
  },
  infoItem: {
    flex: 1,
    backgroundColor: colors.lightGray,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: "center",
  },
  infoLabel: {
    ...typography.caption,
    marginTop: spacing.sm,
    color: colors.darkGray,
  },
  infoValue: {
    ...typography.bodySmall,
    marginTop: spacing.xs,
    fontWeight: "600",
    color: colors.coffeeDeep,
  },
  buttonContainer: {
    flexDirection: "column",
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  editButton: {
    flexDirection: "row",
    backgroundColor: colors.info,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.md,
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.md,
  },
  deleteButton: {
    flexDirection: "row",
    backgroundColor: colors.error,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.md,
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.md,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    ...typography.button,
    color: colors.white,
  },
});
