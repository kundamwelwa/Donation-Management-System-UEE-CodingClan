import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert,StatusBar, Dimensions, ActivityIndicator } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width, height } = Dimensions.get('window');
const scale = size => (width / 375) * size; // Assuming 375 is the base width (iPhone 6/7/8)
const scaleHeight = size => (height / 667) * size; // Assuming 667 is the base height (iPhone 6/7/8)
// Define validation schema using Yup
const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .min(8, 'Password too short!')
    .matches(/[a-zA-Z]/, 'Password can only contain Latin letters.')
    .required('Password is required'),
});

const Orphanage_Login = ({ navigation }) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state

  const handleLogin = async (values) => {
    setLoading(true); // Start loading
    try {
      const apiUrl = 'http://192.168.8.102:5001/api';

      console.log('Using API URL:', apiUrl);
      console.log('Login request payload:', values);

      const response = await axios.post(`${apiUrl}/orphanages/Orphanagelogin`, values);

      // Log the entire response to inspect the structure
      console.log('Full login response data:', response.data);

      const token = response.data.token;
      const name = response.data.name; // Extract name directly from the response
      const orphanageID = response.data.id; // Ensure you extract the ID

      // Log extracted values for debugging
      console.log('Extracted Token:', token);
      console.log('Extracted Name:', name);
      console.log('Extracted Orphanage ID:', orphanageID); // Log the ID

      if (!token || !name || !orphanageID) {
        throw new Error('User data is incomplete or missing.');
      }

      // Store the token and user name in AsyncStorage
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('orphanageName', name); // Use the extracted name
      await AsyncStorage.setItem('orphanageID', orphanageID); // Store the orphanage ID

      Alert.alert('Login Successful', 'You have logged in successfully.');
      navigation.navigate('Orphanage_Dashboard', { name: name }); // Pass the name to the next screen
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'An unexpected error occurred. Please try again.';
      console.error('Login Error:', errorMessage);
      Alert.alert('Login Failed', errorMessage);
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#f9f9f9" barStyle="dark-content" />
      <Text style={styles.title}>Orphanage Login</Text>
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={LoginSchema}
        onSubmit={handleLogin}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View>
            <View style={styles.inputContainer}>
              <Icon name="email" size={20} color="gray" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Email Address"
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
              />
            </View>
            {errors.email && touched.email ? (
              <Text style={styles.errorText}>{errors.email}</Text>
            ) : null}

            <View style={styles.inputContainer}>
              <Icon name="lock" size={20} color="gray" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry={!passwordVisible}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
              />
              <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)} style={styles.eyeIcon}>
                <Icon name={passwordVisible ? "visibility" : "visibility-off"} size={20} />
              </TouchableOpacity>
            </View>
            {errors.password && touched.password ? (
              <Text style={styles.errorText}>{errors.password}</Text>
            ) : null}

            <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Login</Text>
              )}
            </TouchableOpacity>

            <View style={styles.optionsContainer}>
              <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                <Text style={styles.linkText}>Forgot Password?</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Orphanage_Signup')}>
                <Text style={styles.linkText}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: scale(20), // Responsive padding
    backgroundColor: '#fff',
  },
  title: {
    fontSize: scale(width * 0.1), // Responsive font size
    paddingTop: scaleHeight(50), // Responsive padding
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: scaleHeight(50), // Responsive margin
    color: '#1E201E',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    padding: scale(5), // Responsive padding
    borderRadius: scale(12), // Responsive border radius
    marginBottom: scaleHeight(20), // Responsive margin
  },
  input: {
    flex: 1,
    padding: scale(10), // Responsive padding
    borderRadius: scale(5), // Responsive border radius
  },
  icon: {
    paddingHorizontal: scale(10), // Responsive padding
    color: '#434242',
  },
  eyeIcon: {
    paddingHorizontal: scale(10), // Responsive padding
    color: '#434242',
  },
  button: {
    backgroundColor: '#201E43',
    padding: scale(15), // Responsive padding
    borderRadius: scale(15), // Responsive border radius
    alignItems: 'center',
    marginVertical: scaleHeight(10), // Responsive margin
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: scale(24), // Responsive font size
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: scaleHeight(10), // Responsive margin
  },
  linkText: {
    color: '#4A90E2',
    textDecorationLine: 'underline',
    color: '#201E43',
  },
  errorText: {
    color: 'red',
    fontSize: scale(12), // Responsive font size
    marginBottom: scaleHeight(10), // Responsive margin
  },
  togglePassword: {
    color: '#4A90E2',
    textAlign: 'right',
    marginBottom: scaleHeight(10), // Responsive margin
  },
});


export default Orphanage_Login;
