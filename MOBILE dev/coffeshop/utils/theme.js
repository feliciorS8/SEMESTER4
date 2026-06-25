// Coffee Shop Theme Colors - Warm & Modern
export const colors = {
  // Primary Coffee Colors
  coffeeDeep: "#2C1810", // Deep coffee brown
  coffeeMedium: "#6F4E37", // Medium coffee brown
  coffeeLight: "#A0826D", // Light coffee brown

  // Accent Colors
  cream: "#F5EDD9", // Warm cream
  beige: "#E8DCC8", // Beige
  ivory: "#FFFAF0", // Ivory white
  softBlack: "#3D3D3D", // Soft black

  // Functional Colors
  white: "#FFFFFF",
  lightGray: "#F0F0F0",
  mediumGray: "#D4D4D4",
  darkGray: "#808080",

  // Semantic Colors
  success: "#6BAA54", // Green for success
  error: "#E63946", // Red for error
  warning: "#F77F00", // Orange for warning
  info: "#457B9D", // Blue for info

  // UI Elements
  shadow: "rgba(44, 24, 16, 0.1)",
  transparentCoffee: "rgba(111, 78, 55, 0.8)",
};

export const typography = {
  h1: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.coffeeDeep,
  },
  h2: {
    fontSize: 24,
    fontWeight: "600",
    color: colors.coffeeDeep,
  },
  h3: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.coffeeDeep,
  },
  body: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.softBlack,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: "400",
    color: colors.darkGray,
  },
  caption: {
    fontSize: 12,
    fontWeight: "400",
    color: colors.mediumGray,
  },
  button: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.white,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const borderRadius = {
  sm: 6,
  md: 12,
  lg: 16,
  xl: 24,
};

export const shadows = {
  light: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 2,
  },
  medium: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 5.46,
    elevation: 4,
  },
  heavy: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 10.32,
    elevation: 8,
  },
};
