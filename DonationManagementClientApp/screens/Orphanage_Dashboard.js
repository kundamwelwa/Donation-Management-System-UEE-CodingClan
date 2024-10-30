import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions, Image, StatusBar, Alert, ImageBackground } from 'react-native';
import { Card, FAB } from 'react-native-paper';
import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';

const { width, height } = Dimensions.get('window');
const defaultCoverPhoto = require('../assets/Images/DefaultImage.png');
const userCardBackgroundImage = require('../assets/Images/UserCardBackground.jpg');

const Orphanage_Dashboard = ({ navigation }) => {
  const [activeSection, setActiveSection] = useState('home');
  const [userName, setUserName] = useState('');
  const [location, setLocation] = useState('');
  const [numberOfChildren, setNumberOfChildren] = useState(0);
  const [orphanageCards, setOrphanageCards] = useState([]);
  const [fabOpen, setFabOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        console.log('Using API Token:', token); // Log the token being used
        
        if (!token) {
          Alert.alert('Error', 'You are not logged in. Please log in again.');
          navigation.navigate('Orphanage_Login');
          return;
        }
        
        const headers = { Authorization: `Bearer ${token}` };
        const apiUrl = API_URL || 'http://192.168.8.106:5001/api';
        
        const userResponse = await axios.get(`${apiUrl}/orphanages/getOrphanage`, { headers });
        
        // Accessing nested data correctly
        const orphanageData = userResponse.data.orphanage || {};
        const { name, physicalAddress, numberOfChildren } = orphanageData;
        
        console.log('Extracted Data:', { name, physicalAddress, numberOfChildren });
        
        if (!name || !physicalAddress || !numberOfChildren) {
          throw new Error('User data is incomplete or missing.');
        }
        
        setUserName(name);
        setLocation(physicalAddress);
        setNumberOfChildren(numberOfChildren);
      } catch (error) {
        console.error('Error fetching data:', error.message);
        Alert.alert('Error', error.response ? error.response.data.message : error.message);
      }
    };
    
    fetchData();
  }, []);
  
  
  const toggleFab = () => setFabOpen(!fabOpen);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      {/* User Card */}
      <ImageBackground source={userCardBackgroundImage} style={styles.userCard}>
  <View style={styles.userCardOverlay} />
  {/* Display userName only if it's a valid string */}
  <Text style={styles.userName}>{userName ? userName : 'Orphanage Name'}</Text>
  
  <View style={styles.userInfoContainer}>
    {/* Location */}
    <View style={styles.infoItem}>
      <FontAwesome name="map-marker" size={18} color="white" />
      <Text style={styles.infoText}>{location ? location : 'Location not provided'}</Text>
    </View>
    
    {/* Number of Children */}
    <View style={styles.infoItem}>
      <FontAwesome name="child" size={18} color="white" />
      <Text style={styles.infoText}>
        {typeof numberOfChildren === 'number' ? numberOfChildren : 'N/A'} children
      </Text>
    </View>
  </View>
</ImageBackground>


      {/* FAB for Actions */}
      <FAB
        style={styles.fab}
        icon={fabOpen ? 'close' : 'plus'}
        onPress={toggleFab}
      />
      {fabOpen && (
        <View style={styles.fabOptions}>
          <TouchableOpacity style={styles.fabOption} onPress={() => navigation.navigate('Create_Project')}>
            <FontAwesome name="pencil" size={20} color="#021526" />
            <Text style={styles.fabOptionText}>Create Project</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.fabOption} onPress={() => navigation.navigate('Create_Campaign')}>
            <FontAwesome name="bullhorn" size={20} color="#021526" />
            <Text style={styles.fabOptionText}>Create Campaign</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Bottom Navbar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={[styles.navButton, activeSection === 'home' && styles.navButtonActive]}
          onPress={() => changeSection('home')}
        >
          <FontAwesome name="home" size={24} color="white" />
          <Text style={styles.navButtonText}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.navButton, activeSection === 'donors' && styles.navButtonActive]}
          onPress={() => changeSection('donors')}
        >
          <FontAwesome name="users" size={24} color="white" />
          <Text style={styles.navButtonText}>Donors</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('Notifications')}
        >
          <FontAwesome name="bell" size={24} color="white" />
          {notificationCount > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>{notificationCount}</Text>
            </View>
          )}
          <Text style={styles.navButtonText}>Notifications</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('Orphanage_Profile')}
        >
          <FontAwesome name="user" size={24} color="white" />
          <Text style={styles.navButtonText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: height * 0.01,
    backgroundColor: '#EBF4F6',
  },
  userCard: {
    width,
    paddingVertical: height * 0.1,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
    overflow: 'hidden',
  },
  userCardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 5,
  },
  userInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 8,
  },
  fab: {
    position: 'absolute',
    bottom: 70,
    right: 20,
    backgroundColor: '#007AFF',
  },
  fabOptions: {
    position: 'absolute',
    bottom: 140,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 4,
  },
  fabOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  fabOptionText: {
    color: '#021526',
    fontSize: 16,
    marginLeft: 8,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#0057D9',
    paddingVertical: 10,
    paddingBottom: 0,position: 'absolute', // Positioning changed to absolute
    bottom: 0,           // Fixed to the bottom of the screen
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#0057D9',
    paddingVertical: 10,
    paddingBottom: 0,
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
  },
  navButtonActive: {
    backgroundColor: '#003C99',
  },
  navButtonText: {
    color: 'white',
    fontSize: 10,
    marginTop: 4,
  },
  notificationBadge: {
    position: 'absolute',
    right: 12,
    top: 5,
    backgroundColor: 'red',
    borderRadius: 10,
    padding: 2,
  },
  notificationBadgeText: {
    color: 'white',
    fontSize: 10,
  },
});

export default Orphanage_Dashboard;
