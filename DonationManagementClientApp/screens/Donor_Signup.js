import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator, StatusBar, Dimensions } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons'; // For showing password icons
import { AntDesign, MaterialIcons, Feather } from '@expo/vector-icons'; // For input icons
import { Config } from 'react-native-config'; // Import as default import

const { width, height } = Dimensions.get('window'); // Get screen dimensions

// Simplified validation schema
const SignUpSchema = Yup.object({
  userType: Yup.string().required('User type is required'),
  fullName: Yup.string(),
  orgName: Yup.string(),
  orgRegNumber: Yup.string(),
  orgType: Yup.string(),
  email: Yup.string().email('Invalid email').required('Email is required'),
  physicalAddress: Yup.string().required('Physical address is required'),
  contactDetails: Yup.string().required('Contact details are required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters long').required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

const Donor_Signup = ({ navigation }) => {
  const [userType, setUserType] = useState('single');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignUp = async (values) => {
  setIsSubmitting(true); // Show loading spinner
  try {
    const response = await axios.post(`${Config.API_URL}/auth/signup`, values);
    console.log('Response:', response.data); // Log response data

    // Check for user already registered
    if (response.data.message === 'User already registered') {
      Alert.alert(
        '⚠️ User Exists',
        'This email is already registered. Please log in.',
        [
          {
            text: 'OK',
            onPress: () => setIsSubmitting(false),
          },
        ],
        { cancelable: false }
      );
    } else {
      // Show success notification with badge
      Alert.alert('🎉 Success', 'Registration completed!', [
        {
          text: 'OK',
          onPress: () => {
            setIsSubmitting(false);
            navigation.navigate('Donor_Login');
          },
        },
      ]);
    }
  } catch (error) {
    console.error('Sign Up Error:', error.response ? error.response.data : error.message); // Log error details
    setIsSubmitting(false);
    Alert.alert('Error', 'Failed to sign up. Please try again later.');
  }
};


  return (
    <>
      <StatusBar backgroundColor="#f9f9f9" barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Create An Account</Text>
        <Formik
          initialValues={{
            fullName: '',
            orgName: '',
            orgRegNumber: '',
            orgType: '',
            email: '',
            physicalAddress: '',
            contactDetails: '',
            password: '',
            confirmPassword: '',
            userType: 'single',
          }}
          validationSchema={SignUpSchema}
          onSubmit={handleSignUp}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
            <View style={styles.form}>
              <Text style={styles.label}>Sign Up as:</Text>
              <RNPickerSelect
                onValueChange={(value) => {
                  setUserType(value);
                  setFieldValue('userType', value);
                }}
                items={[
                  { label: 'Personal Account', value: 'single' },
                  { label: 'Organization Account', value: 'organization' },
                ]}
                style={pickerSelectStyles}
                value={userType}
              />

              {/* Organization Fields */}
              {userType === 'organization' && (
                <>
                  <View style={styles.inputContainer}>
                    <MaterialIcons name="business" size={24} color='#434242' />
                    <TextInput
                      style={styles.input}
                      placeholder="Organization Name"
                      onChangeText={handleChange('orgName')}
                      onBlur={handleBlur('orgName')}
                      value={values.orgName}
                    />
                  </View>
                  {errors.orgName && touched.orgName && <Text style={styles.errorText}>{errors.orgName}</Text>}
                  
                  <View style={styles.inputContainer}>
                    <Feather name="file-text" size={24} color='#434242' />
                    <TextInput
                      style={styles.input}
                      placeholder="Registration Number"
                      onChangeText={handleChange('orgRegNumber')}
                      onBlur={handleBlur('orgRegNumber')}
                      value={values.orgRegNumber}
                    />
                  </View>
                  {errors.orgRegNumber && touched.orgRegNumber && <Text style={styles.errorText}>{errors.orgRegNumber}</Text>}
                  
                  <View style={styles.inputContainer}>
                    <MaterialIcons name="category" size={24} color='#434242' />
                    <TextInput
                      style={styles.input}
                      placeholder="Organization Type"
                      onChangeText={handleChange('orgType')}
                      onBlur={handleBlur('orgType')}
                      value={values.orgType}
                    />
                  </View>
                  {errors.orgType && touched.orgType && <Text style={styles.errorText}>{errors.orgType}</Text>}
                </>
              )}

              {/* Full Name for Single User */}
              {userType === 'single' && (
                <View style={styles.inputContainer}>
                  <AntDesign name="user" size={24} color='#434242' />
                  <TextInput
                    style={styles.input}
                    placeholder="Full Name"
                    onChangeText={handleChange('fullName')}
                    onBlur={handleBlur('fullName')}
                    value={values.fullName}
                  />
                </View>
              )}
              {errors.fullName && touched.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}

              {/* Email Field */}
              <View style={styles.inputContainer}>
                <MaterialIcons name="email" size={24} color='#434242' />
                <TextInput
                  style={styles.input}
                  placeholder="Email Address"
                  keyboardType="email-address"
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                />
              </View>
              {errors.email && touched.email && <Text style={styles.errorText}>{errors.email}</Text>}

              {/* Address Field */}
              <View style={styles.inputContainer}>
                <Feather name="map-pin" size={24} color='#434242' />
                <TextInput
                  style={styles.input}
                  placeholder="Physical Address"
                  onChangeText={handleChange('physicalAddress')}
                  onBlur={handleBlur('physicalAddress')}
                  value={values.physicalAddress}
                />
              </View>
              {errors.physicalAddress && touched.physicalAddress && <Text style={styles.errorText}>{errors.physicalAddress}</Text>}

              {/* Contact Details */}
              <View style={styles.inputContainer}>
                <Feather name="phone" size={24} color='#434242' />
                <TextInput
                  style={styles.input}
                  placeholder="Contact Details"
                  onChangeText={handleChange('contactDetails')}
                  onBlur={handleBlur('contactDetails')}
                  value={values.contactDetails}
                  keyboardType="numeric"  // Restricts the keyboard to only numbers
                />
              </View>

              {/* Password Field */}
              <View style={styles.inputContainer}>
                <Feather name="lock" size={24} color='#434242' />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  secureTextEntry={!showPassword}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons name={showPassword ? 'eye' : 'eye-off'} size={24} color="#000" />
                </TouchableOpacity>
              </View>
              {errors.password && touched.password && <Text style={styles.errorText}>{errors.password}</Text>}

              {/* Confirm Password Field */}
              <View style={styles.inputContainer}>
                <Feather name="lock" size={24} color='#434242' />
                <TextInput
                  style={styles.input}
                  placeholder="Confirm Password"
                  secureTextEntry={!showConfirmPassword}
                  onChangeText={handleChange('confirmPassword')}
                  onBlur={handleBlur('confirmPassword')}
                  value={values.confirmPassword}
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <Ionicons name={showConfirmPassword ? 'eye' : 'eye-off'} size={24} color="#000" />
                </TouchableOpacity>
              </View>
              {errors.confirmPassword && touched.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}

              {/* Submit Button */}
              <TouchableOpacity
                style={[styles.submitButton, isSubmitting && styles.disabledButton]}
                onPress={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.submitButtonText}>Sign Up</Text>}
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
    fontWeight: '600',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
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
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    padding: 10,
    borderRadius: 8,
    marginBottom: height * 0.02,
  },

  eyeIcon: {
    padding: 10,
    color: '#434242',
  },
  submitButton: {
    backgroundColor: '#102C57',
    paddingVertical: height * 0.02,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonText: {
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

// Custom picker style for RNPickerSelect
const pickerSelectStyles = {
  inputIOS: {
    fontSize: width * 0.04,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // To ensure the text is not cut off
    marginBottom: 20,
  },
  inputAndroid: {
    fontSize: width * 0.04,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // To ensure the text is not cut off
    marginBottom: 20,
  },
};

export default Donor_Signup;
