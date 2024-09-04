import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import StatusBarManager from '../Component/StatusBarManager';
import { Formik } from 'formik';
import * as Yup from 'yup';

const SignUpSchema = Yup.object().shape({
  orphanageName: Yup.string().required('Orphanage name is required'),
  regNumber: Yup.string().required('Registration number is required'),
  orgType: Yup.string().required('Type of orphanage is required'),
  website: Yup.string().url('Invalid URL').notRequired(),
  contactName: Yup.string().required('Contact person name is required'),
  contactPosition: Yup.string().required('Contact position is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  physicalAddress: Yup.string().required('Physical address is required'),
  contactDetails: Yup.string().required('Contact details are required'),
  missionStatement: Yup.string().required('Mission statement is required'),
  numberOfChildren: Yup.number().positive('Number must be positive').required('Number of children is required'),
  fundingSources: Yup.string().notRequired(),
  additionalNotes: Yup.string().notRequired(),
});

const Orphanage_Signup = ({ navigation }) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Sign-Up</Text>
      <Formik
        initialValues={{
          orphanageName: '',
          regNumber: '',
          orgType: '',
          website: '',
          contactName: '',
          contactPosition: '',
          email: '',
          physicalAddress: '',
          contactDetails: '',
          missionStatement: '',
          numberOfChildren: '',
          fundingSources: '',
          additionalNotes: '',
        }}
        validationSchema={SignUpSchema}
        onSubmit={(values) => {
          // Handle sign-up here
          console.log(values);
          // Navigate to Dashboard
          navigation.navigate('Orphanage_Dashboard');
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View style={styles.form}>
            {/* Input fields */}
            <TextInput
              style={styles.input}
              placeholder="Enter Orphanage Name"
              onChangeText={handleChange('orphanageName')}
              onBlur={handleBlur('orphanageName')}
              value={values.orphanageName}
            />
            {errors.orphanageName && touched.orphanageName ? (
              <Text style={styles.errorText}>{errors.orphanageName}</Text>
            ) : null}

            <TextInput
              style={styles.input}
              placeholder="Enter Registration Number"
              onChangeText={handleChange('regNumber')}
              onBlur={handleBlur('regNumber')}
              value={values.regNumber}
            />
            {errors.regNumber && touched.regNumber ? (
              <Text style={styles.errorText}>{errors.regNumber}</Text>
            ) : null}

            <RNPickerSelect
              onValueChange={handleChange('orgType')}
              items={[
                { label: 'Non-Profit', value: 'non-profit' },
                { label: 'Government', value: 'government' },
                { label: 'Private', value: 'private' },
              ]}
              style={pickerSelectStyles}
              value={values.orgType}
              placeholder={{ label: 'Select Type of Orphanage', value: null }}
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
              placeholder="Enter Contact Person Name"
              onChangeText={handleChange('contactName')}
              onBlur={handleBlur('contactName')}
              value={values.contactName}
            />
            {errors.contactName && touched.contactName ? (
              <Text style={styles.errorText}>{errors.contactName}</Text>
            ) : null}

            <TextInput
              style={styles.input}
              placeholder="Enter Contact Position"
              onChangeText={handleChange('contactPosition')}
              onBlur={handleBlur('contactPosition')}
              value={values.contactPosition}
            />
            {errors.contactPosition && touched.contactPosition ? (
              <Text style={styles.errorText}>{errors.contactPosition}</Text>
            ) : null}

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

            <TextInput
              style={styles.input}
              placeholder="Mission Statement"
              onChangeText={handleChange('missionStatement')}
              onBlur={handleBlur('missionStatement')}
              value={values.missionStatement}
            />
            {errors.missionStatement && touched.missionStatement ? (
              <Text style={styles.errorText}>{errors.missionStatement}</Text>
            ) : null}

            <TextInput
              style={styles.input}
              placeholder="Number of Children"
              keyboardType="numeric"
              onChangeText={handleChange('numberOfChildren')}
              onBlur={handleBlur('numberOfChildren')}
              value={values.numberOfChildren}
            />
            {errors.numberOfChildren && touched.numberOfChildren ? (
              <Text style={styles.errorText}>{errors.numberOfChildren}</Text>
            ) : null}

            <TextInput
              style={styles.input}
              placeholder="Funding Sources (optional)"
              onChangeText={handleChange('fundingSources')}
              onBlur={handleBlur('fundingSources')}
              value={values.fundingSources}
            />

            <TextInput
              style={styles.input}
              placeholder="Additional Notes (optional)"
              onChangeText={handleChange('additionalNotes')}
              onBlur={handleBlur('additionalNotes')}
              value={values.additionalNotes}
            />

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5',
    paddingBottom: 40,
  },
  title: {
    fontSize: 40,
    paddingTop: 50,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 50,
    color: '#0056A0',
  },
  form: {
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#0056A0',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
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
    backgroundColor: '#0056A0',
    color: '#fff',
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: '#ddd',
    borderRadius: 10,
    color: '#333',
    paddingRight: 30,
    marginBottom: 10,
    backgroundColor: '#0056A0',
    color: '#fff',
  },
});

export default Orphanage_Signup;
