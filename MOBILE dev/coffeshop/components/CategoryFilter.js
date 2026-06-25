import React from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import { colors, spacing, borderRadius, typography } from "../utils/theme";

export const CategoryFilter = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  const allCategories = ["Semua", ...categories];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {allCategories.map((category, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.categoryButton,
            selectedCategory === category && styles.categoryButtonActive,
          ]}
          onPress={() => onSelectCategory(category)}
        >
          <Text
            style={[
              styles.categoryText,
              selectedCategory === category && styles.categoryTextActive,
            ]}
          >
            {category}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.cream,
    paddingVertical: spacing.md,
  },
  contentContainer: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  categoryButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.mediumGray,
  },
  categoryButtonActive: {
    backgroundColor: colors.coffeeMedium,
    borderColor: colors.coffeeMedium,
  },
  categoryText: {
    ...typography.body,
    color: colors.softBlack,
    fontWeight: "500",
  },
  categoryTextActive: {
    color: colors.cream,
  },
});
