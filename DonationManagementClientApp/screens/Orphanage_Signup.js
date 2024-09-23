import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, StatusBar, ActivityIndicator, Dimensions } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';

const { width, height } = Dimensions.get('window');

// Validation schema
const SignUpSchema = Yup.object().shape({
  orphanageName: Yup.string().required('Orphanage name is required'),
  regNumber: Yup.string().required('Registration number is required'),
  orgType: Yup.string().required('Type of orphanage is required'),
  contactName: Yup.string().required('Contact person name is required'),
  contactPosition: Yup.string().required('Contact position is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  physicalAddress: Yup.string().required('Physical address is required'),
  contactDetails: Yup.string().required('Contact details are required'),
  numberOfChildren: Yup.number()
    .positive('Number must be positive')
    .integer('Must be an integer')
    .required('Number of children is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters long')
    .required('Password is required'),
});

const Orphanage_Signup = ({ navigation }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignUp = async (values) => {
    setIsSubmitting(true);

    const hardcodedUrl = 'http://192.168.43.189:5001/api'; // Fallback URL
    const apiUrl = API_URL || hardcodedUrl;

    console.log('Using API URL:', apiUrl);
    console.log('Signup payload:', values);

    try {
      const response = await axios.post(`${apiUrl}/orphanages/Orphanagesignup`, values);
      console.log('Signup response:', response.data);

      if (response.data.message === 'Email is already registered') {
        Alert.alert('⚠️ User Exists', 'This email is already registered. Please log in.', [{ text: 'OK', onPress: () => setIsSubmitting(false) }], { cancelable: false });
      } else {
        await AsyncStorage.setItem('userName', values.contactName || values.orphanageName);
        Alert.alert('🎉 Success', 'Registration completed!', [{ text: 'OK', onPress: () => { setIsSubmitting(false); navigation.navigate('Orphanage_Dashboard'); } }]);
      }
    } catch (error) {
      console.error('Sign Up Error:', error.response ? error.response.data : error.message);
      let errorMessage = 'Failed to sign up. Please try again later.';
      if (error.response) {
        if (error.response.data.errors) {
          const errorDetails = error.response.data.errors.map(err => `${err.path}: ${err.msg}`).join('\n');
          errorMessage = `Validation Error(s):\n${errorDetails}`;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      }
      Alert.alert('Error', errorMessage);
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <StatusBar backgroundColor="#f9f9f9" barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Sign-Up</Text>
        <Formik
          initialValues={{
            orphanageName: '',
            regNumber: '',
            orgType: '',
            contactName: '',
            contactPosition: '',
            email: '',
            physicalAddress: '',
            contactDetails: '',
            numberOfChildren: '',
            password: '',
          }}
          validationSchema={SignUpSchema}
          onSubmit={(values) => {
            console.log('Formik Submit Triggered');
            handleSignUp(values);
          }}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <View style={styles.form}>
              {/* Orphanage Name */}
              <View style={styles.inputContainer}>
                <MaterialCommunityIcons name="human-capacity-increase" size={20} style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter Orphanage Name"
                  onChangeText={handleChange('orphanageName')}
                  onBlur={handleBlur('orphanageName')}
                  value={values.orphanageName}
                />
              </View>
              {errors.orphanageName && touched.orphanageName && <Text style={styles.errorText}>{errors.orphanageName}</Text>}

              {/* Registration Number */}
              <View style={styles.inputContainer}>
                <MaterialCommunityIcons name="file-document-edit" size={20} style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter Registration Number"
                  onChangeText={handleChange('regNumber')}
                  onBlur={handleBlur('regNumber')}
                  value={values.regNumber}
                />
              </View>
              {errors.regNumber && touched.regNumber && <Text style={styles.errorText}>{errors.regNumber}</Text>}

              {/* Type of Orphanage */}
              <View style={styles.inputContainer}>
                <MaterialCommunityIcons name="domain" size={20} style={styles.icon} />
                <RNPickerSelect
                  onValueChange={handleChange('orgType')}
                  items={[
                    { label: 'Non-Profit', value: 'non-profit' },
                    { label: 'Government', value: 'government' },
                    { label: 'Private', value: 'private' },
                  ]}
                  value={values.orgType}
                  useNativeAndroidPickerStyle={false}
                  Icon={() => <MaterialCommunityIcons name="chevron-down" size={20} color="#000" style={styles.PickerIcon} />}
                />
              </View>
              {errors.orgType && touched.orgType && <Text style={styles.errorText}>{errors.orgType}</Text>}

              {/* Contact Person Name */}
              <View style={styles.inputContainer}>
                <MaterialCommunityIcons name="account" size={20} style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter Contact Person Name"
                  onChangeText={handleChange('contactName')}
                  onBlur={handleBlur('contactName')}
                  value={values.contactName}
                />
              </View>
              {errors.contactName && touched.contactName && <Text style={styles.errorText}>{errors.contactName}</Text>}

              {/* Contact Position */}
              <View style={styles.inputContainer}>
                <MaterialCommunityIcons name="badge-account-horizontal" size={20} style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter Contact Position"
                  onChangeText={handleChange('contactPosition')}
                  onBlur={handleBlur('contactPosition')}
                  value={values.contactPosition}
                />
              </View>
              {errors.contactPosition && touched.contactPosition && <Text style={styles.errorText}>{errors.contactPosition}</Text>}

              {/* Email Address */}
              <View style={styles.inputContainer}>
                <MaterialCommunityIcons name="email" size={20} style={styles.icon} />
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
              {errors.email && touched.email && <Text style={styles.errorText}>{errors.email}</Text>}

              {/* Physical Address */}
              <View style={styles.inputContainer}>
                <MaterialCommunityIcons name="map-marker" size={20} style={styles.icon} />
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
                <MaterialCommunityIcons name="phone" size={20} style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Contact Details"
                  keyboardType="phone-pad"
                  onChangeText={handleChange('contactDetails')}
                  onBlur={handleBlur('contactDetails')}
                  value={values.contactDetails}
                />
              </View>
              {errors.contactDetails && touched.contactDetails && <Text style={styles.errorText}>{errors.contactDetails}</Text>}

              {/* Number of Children */}
              <View style={styles.inputContainer}>
                <MaterialCommunityIcons name="account-group" size={20} style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Number of Children"
                  keyboardType="numeric"
                  onChangeText={handleChange('numberOfChildren')}
                  onBlur={handleBlur('numberOfChildren')}
                  value={values.numberOfChildren}
                />
              </View>
              {errors.numberOfChildren && touched.numberOfChildren && <Text style={styles.errorText}>{errors.numberOfChildren}</Text>}

              {/* Password */}
              <View style={styles.inputContainer}>
                <MaterialCommunityIcons name="lock" size={20} style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  secureTextEntry={!showPassword}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons name={showPassword ? 'eye' : 'eye-off'} size={20} />
                </TouchableOpacity>
              </View>
              {errors.password && touched.password && <Text style={styles.errorText}>{errors.password}</Text>}

              {/* Submit Button */}
              <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.buttonText}>Sign Up</Text>}
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </ScrollView>
    </>
  );
};


const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: width * 0.05,  // Adjusts padding based on screen width
    backgroundColor: '#fff',
  },
  title: {
    marginVertical: height * 0.08,
    fontSize: width * 0.09,  // Responsive font size
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 40,
    textAlign: 'center',
    marginVertical: height * 0.02,  // Mar
  },
  form: {
    marginTop: height * 0.02,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    padding: 15,
    borderRadius: 12,
    marginBottom: height * 0.02,  // Responsive margin
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: width * 0.04,  // Responsive font size
  },
  icon: {
    paddingHorizontal: 10,
    color: '#434242',
  },

  PickerIcon: {
    marginHorizontal: width * -0.09,
  },
  button: {
    backgroundColor: '#102C57',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    fontSize: width * 0.06,  // Responsive button text
    color: '#fff',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    color: '#333',
    paddingRight: 30,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: '#ddd',
    borderRadius: 10,
    color: '#333',
    paddingHorizontal: width * 0.3,
    marginBottom: 4,
    backgroundColor: '#f1f1f1',
  },
});

export default Orphanage_Signup;
