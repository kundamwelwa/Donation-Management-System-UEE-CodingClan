import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator, StatusBar, Dimensions } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import ChevronIcon from 'react-native-vector-icons/MaterialIcons'; // Importing Chevron icon
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env'; // Importing API_URL from env

const { width, height } = Dimensions.get('window');

// Validation schema for signup form
const SignUpSchema = Yup.object().shape({
  userType: Yup.string().oneOf(['Personal', 'Organization'], 'User type is invalid').required('User type is required'),
  fullName: Yup.string(),
  orgName: Yup.string(),
  orgRegNumber: Yup.string(),
  orgType: Yup.string(),
  contactName: Yup.string(),
  contactPosition: Yup.string(),
  email: Yup.string().email('Invalid email').required('Email is required'),
  physicalAddress: Yup.string().required('Physical address is required'),
  contactDetails: Yup.string().required('Contact details are required'),
  password: Yup.string().min(8, 'Password must be at least 8 characters long').required('Password is required'),
});


// Component definition
const Donor_Signup = ({ navigation }) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Function to handle Signup
  const handleSignUp = async (values, { resetForm }) => {
    setIsSubmitting(true);
    
    const apiUrl = API_URL || '192.168.8.106:5001/api'; // Use API_URL from env or fallback

    console.log('Using API URL:', apiUrl);
    console.log('Signup request payload:', values);

    try {
      const response = await axios.post(`${apiUrl}/auth/signup`, values);
      console.log('Signup response:', response.data);

      if (response.data.message === 'User already registered') {
        Alert.alert(
          '⚠️ User Exists', 
          'This email is already registered. Please log in.', 
          [{ text: 'OK', onPress: () => setIsSubmitting(false) }]
        );
      } else {
        // Store the JWT token for authenticated requests
        await AsyncStorage.setItem('token', response.data.token);
        
        // Store user details only if available
        if (response.data.user) {
          await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
        }

        Alert.alert(
          '🎉 Success', 
          'Registration Successful!', 
          [{
            text: 'OK',
            onPress: () => {
              setIsSubmitting(false);
              resetForm();
              navigation.navigate('Donor_Login'); // Navigate to Login or Home
            },
          }],
          { cancelable: false }
        );
      }
    } catch (error) {
      console.error('Sign Up Error:', error.response ? error.response.data : error.message);
      let errorMessage = 'Failed to sign up. Please try again later.';
      if (error.response && error.response.data.message) {
        errorMessage = error.response.data.message;
      }
      Alert.alert('Error', errorMessage);
      setIsSubmitting(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <StatusBar backgroundColor="#f9f9f9" barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Create An Account</Text>
        <Formik
          initialValues={{
            userType: 'Personal',
            fullName: '',
            orgName: '',
            orgRegNumber: '',
            orgType: '',
            contactName: '',
            contactPosition: '',
            email: '',
            physicalAddress: '',
            contactDetails: '',
            password: '',
          }}
          validationSchema={SignUpSchema}
          onSubmit={handleSignUp}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
            setFieldValue,
          }) => (
            <View style={styles.form}>
              {/* User Type Picker */}
              <Text style={styles.label}>Sign Up as:</Text>
              <View style={styles.pickerContainer}>
                <RNPickerSelect
                  onValueChange={(value) => {
                    setFieldValue('userType', value);
                  }}
                  items={[
                    { label: 'Personal Account', value: 'Personal' },
                    { label: 'Organization', value: 'Organization' },
                  ]}
                  style={pickerSelectStyles}
                  placeholder={{
                    label: 'Select account type',
                    value: null,
                    color: '#9EA0A4',
                  }}
                  value={values.userType}
                  useNativeAndroidPickerStyle={false}
                />
                <ChevronIcon name="keyboard-arrow-down" size={24} color="#434242" style={styles.chevron} />
              </View>
              {errors.userType && touched.userType && <Text style={styles.errorText}>{errors.userType}</Text>}

              {/* Conditional Fields for Organization */}
              {values.userType === 'Organization' && (
                <>
                  {/* Organization Name */}
                  <View style={styles.inputContainer}>
                    <Icon name="office-building" size={24} color="#434242" />
                    <TextInput
                      style={styles.input}
                      placeholder="Organization Name"
                      onChangeText={handleChange('orgName')}
                      onBlur={handleBlur('orgName')}
                      value={values.orgName}
                      autoCapitalize="words"
                    />
                  </View>
                  {errors.orgName && touched.orgName && <Text style={styles.errorText}>{errors.orgName}</Text>}

                  {/* Registration Number */}
                  <View style={styles.inputContainer}>
                    <Icon name="file-document" size={24} color="#434242" />
                    <TextInput
                      style={styles.input}
                      placeholder="Registration Number"
                      onChangeText={handleChange('orgRegNumber')}
                      onBlur={handleBlur('orgRegNumber')}
                      value={values.orgRegNumber}
                      keyboardType="default"
                    />
                  </View>
                  {errors.orgRegNumber && touched.orgRegNumber && <Text style={styles.errorText}>{errors.orgRegNumber}</Text>}

                  {/* Organization Type */}
                  <View style={styles.inputContainer}>
                    <Icon name="format-list-bulleted" size={24} color="#434242" />
                    <TextInput
                      style={styles.input}
                      placeholder="Organization Type"
                      onChangeText={handleChange('orgType')}
                      onBlur={handleBlur('orgType')}
                      value={values.orgType}
                      autoCapitalize="words"
                    />
                  </View>
                  {errors.orgType && touched.orgType && <Text style={styles.errorText}>{errors.orgType}</Text>}

                  {/* Contact Name */}
                  <View style={styles.inputContainer}>
                    <Icon name="account" size={24} color="#434242" />
                    <TextInput
                      style={styles.input}
                      placeholder="Contact Name"
                      onChangeText={handleChange('contactName')}
                      onBlur={handleBlur('contactName')}
                      value={values.contactName}
                      autoCapitalize="words"
                    />
                  </View>
                  {errors.contactName && touched.contactName && <Text style={styles.errorText}>{errors.contactName}</Text>}

                  {/* Contact Position */}
                  <View style={styles.inputContainer}>
                    <Icon name="badge-account" size={24} color="#434242" />
                    <TextInput
                      style={styles.input}
                      placeholder="Contact Position"
                      onChangeText={handleChange('contactPosition')}
                      onBlur={handleBlur('contactPosition')}
                      value={values.contactPosition}
                      autoCapitalize="words"
                    />
                  </View>
                  {errors.contactPosition && touched.contactPosition && <Text style={styles.errorText}>{errors.contactPosition}</Text>}
                </>
              )}

              {/* Conditional Field for Personal Users */}
              {values.userType === 'Personal' && (
                <View style={styles.inputContainer}>
                  <Icon name="account" size={24} color="#434242" />
                  <TextInput
                    style={styles.input}
                    placeholder="Full Name"
                    onChangeText={handleChange('fullName')}
                    onBlur={handleBlur('fullName')}
                    value={values.fullName}
                    autoCapitalize="words"
                  />
                </View>
              )}
              {errors.fullName && touched.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}

              {/* Email Field */}
              <View style={styles.inputContainer}>
                <Icon name="email" size={24} color="#434242" />
                <TextInput
                  style={styles.input}
                  placeholder="Email Address"
                  keyboardType="email-address"
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
              {errors.email && touched.email && <Text style={styles.errorText}>{errors.email}</Text>}

              {/* Physical Address Field */}
              <View style={styles.inputContainer}>
                <Icon name="map-marker" size={24} color="#434242" />
                <TextInput
                  style={styles.input}
                  placeholder="Physical Address"
                  onChangeText={handleChange('physicalAddress')}
                  onBlur={handleBlur('physicalAddress')}
                  value={values.physicalAddress}
                  autoCapitalize="words"
                />
              </View>
              {errors.physicalAddress && touched.physicalAddress && <Text style={styles.errorText}>{errors.physicalAddress}</Text>}

              {/* Contact Details Field */}
              <View style={styles.inputContainer}>
                <Icon name="phone" size={24} color="#434242" />
                <TextInput
                  style={styles.input}
                  placeholder="Contact Details"
                  onChangeText={handleChange('contactDetails')}
                  onBlur={handleBlur('contactDetails')}
                  value={values.contactDetails}
                  keyboardType="phone-pad"
                />
              </View>
              {errors.contactDetails && touched.contactDetails && <Text style={styles.errorText}>{errors.contactDetails}</Text>}

              {/* Password Field */}
              <View style={styles.inputContainer}>
                <Icon name="lock" size={24} color="#434242" />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  secureTextEntry={!passwordVisible}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)} style={styles.eyeIcon}>
                  <Icon name={passwordVisible ? 'eye-off-outline' : 'eye-outline'} size={24} color="#434242" />
                </TouchableOpacity>
              </View>
              {errors.password && touched.password && <Text style={styles.errorText}>{errors.password}</Text>}

              {/* Submit Button */}
              <TouchableOpacity 
                style={[styles.button, isSubmitting && styles.buttonDisabled]} 
                onPress={handleSubmit} 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Sign Up</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </ScrollView>
    </>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: width * 0.05,  // Adjusts padding based on screen width
    backgroundColor: '#fff',
  },
  title: {
    fontSize: width * 0.09,  // Responsive font size
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 50,
    textAlign: 'center',
    marginVertical: height * 0.02,  // Margin based on screen height
  },
  form: {
    marginTop: height * 0.02,
  },
  label: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  pickerContainer: {
    position: 'relative',
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    marginBottom: height * 0.02,
    paddingRight: 30, // Ensure space for chevron
  },
  chevron: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{ translateY: -12 }], // Adjust based on chevron size
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    padding: 10,
    borderRadius: 8,
    marginBottom: height * 0.02,  // Responsive margin
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: width * 0.04,  // Responsive font size
  },
  button: {
    backgroundColor: '#102C57',
    paddingVertical: height * 0.02,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#7f8c8d',
  },
  buttonText: {
    fontSize: width * 0.06,  // Responsive button text
    color: '#fff',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: width * 0.03,  // Responsive error font size
    marginBottom: height * 0.02,
  },
});

const pickerSelectStyles = {
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    color: '#333',
    paddingRight: 30, // Ensure the text is never behind the chevron
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: '#333',
    paddingRight: 30, // Ensure the text is never behind the chevron
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
  },
};

export default Donor_Signup;
