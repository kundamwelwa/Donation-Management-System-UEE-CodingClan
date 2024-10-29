import React, { useRef } from "react";
import { Text, TouchableOpacity, StyleSheet, View, StatusBar, Animated, Easing } from "react-native";
import { FontAwesome } from '@expo/vector-icons'; // Make sure to install expo-font-awesome

const LoginChoice = (props) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

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

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />

      <View style={styles.card}>
        <Text style={styles.headerText}>Choose Login Role</Text>

        <Animated.View style={[styles.buttonContainer, { transform: [{ scale: scaleAnim }] }]}>
          <TouchableOpacity 
            style={styles.button} 
            onPressIn={handlePressIn} 
            onPressOut={handlePressOut} 
            onPress={() => navigateToLogin('Donor')}>
            <FontAwesome name="heart" size={24} color="#F4F6FF" />
            <Text style={styles.buttonText}>Login as a Donor</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.button} 
            onPressIn={handlePressIn} 
            onPressOut={handlePressOut} 
            onPress={() => navigateToLogin('Orphanage')}>
            <FontAwesome name="home" size={24} color="#F4F6FF" />
            <Text style={styles.buttonText}>Login as an Orphanage</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6FF", // White background for a clean look
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  card: {
    width: '90%',
    padding: 30,
    backgroundColor: "#78B7D0", // Light grey background for the card
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10, 
    alignItems: "center",
  },
  headerText: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#F4F6FF", // Dark grey for text
    marginBottom: 30,
  },
  buttonContainer: {
    width: '100%',
    alignItems: "center",
  },
  button: {
    width: '100%',
    paddingVertical: 15,
    marginVertical: 10,
    backgroundColor: "#071952", 
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: 'row', // Align icon and text
    shadowColor: "#6200EE", 
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: {
    fontSize: 18,
    color: "#F4F6FF", // Black color for button text
    fontWeight: "bold",
    marginLeft: 10, // Space between icon and text
  },
});

export default LoginChoice;
