import React from "react";
import { TouchableOpacity, ImageBackground, StyleSheet, View, Text, Dimensions, StatusBar } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const localimage = require("../assets/splash.jpg");

const Splash = (props) => {

  const onPress = () => {
    props.navigation.navigate('Login_choice');
  };

  return (
    <ImageBackground source={localimage} style={styles.container} blurRadius={10}>
      {/* Set the StatusBar to transparent */}
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content" // Set this based on your image contrast
      />
      
      <LinearGradient
        colors={['rgba(0,0,0,0.9)', 'rgba(0,0,0,0.9)', 'rgba(0,0,0,0)']}
        start={{ x: 0, y: 1 }}
        end={{ x: 0, y: 0.4 }}
        style={styles.gradientOverlay}
      >
        <View style={styles.messageContainer}>
          <Text style={styles.welcomeText}>WELCOME TO THE ORPHANAGE DONATION MANAGEMENT SYSTEM</Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={onPress}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </LinearGradient>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    // Ensure the image covers the entire screen including the status bar
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: '100%',
    height: '100%',
  },
  messageContainer: {
    position: "absolute",
    top: height * 0.2,  // 20% from the top
    alignItems: "center",
    paddingHorizontal: width * 0.1,  // 10% horizontal padding
  },
  welcomeText: {
    paddingTop: height * 0.2,
    fontSize: width * 0.06,  // 6% of screen width
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: height * 0.02,  // 2% margin below
  },
  button: {
    marginTop: height * 0.7,  // 55% from the top of the container
    paddingVertical: height * 0.02,  // 2% of screen height
    paddingHorizontal: width * 0.18,  // 25% of screen width
    backgroundColor: "#3A74CB",
    borderRadius: width * 0.125,  // 12.5% of screen width
    shadowColor: "#77E4C8",  // Light blue shadow color
    shadowOffset: { width: 0, height: 0 },  // Even shadow on all sides
    shadowOpacity: 5,  // Full opacity for strong glow
    shadowRadius: 70,  // Large radius for a more pronounced glow
    elevation: 10,
  },
  buttonText: {
    fontSize: width * 0.060,  // 4.5% of screen width
    fontWeight: "bold",
    textAlign: "center",
    color: "#fff",
  },
});

export default Splash;
