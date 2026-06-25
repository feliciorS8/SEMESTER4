import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { colors, spacing, typography } from "../utils/theme";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export const Header = ({
  title,
  showBackButton,
  onBackPress,
  rightIcon,
  onRightPress,
}) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        {showBackButton ? (
          <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
            <Icon name="arrow-left" size={24} color={colors.coffeeDeep} />
          </TouchableOpacity>
        ) : (
          <View style={styles.spacer} />
        )}

        <Text style={styles.title}>{title}</Text>

        {rightIcon ? (
          <TouchableOpacity style={styles.rightButton} onPress={onRightPress}>
            <Icon name={rightIcon} size={24} color={colors.coffeeDeep} />
          </TouchableOpacity>
        ) : (
          <View style={styles.spacer} />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.cream,
  },
  header: {
    width: "100%",
    height: 60,
    backgroundColor: colors.cream,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.beige,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  rightButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  spacer: {
    width: 40,
  },
  title: {
    ...typography.h2,
    flex: 1,
    textAlign: "center",
  },
});
