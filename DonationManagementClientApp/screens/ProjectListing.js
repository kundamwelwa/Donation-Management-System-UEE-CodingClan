import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  StatusBar,
  Dimensions,
  Alert,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  SafeAreaView,
  Image,
  ActivityIndicator,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { FontAwesome, MaterialIcons, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';

const { width, height } = Dimensions.get('window');

// Project Form Component
const ProjectForm = ({
  onSubmit,
  projectName,
  setProjectName,
  description,
  setDescription,
  projectType,
  setProjectType,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  location,
  setLocation,
  category,
  setCategory,
  imageUri,
  setImageUri,
  loading,
}) => {
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'You need to grant permission to access the image library.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImageUri(result.uri);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.formScroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
      <View style={styles.formContainer}>
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

        <TouchableOpacity onPress={pickImage} style={styles.uploadButton}>
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
          <TouchableOpacity onPress={onSubmit} style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Post Project</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

// Project Listing Component
const ProjectListing = () => {
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [projectType, setProjectType] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);

  const handleSubmit = async () => {
    if (!projectName || !description || !projectType || !location || !category || !imageUri) {
      Alert.alert('Error', 'Please fill in all the fields and upload an image');
      return;
    }

    setLoading(true);

    const token = await AsyncStorage.getItem('token');
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    };

    const formData = new FormData();
    formData.append('name', projectName);
    formData.append('description', description);
    formData.append('type', projectType);
    formData.append('startDate', startDate.toISOString());
    formData.append('endDate', endDate.toISOString());
    formData.append('location', location);
    formData.append('category', category);

    const type = imageUri.split('.').pop();
    if (type && (type === 'jpg' || type === 'jpeg' || type === 'png')) {
      formData.append('image', {
        uri: imageUri,
        name: `project_image.${type}`,
        type: `image/${type === 'jpg' ? 'jpeg' : type}`,
      });
    }

    try {
      const apiUrl = API_URL || 'http://192.168.224.200:5001/api';
      const response = await axios.post(`${apiUrl}/projects/create`, formData, { headers });
      Alert.alert('Success', 'Project created successfully!');
      resetForm();
    } catch (error) {
      console.error('Error creating project:', error);
      if (error.response && error.response.data && error.response.data.message) {
        Alert.alert('Error', error.response.data.message);
      } else {
        Alert.alert('Error', 'Failed to create project. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setProjectName('');
    setDescription('');
    setProjectType('');
    setStartDate(new Date());
    setEndDate(new Date());
    setLocation('');
    setCategory('');
    setImageUri(null);
  };

  const renderProject = ({ item }) => (
    <View style={styles.projectCard}>
      {item.imageUri && <Image source={{ uri: item.imageUri }} style={styles.projectImage} />}
      <Text style={styles.projectTitle}>{item.name}</Text>
      <Text style={styles.projectDetail}><FontAwesome name="list-alt" size={16} color="#2B3467" /> Type: {item.type}</Text>
      <Text style={styles.projectDetail}><FontAwesome name="calendar" size={16} color="#2B3467" /> Start Date: {new Date(item.startDate).toDateString()}</Text>
      <Text style={styles.projectDetail}><FontAwesome name="calendar-check-o" size={16} color="#2B3467" /> End Date: {new Date(item.endDate).toDateString()}</Text>
      <Text style={styles.projectDetail}><FontAwesome name="map-marker" size={16} color="#2B3467" /> Location: {item.location}</Text>
      <Text style={styles.projectDetail}><FontAwesome name="tags" size={16} color="#2B3467" /> Category: {item.category}</Text>
      <Text style={styles.projectDetail}><MaterialIcons name="description" size={16} color="#2B3467" /> Description: {item.description}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ProjectForm
        onSubmit={handleSubmit}
        projectName={projectName}
        setProjectName={setProjectName}
        description={description}
        setDescription={setDescription}
        projectType={projectType}
        setProjectType={setProjectType}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        location={location}
        setLocation={setLocation}
        category={category}
        setCategory={setCategory}
        imageUri={imageUri}
        setImageUri={setImageUri}
        loading={loading}
      />

      <FlatList
        data={projects}
        renderItem={renderProject}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.projectList}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f7f8fa',
    paddingHorizontal: 10,
  },

  heading: {
    alignItems: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2B3467',
    marginBottom: 20,
  },

  formContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginVertical: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E6E6E6',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginVertical: 8,
    backgroundColor: '#F9F9F9',
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#2B3467',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginVertical: 10,
    justifyContent: 'center',
  },
  uploadButtonText: {
    marginLeft: 10,
    color: '#2B3467',
    fontSize: 16,
    fontWeight: '500',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginVertical: 10,
  },
  submitButton: {
    backgroundColor: '#2B3467',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 15,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  formScroll: {
    paddingBottom: 20,
  },
  projectCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  projectImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
  },
  projectTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2B3467',
    marginVertical: 8,
  },
  projectDetail: {
    fontSize: 14,
    color: '#666',
    marginVertical: 2,
  },
  projectDescription: {
    fontSize: 14,
    color: '#333',
    marginTop: 10,
  },
});

export default ProjectListing;