import React, { useRef, useEffect, useState } from "react";
import { Text, TouchableOpacity, StyleSheet, View, StatusBar, Animated, Dimensions, ImageBackground } from "react-native";
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';

const { width, height } = Dimensions.get('window');

const scale = size => (width / 375) * size; // Scaling function
const scaleHeight = size => (height / 667) * size; // Adjusted height scale

const LoginChoice = (props) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const headerAnim = useRef(new Animated.Value(0)).current; // Header animation

  const [fontsLoaded] = useFonts({
    Montserrat: require('../assets/fonts/MontserratAlternates-Bold.ttf'), // Adjust the path as needed
  });

  // Handle loading state
  const [loading, setLoading] = useState(!fontsLoaded);

  useEffect(() => {
    if (fontsLoaded) {
      setLoading(false);
      // Animate the header on mount
      Animated.timing(headerAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    }
  }, [fontsLoaded]); // Only run this effect when fontsLoaded changes

  const navigateToLogin = (role) => {
    if (role === 'Donor') {
      props.navigation.navigate('Donor_Login'); 
    } else if (role === 'Orphanage') {
      props.navigation.navigate('Orphanage_Login'); 
    }
  };

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      tension: 300,
      useNativeDriver: true,
    }).start();
  };

  // Display AppLoading if fonts are not loaded
  if (loading) {
    return <AppLoading />;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <ImageBackground 
        source={require('../assets/Images/Loginchoice3.jpg')}
        style={styles.image}
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.9)', 'rgba(0,0,0,0.9)', 'rgba(0,0,0,0)']}
          start={{ x: 0, y: 1 }}
          end={{ x: 0, y: 0.4 }}
          style={styles.gradientOverlay}
        >
          <Animated.View style={[styles.headerContainer, { opacity: headerAnim }]}>
            <Text style={styles.headerText}>How do you want to use this app?</Text>
          </Animated.View>

          <View style={styles.buttonContainer}>
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
              <TouchableOpacity 
                style={styles.button} 
                onPressIn={handlePressIn} 
                onPressOut={handlePressOut} 
                onPress={() => navigateToLogin('Donor')}
              >
                <Text style={styles.buttonText}>Login as a Donor</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.button} 
                onPressIn={handlePressIn} 
                onPressOut={handlePressOut} 
                onPress={() => navigateToLogin('Orphanage')}
              >
                <Text style={styles.buttonText}>Login as an Orphanage</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: scale(0),
  },
  image: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  gradientOverlay: {
    padding: scale(20),
    borderTopLeftRadius: scale(20),
    borderTopRightRadius: scale(20),
  },
  headerContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Dark transparent background
    paddingVertical: scale(40),
    paddingHorizontal: scale(60),
    borderRadius: scale(10),
    alignSelf: 'center',
    marginBottom: scaleHeight(270),
  },
  headerText: {
    fontSize: scale(28),
    fontFamily: 'Montserrat', // Custom font
    fontWeight: "bold",
    paddingBottom: scale(1),
    color: "#F4F6FF",
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    alignItems: "center",
  },
  button: {
    width: '100%',
    paddingVertical: scale(15),
    marginVertical: scaleHeight(10),
    backgroundColor: "#071952",
    borderRadius: scale(15),
    alignItems: "center",
    justifyContent: "center",
    flexDirection: 'row',
    shadowColor: "#6200EE",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: {
    fontSize: scale(18),
    color: "#F4F6FF",
    fontWeight: "bold",
    textAlign: 'center', // Center the text horizontally
    flex: 1, // Allow the text to expand and fill the button space
  },
});

export default LoginChoice;
