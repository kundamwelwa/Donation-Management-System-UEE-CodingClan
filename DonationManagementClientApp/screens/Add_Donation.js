import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Dimensions, ScrollView } from 'react-native';
import { Card, Button } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker'; // Updated import

const { width, height } = Dimensions.get('window');

const Add_Donation = ({ route, navigation }) => {
  // Destructure params with default values
  const { project = { title: 'Project Title', description: 'Project Description' }, orphanage = { name: 'Orphanage Name' } } = route.params || {};
  
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [donationAmount, setDonationAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Card');

  const handleSubmit = () => {
    // Handle the donation submission here
    console.log({
      donorName,
      donorEmail,
      donationAmount,
      paymentMethod,
      project,
      orphanage,
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
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
        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Payment Method</Text>
          <Picker
            selectedValue={paymentMethod}
            style={styles.picker}
            onValueChange={(itemValue) => setPaymentMethod(itemValue)}
          >
            <Picker.Item label="Card" value="Card" />
            <Picker.Item label="Mobile Money" value="Mobile Money" />
          </Picker>
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
  },
  cardContent: {
    padding: width * 0.04,
  },
  title: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: '#201E43',
    marginBottom: height * 0.01,
  },
  subtitle: {
    fontSize: width * 0.05,
    color: '#666666',
    marginBottom: height * 0.01,
  },
  description: {
    fontSize: width * 0.04,
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
  },
  pickerContainer: {
    marginBottom: height * 0.02,
  },
  label: {
    fontSize: width * 0.04,
    color: '#201E43',
    marginBottom: height * 0.01,
  },
  picker: {
    height: height * 0.06,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  submitButton: {
    backgroundColor: '#201E43',
    paddingVertical: height * 0.015,
    borderRadius: 20,
  },
});

export default Add_Donation;
