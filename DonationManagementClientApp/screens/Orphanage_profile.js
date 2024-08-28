import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Modal, Dimensions } from 'react-native';
import { Card } from 'react-native-paper';
import { FontAwesome } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const OrphanageProfile = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const galleryImages = [
    'https://example.com/image1.jpg',
    'https://example.com/image2.jpg',
    'https://example.com/image3.jpg',
  ];

  const openModal = (imageUri) => {
    setSelectedImage(imageUri);
    setModalVisible(true);
  };

  const logout = () => {
    // Handle logout
  };

  return (
    <ScrollView style={styles.container}>
      {/* Profile Picture and Edit Button */}
      <View style={styles.profileSection}>
        <Image
          source={{ uri: 'https://example.com/profile-picture.jpg' }}
          style={styles.profilePicture}
        />
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Settings Section */}
      <Card style={styles.card}>
        <Text style={styles.cardTitle}>Settings</Text>
        <TouchableOpacity style={styles.settingsOption}>
          <FontAwesome name="user" size={24} color="#4A90E2" />
          <Text style={styles.settingsOptionText}>Account Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingsOption}>
          <FontAwesome name="bell" size={24} color="#4A90E2" />
          <Text style={styles.settingsOptionText}>Notifications</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingsOption}>
          <FontAwesome name="lock" size={24} color="#4A90E2" />
          <Text style={styles.settingsOptionText}>Privacy</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingsOption}>
          <FontAwesome name="info-circle" size={24} color="#4A90E2" />
          <Text style={styles.settingsOptionText}>About Us</Text>
        </TouchableOpacity>
      </Card>

      {/* Gallery Section */}
      <Card style={styles.card}>
        <Text style={styles.cardTitle}>Gallery</Text>
        <View style={styles.galleryContainer}>
          {galleryImages.map((imageUri, index) => (
            <TouchableOpacity key={index} onPress={() => openModal(imageUri)}>
              <Image source={{ uri: imageUri }} style={styles.galleryImage} />
            </TouchableOpacity>
          ))}
        </View>
      </Card>

      {/* Image Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          <Image source={{ uri: selectedImage }} style={styles.fullImage} />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: width * 0.05, // 5% of screen width
    paddingBottom: height * 0.02, // 2% of screen height
    backgroundColor: '#f8f8f8',
  },
  profileSection: {
    alignItems: 'center',
    marginTop: height * 0.05, // 5% of screen height
  },
  profilePicture: {
    width: width * 0.4,
    height: width * 0.4,
    borderRadius: width * 0.2,
    marginBottom: height * 0.02,
  },
  editButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.2,
    borderRadius: 5,
  },
  editButtonText: {
    color: 'white',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
  card: {
    marginVertical: height * 0.02,
    padding: width * 0.04,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardTitle: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: height * 0.015,
  },
  settingsOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: height * 0.015,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  settingsOptionText: {
    fontSize: width * 0.045,
    marginLeft: width * 0.05,
    color: '#333',
  },
  galleryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  galleryImage: {
    width: width * 0.3,
    height: height * 0.15,
    marginBottom: height * 0.02,
    borderRadius: 10,
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  fullImage: {
    width: '90%',
    height: '70%',
    borderRadius: 10,
  },
  closeButton: {
    marginTop: height * 0.03,
    backgroundColor: '#FF6F61',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.2,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#FF6F61',
    paddingVertical: height * 0.015,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: height * 0.03,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
});

export default OrphanageProfile;
