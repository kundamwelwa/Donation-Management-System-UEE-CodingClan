import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Dimensions,
  SafeAreaView,
  Image,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';

const { width, height } = Dimensions.get('window');
const scale = size => (width / 375) * size; // Adjust the base width as needed
const scaleHeight = size => (height / 667) * size; // Adjust the base height as needed

const Campaigns = () => {
  const [campaignName, setCampaignName] = useState('');
  const [description, setDescription] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [category, setCategory] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [location, setLocation] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [imageName, setImageName] = useState(null);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

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

      if (result && !result.canceled && result.assets && result.assets.length > 0) {
        const selectedAsset = result.assets[0];
        setImageUri(selectedAsset.uri);
        setImageName(selectedAsset.uri.split('/').pop());
      } else {
        console.log('Image picker canceled or no asset returned.');
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const handleSubmit = async () => {
    if (!campaignName || !description || !targetAmount || !location || !category) {
      Alert.alert('Error', 'Please fill in all the fields');
      return;
    }
  
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      };
  
      const formData = new FormData();
      formData.append('name', campaignName);
      formData.append('description', description);
      formData.append('targetAmount', targetAmount);
      formData.append('category', category);
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
  
      const apiUrl = API_URL || 'http://192.168.179.200:5001/api';
      const response = await axios.post(`${apiUrl}/campaigns/create`, formData, { headers, timeout: 10000 });
  
      if (response.status === 200 || response.status === 201) {
        Alert.alert('Success', 'Campaign created successfully!');
        resetForm();
      } else {
        Alert.alert('Warning', 'Campaign created, but response status not as expected.');
      }
    } catch (error) {
      console.error('Error creating campaign:', error);
      if (error.response && error.response.data) {
        console.error('Response data:', error.response.data);
        Alert.alert('Error', error.response.data.message || 'Failed to create campaign.');
      } else if (error.code === 'ECONNABORTED') {
        Alert.alert('Error', 'Request timed out. Please try again.');
      } else {
        Alert.alert('Error', 'Failed to create campaign. Please check your network and try again.');
      }
    } finally {
      setLoading(false);
    }
  };
  

  const resetForm = () => {
    setCampaignName('');
    setDescription('');
    setTargetAmount('');
    setCategory('');
    setLocation('');
    setImageUri(null);
    setImageName(null);
    setStartDate(new Date());
    setEndDate(new Date());
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.heading}>Create New Campaign</Text>

        <View style={styles.inputContainer}>
          <Icon name="bullhorn" size={20} color="#555" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Campaign Title"
            value={campaignName}
            onChangeText={setCampaignName}
          />
        </View>

        <TextInput
          style={[styles.inputContainer, { height: 100 }]}
          placeholder="Description"
          multiline
          value={description}
          onChangeText={setDescription}
        />

        <TextInput
          style={styles.inputContainer}
          placeholder="Target Amount"
          keyboardType="numeric"
          value={targetAmount}
          onChangeText={setTargetAmount}
        />

        <TextInput
          style={styles.inputContainer}
          placeholder="Category"
          value={category}
          onChangeText={setCategory}
        />

        <TouchableOpacity onPress={() => setShowStartDatePicker(true)} style={styles.datePicker}>
          <Icon name="calendar" size={20} color="#555" />
          <Text style={styles.dateText}>Start Date: {startDate.toDateString()}</Text>
        </TouchableOpacity>
        {showStartDatePicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display="default"
            onChange={(event, date) => {
              setShowStartDatePicker(false);
              if (date) setStartDate(date);
            }}
          />
        )}

        <TouchableOpacity onPress={() => setShowEndDatePicker(true)} style={styles.datePicker}>
          <Icon name="calendar" size={20} color="#555" />
          <Text style={styles.dateText}>End Date: {endDate.toDateString()}</Text>
        </TouchableOpacity>
        {showEndDatePicker && (
          <DateTimePicker
            value={endDate}
            mode="date"
            display="default"
            onChange={(event, date) => {
              setShowEndDatePicker(false);
              if (date) setEndDate(date);
            }}
          />
        )}

        <TextInput
          style={styles.inputContainer}
          placeholder="Location"
          value={location}
          onChangeText={setLocation}
        />

        <TouchableOpacity onPress={handleImagePick} style={styles.uploadButton}>
          <Icon name="camera" size={20} color="#555" />
          <Text style={styles.uploadText}>{imageUri ? 'Change Image' : 'Upload Image'}</Text>
        </TouchableOpacity>
        {imageUri && (
          <Image source={{ uri: imageUri }} style={styles.imagePreview} />
        )}

        {loading ? (
          <ActivityIndicator size="large" color="#2B3467" style={styles.loadingIndicator} />
        ) : (
          <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Post Campaign</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    marginTop: scale(20),
  },
  scrollContainer: {
    padding: scale(20),
  },
  heading: {
    fontSize: scale(30),
    fontWeight: 'bold',
    
    color: '#333',
    marginBottom: scale(30),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: scale(10),
    borderRadius: scale(8),
    marginVertical: scale(10),
    borderWidth: 1,
    borderColor: '#ddd',
  },
  icon: {
    marginRight: scale(10),
  },
  input: {
    flex: 1,
    fontSize: scale(16),
  },
  datePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: scale(15),
    backgroundColor: '#ffffff',
    borderRadius: scale(8),
    marginVertical: scale(10),
    borderColor: '#ddd',
    borderWidth: 1,
  },
  dateText: {
    marginLeft: scale(10),
    fontSize: scale(16),
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: scale(15),
    backgroundColor: '#f0f0f0',
    borderRadius: scale(8),
    marginVertical: scale(10),
  },
  uploadText: {
    marginLeft: scale(10),
    fontSize: scale(16),
    color: '#555',
  },
  imagePreview: {
    width: '100%',
    height: scaleHeight(200), // Use scaleHeight for height
    borderRadius: scale(8),
    marginTop: scale(10),
  },
  submitButton: {
    backgroundColor: '#2B3467',
    padding: scale(15),
    borderRadius: scale(8),
    alignItems: 'center',
    marginTop: scale(20),
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: scale(18),
    fontWeight: 'bold',
  },
  loadingIndicator: {
    marginTop: scale(20),
  },
});


export default Campaigns;
