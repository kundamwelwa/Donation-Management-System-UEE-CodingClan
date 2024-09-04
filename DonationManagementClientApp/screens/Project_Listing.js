import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Image,
  Alert,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  SafeAreaView
} from 'react-native';
import StatusBarManager from '../Component/StatusBarManager';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { FontAwesome } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const ProjectForm = ({
  onSubmit,
  coverImage,
  onImagePicker,
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
  setLocation
}) => {
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  return (
    <ScrollView
      contentContainerStyle={styles.formScroll}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.formContainer}>
        <TouchableOpacity onPress={onImagePicker} style={styles.imagePicker}>
          {coverImage ? (
            <Image source={coverImage} style={styles.coverImage} />
          ) : (
            <FontAwesome name="camera" size={30} color="#134B70" />
          )}
          <Text style={styles.imagePickerText}>Upload Cover Image</Text>
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="Project Name"
          value={projectName}
          onChangeText={setProjectName}
        />
        <TextInput
          style={styles.input}
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
        />
        <TextInput
          style={styles.input}
          placeholder="Project Type"
          value={projectType}
          onChangeText={setProjectType}
        />
        <TouchableOpacity onPress={() => setShowStartDatePicker(true)} style={styles.input}>
          <Text>{`Start Date: ${startDate.toDateString()}`}</Text>
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
        <TouchableOpacity onPress={() => setShowEndDatePicker(true)} style={styles.input}>
          <Text>{`End Date: ${endDate.toDateString()}`}</Text>
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
        <TextInput
          style={styles.input}
          placeholder="Location"
          value={location}
          onChangeText={setLocation}
        />

        <TouchableOpacity onPress={onSubmit} style={styles.submitButton}>
          <Text style={styles.submitButtonText}>Submit Project</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const ProjectListing = () => {
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [projectType, setProjectType] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [location, setLocation] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [projects, setProjects] = useState([]);

  const handleImagePicker = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setCoverImage({ uri: result.uri });
    }
  };

  const handleSubmit = () => {
    if (!projectName || !description || !projectType || !location) {
      Alert.alert('Error', 'Please fill in all the fields');
      return;
    }

    const newProject = {
      id: Math.random().toString(), // Unique ID for the project
      name: projectName,
      description,
      type: projectType,
      startDate: startDate.toISOString(), // Convert to ISO string for consistency
      endDate: endDate.toISOString(),     // Convert to ISO string for consistency
      location,
      coverImage,
    };

    setProjects([...projects, newProject]);
    setProjectName('');
    setDescription('');
    setProjectType('');
    setStartDate(new Date());
    setEndDate(new Date());
    setLocation('');
    setCoverImage(null);
  };

  const renderProject = ({ item }) => (
    <View style={styles.projectCard}>
      {item.coverImage && <Image source={item.coverImage} style={styles.coverImage} />}
      <Text style={styles.projectTitle}>{item.name}</Text>
      <Text style={styles.projectDetail}>Type: {item.type}</Text>
      <Text style={styles.projectDetail}>Start Date: {new Date(item.startDate).toDateString()}</Text>
      <Text style={styles.projectDetail}>End Date: {new Date(item.endDate).toDateString()}</Text>
      <Text style={styles.projectDetail}>Location: {item.location}</Text>
      <Text style={styles.projectDescription}>{item.description}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <FlatList
          ListHeaderComponent={() => (
            <ProjectForm
              onSubmit={handleSubmit}
              coverImage={coverImage}
              onImagePicker={handleImagePicker}
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
            />
          )}
          data={projects}
          renderItem={renderProject}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.projectListContainer}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEEEEE',
  },
  formScroll: {
    flexGrow: 1,
    padding: width * 0.04,
  },
  formContainer: {
    padding: width * 0.04,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: height * 0.02,
    backgroundColor: '#FFFFFF',
  },
  imagePicker: {
    alignItems: 'center',
    marginBottom: height * 0.02,
  },
  coverImage: {
    width: width * 0.9,
    height: height * 0.3,
    borderRadius: 10,
    marginBottom: height * 0.01,
  },
  imagePickerText: {
    marginTop: 5,
    color: '#2B3467',
  },
  submitButton: {
    backgroundColor: '#2B3467',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  projectListContainer: {
    padding: width * 0.04,
  },
  projectCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: width * 0.04,
    marginBottom: height * 0.02,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  projectTitle: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: height * 0.01,
  },
  projectDetail: {
    fontSize: width * 0.04,
    color: '#666',
  },
  projectDescription: {
    fontSize: width * 0.04,
    color: '#333',
    marginTop: height * 0.01,
  },
});

export default ProjectListing;
