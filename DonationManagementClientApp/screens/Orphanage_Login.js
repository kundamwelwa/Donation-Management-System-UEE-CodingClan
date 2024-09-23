import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Dimensions } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import MaterialIcons for icons

const { width, height } = Dimensions.get('window');

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .min(8, 'Password too short!')
    .matches(/[a-zA-Z]/, 'Password can only contain Latin letters.')
    .required('Password is required'),
});

const Orphanage_Login = ({ navigation }) => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleLogin = async (values) => {
    try {
      const apiUrl = 'http://192.168.43.189:5001/api'; // Replace with your backend API URL

      console.log('Using API URL:', apiUrl);
      console.log('Login request payload:', values); // Log the request payload

      const response = await axios.post(`${apiUrl}/orphanage-auth/Orphanagelogin`, values);

      console.log('Login response:', response.data);

      if (response.data.message === 'Invalid email or password') {
        throw new Error('Invalid email or password');
      }

      const { token, user } = response.data;

      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('userName', user.name);

      Alert.alert('Login Successful', 'You have logged in successfully.');
      navigation.navigate('Orphanage_Dashboard', { userName: user.name });
    } catch (error) {
      console.error('Login Error:', error.response?.data || error.message);
      Alert.alert('Login Failed', error.response?.data?.message || 'An unexpected error occurred. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
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
                <Icon name={passwordVisible ? "visibility" : "visibility-off"} size={20}  />
              </TouchableOpacity>
            </View>
            {errors.password && touched.password ? (
              <Text style={styles.errorText}>{errors.password}</Text>
            ) : null}

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Login</Text>
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
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: width * 0.1,
    paddingTop: 50,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 50,
    color: '#1E201E',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    padding: 5,
    borderRadius: 12,
    marginBottom: height * 0.02,  // Responsive margin
  },
  input: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
  },
  icon: {
    paddingHorizontal: 10,
    color: '#434242',
  },
  eyeIcon: {
    paddingHorizontal: 10,
    color: '#434242',
  },
  button: {
    backgroundColor: '#201E43',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 24,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  linkText: {
    color: '#4A90E2',
    textDecorationLine: 'underline',
    color: '#201E43',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
  },
  togglePassword: {
    color: '#4A90E2',
    textAlign: 'right',
    marginBottom: 10,
  },
});

export default Orphanage_Login;
