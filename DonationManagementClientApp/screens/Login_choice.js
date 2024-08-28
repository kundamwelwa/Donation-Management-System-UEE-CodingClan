import React from "react";
import { Text, TouchableOpacity, StyleSheet, View } from "react-native";

const LoginChoice = (props) => {

  const navigateToLogin = (role) => {
    if (role === 'Donor') {
      props.navigation.navigate('Donor_Login'); // Navigate to Donor_Login screen
    } else if (role === 'Orphanage') {
      props.navigation.navigate('Orphanage_Login'); // Assuming you have an OrphanageLogin screen
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={() => navigateToLogin('Donor')}>
        <Text style={styles.buttonText}>Login as a Donor</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigateToLogin('Orphanage')}>
        <Text style={styles.buttonText}>Login as an Orphanage</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#201E43", // Solid blue color
    alignItems: "center",
    justifyContent: "center",
    padding: 20, // Added padding for better spacing
  },
  button: {
    width: '80%', // Adjust width as needed
    paddingVertical: 15,
    marginVertical: 10,
    backgroundColor: "#0056A0", // A contrasting shade of blue
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
});

export default LoginChoice;