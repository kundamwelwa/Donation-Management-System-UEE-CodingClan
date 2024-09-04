import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Alert,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  SafeAreaView
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

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
        <View style={styles.inputContainer}>
          <FontAwesome name="edit" size={20} color="#2B3467" />
          <TextInput
            style={styles.input}
            placeholder="Project Name"
            value={projectName}
            onChangeText={setProjectName}
          />
        </View>

        <View style={styles.inputContainer}>
          <MaterialIcons name="description" size={20} color="#2B3467" />
          <TextInput
            style={styles.input}
            placeholder="Description"
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

        <TouchableOpacity onPress={() => setShowStartDatePicker(true)} style={styles.inputContainer}>
          <FontAwesome name="calendar" size={20} color="#2B3467" />
          <Text style={styles.input}>{`Start Date: ${startDate.toDateString()}`}</Text>
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
          <Text style={styles.input}>{`End Date: ${endDate.toDateString()}`}</Text>
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
  const [projects, setProjects] = useState([]);

  const handleSubmit = () => {
    if (!projectName || !description || !projectType || !location) {
      Alert.alert('Error', 'Please fill in all the fields');
      return;
    }

    const newProject = {
      id: Math.random().toString(),
      name: projectName,
      description,
      type: projectType,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      location,
    };

    setProjects([...projects, newProject]);
    setProjectName('');
    setDescription('');
    setProjectType('');
    setStartDate(new Date());
    setEndDate(new Date());
    setLocation('');
  };

  const renderProject = ({ item }) => (
    <View style={styles.projectCard}>
      <Text style={styles.projectTitle}>{item.name}</Text>
      <Text style={styles.projectDetail}><FontAwesome name="list-alt" size={16} color="#2B3467" /> Type: {item.type}</Text>
      <Text style={styles.projectDetail}><FontAwesome name="calendar" size={16} color="#2B3467" /> Start Date: {new Date(item.startDate).toDateString()}</Text>
      <Text style={styles.projectDetail}><FontAwesome name="calendar-check-o" size={16} color="#2B3467" /> End Date: {new Date(item.endDate).toDateString()}</Text>
      <Text style={styles.projectDetail}><FontAwesome name="map-marker" size={16} color="#2B3467" /> Location: {item.location}</Text>
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 12,
    marginBottom: height * 0.02,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  submitButton: {
    backgroundColor: '#2B3467',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: height * 0.02,
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
    marginBottom: height * 0.005,
  },
  projectDescription: {
    fontSize: width * 0.04,
    color: '#333',
    marginTop: height * 0.01,
  },
});

export default ProjectListing;
