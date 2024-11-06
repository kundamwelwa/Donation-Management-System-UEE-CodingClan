import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Dimensions,
  SafeAreaView,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';

const { width, height } = Dimensions.get('window');

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

    if (result && !result.canceled && result.assets && result.assets.length > 0) {
      const selectedAsset = result.assets[0];
      setImageUri(selectedAsset.uri);
      setImageName(selectedAsset.uri.split('/').pop());
    } else {
      console.log('Image picker was canceled or no asset was returned.');
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
        if (type && (type === 'jpg' || type === 'jpeg' || type === 'png')) {
          formData.append('image', {
            uri: imageUri,
            name: imageName || `image.${type}`,
            type: `image/${type === 'jpg' ? 'jpeg' : type}`,
          });
        } else {
          Alert.alert('Error', 'Invalid image format');
          setLoading(false);
          return;
        }
      }

      console.log('FormData before submission:', formData);

      const apiUrl = API_URL || 'http://192.168.224.200:5001/api';
      const response = await axios.post(`${apiUrl}/campaigns/create`, formData, { headers });
      console.log('Campaign created response:', response);
      Alert.alert('Success', 'Campaign created successfully!');
      resetForm();
    } catch (error) {
      console.error('Error creating campaign:', error);
      if (error.response && error.response.data && error.response.data.message) {
        Alert.alert('Error', error.response.data.message);
      } else {
        Alert.alert('Error', 'Failed to create campaign. Please try again.');
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
          <Icon name="dollar" size={20} color="#555" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Target Amount"
            keyboardType="numeric"
            value={targetAmount}
            onChangeText={setTargetAmount}
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="tags" size={20} color="#555" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Category"
            value={category}
            onChangeText={setCategory}
          />
        </View>

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

        <View style={styles.inputContainer}>
          <Icon name="map-marker" size={20} color="#555" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Location"
            value={location}
            onChangeText={setLocation}
          />
        </View>

        <TouchableOpacity onPress={handleImagePick} style={styles.uploadButton}>
          <Icon name="camera" size={20} color="#555" />
          <Text style={styles.uploadText}>{imageUri ? 'Change Image' : 'Upload Image'}</Text>
        </TouchableOpacity>
        {imageUri && <Text style={styles.imageName}>{imageName}</Text>}
        {imageUri && <Image source={{ uri: imageUri }} style={styles.imagePreview} />}

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
  },
  scrollContainer: {
    padding: 20,
  },
  heading: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  datePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginVertical: 10,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  dateText: {
    marginLeft: 10,
    fontSize: 16,
  },
  uploadButton: {
    alignContent: width * 0.05,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginVertical: 10,
  },
  uploadText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#555',
  },
  imageName: {
    marginTop: 10,
    color: '#555',
    fontSize: 14,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginTop: 10,
  },
  submitButton: {
    backgroundColor: '#2B3467',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingIndicator: {
    marginTop: 20,
  },
});

export default Campaigns;
