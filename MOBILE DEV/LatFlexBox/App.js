import { StyleSheet, View, Text, StatusBar } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#c8c8c8" />

      {/* ===== Status Bar Area (simulated) ===== */}
      <View style={styles.phoneStatusBar} />

      {/* ===== App Title Bar ===== */}
      <View style={styles.titleBar}>
        <Text style={styles.titleText}>Latihan FlexBox</Text>
      </View>

      {/* ===== Row 1: Shapes Row ===== */}
      {/* Black Square, Green Circle, Red Circle, Blue Circle */}
      <View style={styles.shapeRow}>
        <View style={styles.blackSquare} />
        <View style={styles.greenCircle} />
        <View style={styles.redCircle} />
        <View style={styles.blueCircle} />
      </View>

      {/* ===== Main FlexBox Layout (Green background) ===== */}
      <View style={styles.mainArea}>

        {/* Left side */}
        <View style={styles.leftSide}>
          {/* Yellow block - top left */}
          <View style={styles.yellowBlockLeft} />

          {/* Red block - bottom left, narrower */}
          <View style={styles.redBlockLeft} />
        </View>

        {/* Right side */}
        <View style={styles.rightSide}>
          {/* Blue block on top */}
          <View style={styles.blueBlockRight} />

          {/* Yellow block below */}
          <View style={styles.yellowBlockRight} />
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  // Simulated phone status bar (light gray)
  phoneStatusBar: {
    height: 24,
    backgroundColor: '#d0d0d0',
  },

  // Title Bar (gray)
  titleBar: {
    backgroundColor: '#c0c0c0',
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    elevation: 2,
  },
  titleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111111',
    letterSpacing: 0.5,
  },

  // -------- Shape Row --------
  shapeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 14,
    backgroundColor: '#f0f0f0',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },

  blackSquare: {
    width: 44,
    height: 44,
    backgroundColor: '#000000',
    borderRadius: 2,
  },
  greenCircle: {
    width: 44,
    height: 44,
    backgroundColor: '#0a8a0a',
    borderRadius: 22,
  },
  redCircle: {
    width: 44,
    height: 44,
    backgroundColor: '#dd0000',
    borderRadius: 22,
  },
  blueCircle: {
    width: 44,
    height: 44,
    backgroundColor: '#0033cc',
    borderRadius: 22,
  },

  // -------- Main FlexBox Area --------
  mainArea: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#1a7a1a',  // dark green background
  },

  // Left column - takes ~55% width
  leftSide: {
    flex: 55,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },

  // Yellow block - top-left, full width of left side, tall
  yellowBlockLeft: {
    width: '100%',
    height: 160,
    backgroundColor: '#f5d800',
  },

  // Red block - below yellow on left, shorter and narrower
  redBlockLeft: {
    width: '65%',
    height: 90,
    backgroundColor: '#dd0000',
    marginTop: 8,
  },

  // Right column - takes ~45% width
  rightSide: {
    flex: 45,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingLeft: 8,
    paddingTop: 0,
  },

  // Blue block - top-right
  blueBlockRight: {
    width: '80%',
    height: 110,
    backgroundColor: '#0033cc',
  },

  // Yellow block - below blue on right side
  yellowBlockRight: {
    width: '65%',
    height: 75,
    backgroundColor: '#f5d800',
    marginTop: 8,
  },
});
