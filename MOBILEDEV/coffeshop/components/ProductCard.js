import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import {
  colors,
  spacing,
  borderRadius,
  shadows,
  typography,
} from "../utils/theme";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export const ProductCard = ({ product, onPress, onEdit, onDelete }) => {
  const handleDelete = () => {
    Alert.alert(
      "Hapus Menu",
      `Apakah Anda yakin ingin menghapus "${product.name}"?`,
      [
        { text: "Batal", onPress: () => {} },
        {
          text: "Hapus",
          onPress: () => onDelete(product.id),
          style: "destructive",
        },
      ],
    );
  };

  return (
    <TouchableOpacity
      style={[styles.card, shadows.medium]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Product Image */}
      <View style={styles.imageContainer}>
        {product.image ? (
          <Image
            source={{ uri: product.image }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Icon name="coffee" size={48} color={colors.cream} />
          </View>
        )}
        <View
          style={[
            styles.categoryBadge,
            { backgroundColor: colors.coffeeMedium },
          ]}
        >
          <Text style={styles.categoryText}>{product.category}</Text>
        </View>
      </View>

      {/* Product Info */}
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>
        {product.description && (
          <Text style={styles.description} numberOfLines={2}>
            {product.description}
          </Text>
        )}
        <View style={styles.priceRow}>
          <Text style={styles.price}>
            Rp {Math.floor(product.price).toLocaleString("id-ID")}
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionBtn, styles.editBtn]}
          onPress={onEdit}
        >
          <Icon name="pencil" size={18} color={colors.white} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, styles.deleteBtn]}
          onPress={handleDelete}
        >
          <Icon name="trash-can" size={18} color={colors.white} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    overflow: "hidden",
    marginBottom: spacing.lg,
    marginHorizontal: spacing.lg,
  },
  imageContainer: {
    width: "100%",
    height: 200,
    position: "relative",
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
  categoryBadge: {
    position: "absolute",
    top: spacing.md,
    right: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  categoryText: {
    color: colors.cream,
    fontSize: 12,
    fontWeight: "600",
  },
  content: {
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  name: {
    ...typography.h3,
    marginBottom: spacing.sm,
  },
  description: {
    ...typography.bodySmall,
    marginBottom: spacing.md,
    color: colors.darkGray,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.coffeeMedium,
  },
  actionButtons: {
    flexDirection: "row",
    padding: spacing.md,
    justifyContent: "flex-end",
    gap: spacing.md,
  },
  actionBtn: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    justifyContent: "center",
    alignItems: "center",
  },
  editBtn: {
    backgroundColor: colors.info,
  },
  deleteBtn: {
    backgroundColor: colors.error,
  },
});
