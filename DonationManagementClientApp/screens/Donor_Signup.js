import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { Formik } from 'formik';
import * as Yup from 'yup';

// Updated validation schema
const SignUpSchema = Yup.object().shape({
  userType: Yup.string().required(),
  fullName: Yup.lazy((value, { parent }) => {
    if (parent.userType === 'single') {
      return Yup.string().required('Full name is required');
    }
    return Yup.string().notRequired();
  }),
  orgName: Yup.lazy((value, { parent }) => {
    if (parent.userType === 'organization') {
      return Yup.string().required('Organization name is required');
    }
    return Yup.string().notRequired();
  }),
  orgRegNumber: Yup.lazy((value, { parent }) => {
    if (parent.userType === 'organization') {
      return Yup.string().required('Organization registration number is required');
    }
    return Yup.string().notRequired();
  }),
  orgType: Yup.lazy((value, { parent }) => {
    if (parent.userType === 'organization') {
      return Yup.string().required('Organization type is required');
    }
    return Yup.string().notRequired();
  }),
  website: Yup.lazy((value, { parent }) => {
    if (parent.userType === 'organization') {
      return Yup.string().url('Invalid URL').notRequired();
    }
    return Yup.string().notRequired();
  }),
  contactName: Yup.lazy((value, { parent }) => {
    if (parent.userType === 'organization') {
      return Yup.string().required('Contact person name is required');
    }
    return Yup.string().notRequired();
  }),
  contactPosition: Yup.lazy((value, { parent }) => {
    if (parent.userType === 'organization') {
      return Yup.string().required('Contact position is required');
    }
    return Yup.string().notRequired();
  }),
  email: Yup.string().email('Invalid email').required('Email is required'),
  physicalAddress: Yup.string().required('Physical address is required'),
  contactDetails: Yup.string().required('Contact details are required'),
});

const Donor_Signup = ({ navigation }) => {
  const [userType, setUserType] = useState('single');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Donor Sign-Up</Text>
      <Formik
        initialValues={{
          fullName: '',
          orgName: '',
          orgRegNumber: '',
          orgType: '',
          website: '',
          contactName: '',
          contactPosition: '',
          email: '',
          physicalAddress: '',
          contactDetails: '',
          userType: 'single',
        }}
        validationSchema={SignUpSchema}
        onSubmit={(values) => {
          // Handle sign-up here
          console.log(values);
          navigation.navigate('Donor_dashboard');
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
          <View style={styles.form}>
            <Text style={styles.label}>SignUp as:</Text>
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

            {userType === 'organization' && (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Enter Organization Name"
                  onChangeText={handleChange('orgName')}
                  onBlur={handleBlur('orgName')}
                  value={values.orgName}
                />
                {errors.orgName && touched.orgName ? (
                  <Text style={styles.errorText}>{errors.orgName}</Text>
                ) : null}

                <TextInput
                  style={styles.input}
                  placeholder="Enter Organization Registration Number"
                  onChangeText={handleChange('orgRegNumber')}
                  onBlur={handleBlur('orgRegNumber')}
                  value={values.orgRegNumber}
                />
                {errors.orgRegNumber && touched.orgRegNumber ? (
                  <Text style={styles.errorText}>{errors.orgRegNumber}</Text>
                ) : null}

                <RNPickerSelect
                  onValueChange={handleChange('orgType')}
                  items={[
                    { label: 'Non-Profit', value: 'non-profit' },
                    { label: 'Private', value: 'private' },
                    { label: 'Government', value: 'government' },
                  ]}
                  style={pickerSelectStyles}
                  value={values.orgType}
                  placeholder={{ label: 'Select Organization Type', value: null }}
                />
                {errors.orgType && touched.orgType ? (
                  <Text style={styles.errorText}>{errors.orgType}</Text>
                ) : null}

                <TextInput
                  style={styles.input}
                  placeholder="Enter Website URL (optional)"
                  onChangeText={handleChange('website')}
                  onBlur={handleBlur('website')}
                  value={values.website}
                />
                {errors.website && touched.website ? (
                  <Text style={styles.errorText}>{errors.website}</Text>
                ) : null}

                <TextInput
                  style={styles.input}
                  placeholder="Enter Point of Contact Name"
                  onChangeText={handleChange('contactName')}
                  onBlur={handleBlur('contactName')}
                  value={values.contactName}
                />
                {errors.contactName && touched.contactName ? (
                  <Text style={styles.errorText}>{errors.contactName}</Text>
                ) : null}

                <TextInput
                  style={styles.input}
                  placeholder="Enter Position in Organization"
                  onChangeText={handleChange('contactPosition')}
                  onBlur={handleBlur('contactPosition')}
                  value={values.contactPosition}
                />
                {errors.contactPosition && touched.contactPosition ? (
                  <Text style={styles.errorText}>{errors.contactPosition}</Text>
                ) : null}
              </>
            )}

            {userType === 'single' && (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Enter Your Full Name"
                  onChangeText={handleChange('fullName')}
                  onBlur={handleBlur('fullName')}
                  value={values.fullName}
                />
                {errors.fullName && touched.fullName ? (
                  <Text style={styles.errorText}>{errors.fullName}</Text>
                ) : null}
              </>
            )}

            <TextInput
              style={styles.input}
              placeholder="Email Address"
              keyboardType="email-address"
              autoCapitalize="none"
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
            />
            {errors.email && touched.email ? (
              <Text style={styles.errorText}>{errors.email}</Text>
            ) : null}

            <TextInput
              style={styles.input}
              placeholder="Physical Address"
              onChangeText={handleChange('physicalAddress')}
              onBlur={handleBlur('physicalAddress')}
              value={values.physicalAddress}
            />
            {errors.physicalAddress && touched.physicalAddress ? (
              <Text style={styles.errorText}>{errors.physicalAddress}</Text>
            ) : null}

            <TextInput
              style={styles.input}
              placeholder="Contact Details"
              keyboardType="phone-pad"
              onChangeText={handleChange('contactDetails')}
              onBlur={handleBlur('contactDetails')}
              value={values.contactDetails}
            />
            {errors.contactDetails && touched.contactDetails ? (
              <Text style={styles.errorText}>{errors.contactDetails}</Text>
            ) : null}

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>
    </ScrollView>
  );
};

// Updated styles with a more modern look
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5',
    paddingBottom: 40, // To give space when scrolling
  },
  title: {
    marginTop:30,
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#0056A0', // Stylish blue color
  },
  label: {
    paddingTop: 10,
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 10,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#0056A0', // Stylish blue color
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
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
    borderRadius: 50,
    color: '#333',
    paddingRight: 30,
    marginBottom: 10,
    backgroundColor: '#0056A0', // Blue background
    color: '#fff', // White text color
  },
  inputAndroid: {
    fontSize: 20,
    paddingHorizontal: 5,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: '#ddd',
    borderRadius: 50,
    color: '#333',
    paddingRight: 40,
    marginBottom: 10,
    backgroundColor: '#0056A0', // Blue background
    color: '#fff', // White text color
  },
});

export default Donor_Signup;
