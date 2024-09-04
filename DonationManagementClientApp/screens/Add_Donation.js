import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Dimensions, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Card, Button } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';

const { width, height } = Dimensions.get('window');

// Import icons
const visaIcon = require('../assets/Images/Visa.png'); // Ensure you have visa.png in your assets folder
const mobileMoneyIcon = require('../assets/Images/MobileMoney.png'); // Ensure you have mobile-money.png in your assets folder

const Add_Donation = ({ route, navigation }) => {
  const { project = { title: 'Project Title', description: 'Project Description' }, orphanage = { name: 'Orphanage Name' } } = route.params || {};
  
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [donationAmount, setDonationAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Card');

  const handleSubmit = () => {
    console.log({
      donorName,
      donorEmail,
      donationAmount,
      paymentMethod,
      project,
      orphanage,
    });
  };

  // Handle payment method change
  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Removed the StatusBarManager */}
      
      <Card style={styles.card}>
        <View style={styles.cardContent}>
          <Text style={styles.title}>Donate to {project.title}</Text>
          <Text style={styles.subtitle}>Orphanage: {orphanage.name}</Text>
          <Text style={styles.description}>{project.description}</Text>
        </View>
      </Card>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Your Name"
          value={donorName}
          onChangeText={setDonorName}
        />
        <TextInput
          style={styles.input}
          placeholder="Your Email"
          value={donorEmail}
          onChangeText={setDonorEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Donation Amount"
          keyboardType="numeric"
          value={donationAmount}
          onChangeText={setDonationAmount}
        />
        
        <Text style={styles.label}>Payment Method</Text>
        
        <View style={styles.iconContainer}>
          <TouchableOpacity
            style={[
              styles.paymentButton,
              paymentMethod === 'Card' && styles.selectedButton,
            ]}
            onPress={() => handlePaymentMethodChange('Card')}
          >
            <Image source={visaIcon} style={styles.paymentIcon} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.paymentButton,
              paymentMethod === 'Mobile Money' && styles.selectedButton,
            ]}
            onPress={() => handlePaymentMethodChange('Mobile Money')}
          >
            <Image source={mobileMoneyIcon} style={styles.paymentIcon} />
          </TouchableOpacity>
        </View>

        <Button mode="contained" style={styles.submitButton} onPress={handleSubmit}>
          Donate
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F5F5F5',
    padding: width * 0.04,
  },
  card: {
    marginBottom: height * 0.02,
    borderRadius: 15,
    elevation: 4,
  },
  cardContent: {
    padding: width * 0.05,
    justifyContent: 'center',
  },
  title: {
    fontSize: width * 0.07,
    fontWeight: 'bold',
    color: '#201E43',
    marginBottom: height * 0.01,
  },
  subtitle: {
    fontSize: width * 0.05,
    color: '#666666',
    marginBottom: height * 0.02,
  },
  description: {
    fontSize: width * 0.045,
    color: '#888888',
  },
  formContainer: {
    marginTop: height * 0.02,
  },
  input: {
    height: height * 0.06,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: width * 0.04,
    marginBottom: height * 0.02,
    backgroundColor: '#FFFFFF',
    fontSize: width * 0.045,
  },
  label: {
    fontSize: width * 0.045,
    color: '#201E43',
    marginBottom: height * 0.01,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: height * 0.02,
  },
  paymentButton: {
    padding: 10,
    borderRadius: 10,
  },
  selectedButton: {
    borderWidth: 2,
    borderColor: '#201E43',
    shadowColor: '#201E43',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
  paymentIcon: {
    width: width * 0.4,
    height: height * 0.08,
    resizeMode: 'contain',
  },
  submitButton: {
    backgroundColor: '#201E43',
    paddingVertical: height * 0.015,
    borderRadius: 20,
  },
});

export default Add_Donation;
