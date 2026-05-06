import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function SplashScreen({ onFinish }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const slideUp = useRef(new Animated.Value(50)).current;
  const progressWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate logo
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(slideUp, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Progress bar animation
    Animated.timing(progressWidth, {
      toValue: 1,
      duration: 2500,
      useNativeDriver: false,
    }).start();

    // Navigate after splash
    const timer = setTimeout(() => {
      onFinish();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {/* Background decorative circles */}
      <View style={styles.circle1} />
      <View style={styles.circle2} />
      <View style={styles.circle3} />

      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }, { translateY: slideUp }],
          },
        ]}
      >
        <View style={styles.iconBox}>
          <Text style={styles.iconText}>🏪</Text>
        </View>
        <Text style={styles.title}>UMKM Go Digital</Text>
        <Text style={styles.subtitle}>Digitalisasi Usaha Anda</Text>
        <Text style={styles.tagline}>
          Kelola produk, transaksi, dan bisnis{'\n'}dalam satu aplikasi
        </Text>
      </Animated.View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBg}>
          <Animated.View
            style={[
              styles.progressBar,
              {
                width: progressWidth.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          />
        </View>
        <Animated.Text style={[styles.loadingText, { opacity: fadeAnim }]}>
          Memuat aplikasi...
        </Animated.Text>
      </View>

      <Animated.Text style={[styles.version, { opacity: fadeAnim }]}>
        v1.0.0 • UTS Mobile Development
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1B2A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle1: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(30, 136, 229, 0.15)',
    top: -50,
    right: -80,
  },
  circle2: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(0, 206, 209, 0.1)',
    bottom: 100,
    left: -60,
  },
  circle3: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 107, 107, 0.08)',
    top: height * 0.3,
    left: width * 0.6,
  },
  logoContainer: {
    alignItems: 'center',
  },
  iconBox: {
    width: 110,
    height: 110,
    borderRadius: 30,
    backgroundColor: 'rgba(30, 136, 229, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: 'rgba(30, 136, 229, 0.4)',
  },
  iconText: {
    fontSize: 56,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: '#1E88E5',
    fontWeight: '600',
    marginTop: 8,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  tagline: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 20,
  },
  progressContainer: {
    position: 'absolute',
    bottom: 100,
    width: width * 0.6,
    alignItems: 'center',
  },
  progressBg: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#1E88E5',
    borderRadius: 2,
  },
  loadingText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
    marginTop: 12,
  },
  version: {
    position: 'absolute',
    bottom: 40,
    color: 'rgba(255,255,255,0.25)',
    fontSize: 11,
  },
});
