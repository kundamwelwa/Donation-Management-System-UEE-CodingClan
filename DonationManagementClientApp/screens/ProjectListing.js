import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Dimensions,
  Alert,
  Platform,
  Image,
  ActivityIndicator,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';

const { width, height } = Dimensions.get('window');
const scale = size => (width / 375) * size;
const scaleHeight = size => (height / 667) * size;

const ProjectListing = ({ navigation }) => {
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [projectType, setProjectType] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [projectedAmount, setProjectedAmount] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [imageName, setImageName] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const handleImagePick = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Please grant permission to access the image library.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets?.length > 0) {
        setImageUri(result.assets[0].uri);
        setImageName(result.assets[0].fileName || 'uploaded-image');
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const handleSubmit = async () => {
    if (!projectName || !description || !projectType || !location || !category || !projectedAmount) {
      Alert.alert('Error', 'Please fill in all fields and upload an image.');
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'You are not logged in. Please log in again.');
        navigation.navigate('Donor_Login');
        return;
      }

      if (!API_URL) {
        console.error('API_URL is not defined. Check your .env file.');
        throw new Error('API_URL is missing.');
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      };

      const formData = new FormData();
      formData.append('projectName', projectName);
      formData.append('description', description);
      formData.append('projectType', projectType);
      formData.append('category', category);
      formData.append('projectedAmount', projectedAmount);
      formData.append('startDate', startDate.toISOString());
      formData.append('endDate', endDate.toISOString());
      formData.append('location', location);

      if (imageUri) {
        const type = imageUri.split('.').pop();
        formData.append('image', {
          uri: imageUri,
          name: imageName || `image.${type}`,
          type: `image/${type === 'jpg' ? 'jpeg' : type}`,
        });
      }

      console.log('Using API_URL:', API_URL);

      const response = await axios.post(`${API_URL}/projects/createProject`, formData, {
        headers,
        timeout: 10000,
      });

      if (response.status === 200 || response.status === 201) {
        Alert.alert('Success', 'Project created successfully!');
        resetForm();
      } else {
        console.warn('Unexpected response status:', response.status);
        Alert.alert('Warning', 'Project created, but response status not as expected.');
      }
    } catch (error) {
      console.error('Error creating project:', error);
      const errorMessage =
        error.response?.data?.message || 'Failed to create project. Please check your network and try again.';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setProjectName('');
    setDescription('');
    setProjectType('');
    setCategory('');
    setProjectedAmount('');
    setLocation('');
    setImageUri(null);
    setImageName(null);
    setStartDate(new Date());
    setEndDate(new Date());
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      <Text style={styles.heading}>Create New Project</Text>

      <View style={styles.inputContainer}>
        <FontAwesome name="edit" size={20} color="#2B3467" />
        <TextInput
          style={styles.input}
          placeholder="Project Name"
          value={projectName}
          onChangeText={setProjectName}
        />
      </View>

      <View style={[styles.inputContainer, { height: 120 }]}>
        <TextInput
          style={[styles.input, { textAlignVertical: 'top', height: 100 }]}
          placeholder="Description"
          multiline
          value={description}
          onChangeText={setDescription}
        />
      </View>

      <View style={styles.inputContainer}>
        <FontAwesome name="list-alt" size={20} color="#2B3467" />
        <TextInput
          style={styles.input}
          placeholder="Project Type"
          value={projectType}
          onChangeText={setProjectType}
        />
      </View>

      <View style={styles.inputContainer}>
        <FontAwesome name="tags" size={20} color="#2B3467" />
        <TextInput
          style={styles.input}
          placeholder="Category"
          value={category}
          onChangeText={setCategory}
        />
      </View>

      <View style={styles.inputContainer}>
        <FontAwesome name="money" size={20} color="#2B3467" />
        <TextInput
          style={styles.input}
          placeholder="Projected Amount"
          keyboardType="numeric"
          value={projectedAmount}
          onChangeText={setProjectedAmount}
        />
      </View>

      <TouchableOpacity onPress={handleImagePick} style={styles.uploadButton}>
        <Ionicons name="camera" size={20} color="#2B3467" />
        <Text style={styles.uploadButtonText}>{imageUri ? 'Change Image' : 'Upload Image'}</Text>
      </TouchableOpacity>

      {imageUri && <Image source={{ uri: imageUri }} style={styles.imagePreview} />}

      <TouchableOpacity onPress={() => setShowStartDatePicker(true)} style={styles.inputContainer}>
        <FontAwesome name="calendar" size={20} color="#2B3467" />
        <Text style={styles.input}>Start Date: {startDate.toDateString()}</Text>
      </TouchableOpacity>
      {showStartDatePicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, date) => {
            setShowStartDatePicker(false);
            if (date) setStartDate(date);
          }}
        />
      )}

      <TouchableOpacity onPress={() => setShowEndDatePicker(true)} style={styles.inputContainer}>
        <FontAwesome name="calendar-check-o" size={20} color="#2B3467" />
        <Text style={styles.input}>End Date: {endDate.toDateString()}</Text>
      </TouchableOpacity>
      {showEndDatePicker && (
        <DateTimePicker
          value={endDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, date) => {
            setShowEndDatePicker(false);
            if (date) setEndDate(date);
          }}
        />
      )}

      <View style={styles.inputContainer}>
        <FontAwesome name="map-marker" size={20} color="#2B3467" />
        <TextInput
          style={styles.input}
          placeholder="Location"
          value={location}
          onChangeText={setLocation}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#2B3467" style={styles.loadingIndicator} />
      ) : (
        <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom: scaleHeight(70), // Adds extra padding at the bottom
    padding: scale(16),
    backgroundColor: '#f8f9fa',
  },

  heading: {
    paddingTop: scale(30),
    textAlign: 'center',
    fontSize: scale(30), // Scaled font size
    fontWeight: 'bold',
    color: '#2B3467',
    marginBottom: scaleHeight(24), // Scaled margin bottom
  },

  formContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: scale(20), // Scaled padding
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scaleHeight(2) }, // Scaled shadow
    shadowOpacity: 0.1,
    shadowRadius: scale(8),
    elevation: 3,
    marginVertical: scaleHeight(16), // Scaled margin vertical
  },
  
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E6E6E6',
    borderRadius: 8,
    paddingHorizontal: scale(12), // Scaled padding
    paddingVertical: scaleHeight(12),
    marginVertical: scaleHeight(8), // Scaled margin vertical
    backgroundColor: '#F9F9F9',
  },

  input: {
    flex: 1,
    marginLeft: scale(8), // Scaled margin left
    fontSize: scale(18), // Scaled font size
    color: '#333',
  },

  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#2B3467',
    borderWidth: 1,
    borderRadius: 8,
    padding: scaleHeight(16), // Scaled padding
    marginVertical: scaleHeight(8), // Scaled margin vertical
    justifyContent: 'center',
  },

  projectProjectedAmount: {
    fontSize: scale(18), // Scaled font size
    color: '#555',
    marginTop: scaleHeight(8), // Scaled margin top
  },
  
  uploadButtonText: {
    marginLeft: scale(8), // Scaled margin left
    color: '#2B3467',
    fontSize: scale(18), // Scaled font size
    fontWeight: '500',
  },

  imagePreview: {
    width: scale(360), // Scaled width
    height: scaleHeight(200), // Scaled height
    borderRadius: 10,
    marginBottom: scaleHeight(16), // Scaled margin bottom
  },

  loadingIndicator: {
    marginVertical: scaleHeight(40), // Scaled margin vertical
  },

  submitButton: {
    backgroundColor: '#2B3467',
    borderRadius: 8,
    paddingVertical: scaleHeight(16), // Scaled padding
    alignItems: 'center',
    marginTop: scaleHeight(16), // Scaled margin top
  },

  submitButtonText: {
    color: '#FFF',
    fontSize: scale(18), // Scaled font size
    fontWeight: '600',
  },

  formScroll: {
    paddingBottom: scaleHeight(16), // Scaled padding bottom
  },

  projectCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: scale(20), // Scaled padding
    marginVertical: scaleHeight(8), // Scaled margin vertical
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scaleHeight(2) }, // Scaled shadow
    shadowOpacity: 0.1,
    shadowRadius: scale(8),
    elevation: 3,
  },

  projectImage: {
    width: '100%',
    height: scaleHeight(160), // Scaled height
    borderRadius: 8,
  },

  projectTitle: {
    fontSize: scale(20), // Scaled font size
    fontWeight: 'bold',
    color: '#2B3467',
    marginVertical: scaleHeight(8), // Scaled margin vertical
  },

  projectDetail: {
    fontSize: scale(16), // Scaled font size
    color: '#666',
    marginVertical: scaleHeight(4), // Scaled margin vertical
  },

  projectDescription: {
    fontSize: scale(16), // Scaled font size
    color: '#333',
    marginTop: scaleHeight(8), // Scaled margin top
  },
});


export default ProjectListing;