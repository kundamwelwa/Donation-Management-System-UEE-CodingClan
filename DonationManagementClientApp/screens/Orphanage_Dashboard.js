import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image, StatusBar, Alert, ImageBackground, Animated, ActivityIndicator } from 'react-native';
import { FAB } from 'react-native-paper';
import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';

const { width, height } = Dimensions.get('window');
const userCardBackgroundImage = require('../assets/Images/UserCardBackground.jpg');

const Orphanage_Dashboard = ({ navigation }) => {
  const [activeSection, setActiveSection] = useState('home');
  const [orphanageName, setOrphanageName] = useState('');
  const [location, setLocation] = useState('');
  const [numberOfChildren, setNumberOfChildren] = useState(0);
  const [fabOpen, setFabOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const [loading, setLoading] = useState(true); // Loading state
  const scaleValue = new Animated.Value(1); // For button animation

  useEffect(() => {
    let isMounted = true; // Flag to track component mounted state
    const fetchData = async () => {
      setLoading(true); // Set loading to true
      try {
        const token = await AsyncStorage.getItem('token');
        const orphanageID = await AsyncStorage.getItem('orphanageID');
        const storedOrphanageName = await AsyncStorage.getItem('orphanageName');

        if (!token || !orphanageID) {
          Alert.alert('Error', 'You are not logged in. Please log in again.');
          navigation.navigate('Orphanage_Login');
          return;
        }

        setOrphanageName(storedOrphanageName || 'Orphanage Name');

        const headers = { Authorization: `Bearer ${token}` };
        const apiUrl = API_URL || 'http:/192.168.224.200:5001/api';

        const userResponse = await axios.get(`${apiUrl}/Orphanages/getOrphanage`, { headers });
        const orphanageData = userResponse.data || {};
        const { physicalAddress, numberOfChildren } = orphanageData;

        if (isMounted) {
          setLocation(physicalAddress || 'Location not provided');
          setNumberOfChildren(typeof numberOfChildren === 'number' ? numberOfChildren : 'N/A');
        }
      } catch (error) {
        console.error('Error fetching data:', error.message);
        Alert.alert('Error', error.response ? error.response.data.message : error.message);
      } finally {
        if (isMounted) {
          setLoading(false); // Set loading to false after fetching
        }
      }
    };

    fetchData();
    return () => {
      isMounted = false; // Cleanup function to set flag when unmounted
    };
  }, [navigation]);

  const toggleFab = () => setFabOpen(!fabOpen);

  const changeSection = (section) => {
    setActiveSection(section);
    Animated.spring(scaleValue, { toValue: 1.2, useNativeDriver: true }).start(() =>
      Animated.spring(scaleValue, { toValue: 1, useNativeDriver: true }).start()
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {loading ? ( // Loading indicator
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : (
        <>
          {/* User Card */}
          <ImageBackground source={userCardBackgroundImage} style={styles.userCard}>
            <View style={styles.userCardOverlay} />
            <Text style={styles.userName}>{orphanageName}</Text>
            <View style={styles.userInfoContainer}>
              <View style={styles.infoItem}>
                <FontAwesome name="map-marker" size={18} color="white" />
                <Text style={styles.infoText}>{location}</Text>
              </View>
              <View style={styles.infoItem}>
                <FontAwesome name="child" size={18} color="white" />
                <Text style={styles.infoText}>
                  {numberOfChildren !== 'N/A' ? `${numberOfChildren} children` : 'N/A'}
                </Text>
              </View>
            </View>
          </ImageBackground>

          {/* FAB for Actions */}
          <FAB style={styles.fab} icon={fabOpen ? 'close' : 'plus'} onPress={toggleFab} />
          {fabOpen && (
            <View style={styles.fabOptions}>
              <TouchableOpacity style={styles.fabOption} onPress={() => navigation.navigate('ProjectListing')}>
                <FontAwesome name="pencil" size={20} color="#021526" />
                <Text style={styles.fabOptionText}>Create Project</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.fabOption} onPress={() => navigation.navigate('Campaigns')}>
                <FontAwesome name="bullhorn" size={20} color="#021526" />
                <Text style={styles.fabOptionText}>Create Campaign</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Bottom Navbar */}
          <View style={styles.bottomNav}>
            {['home', 'donors', 'notifications', 'profile'].map((section, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.navButton, activeSection === section && styles.navButtonActive]}
                onPress={() => {
                  if (section === 'notifications') {
                    navigation.navigate('Notifications');
                  } else {
                    changeSection(section);
                  }
                }}
              >
                <Animated.View style={{ transform: [{ scale: activeSection === section ? scaleValue : 1 }] }}>
                  <FontAwesome
                    name={section === 'home' ? 'home' : section === 'donors' ? 'users' : section === 'profile' ? 'user' : 'bell'}
                    size={24}
                    color="white"
                  />
                </Animated.View>
                {section === 'notifications' && notificationCount > 0 && (
                  <View style={styles.notificationBadge}>
                    <Text style={styles.notificationBadgeText}>{notificationCount}</Text>
                  </View>
                )}
                <Text style={styles.navButtonText}>{section.charAt(0).toUpperCase() + section.slice(1)}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: height * 0.01,
    backgroundColor: '#EBF4F6',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#007AFF',
    marginTop: 10,
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
    width: '100%',
    flexDirection: 'row',
    backgroundColor: '#071952',
    justifyContent: 'space-between',
    paddingVertical: '1%',
    paddingHorizontal: '4%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'absolute',
    bottom: 0,
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
  },
  navButtonActive: {
    backgroundColor: '#021526',
    borderRadius: 10,
    paddingHorizontal: width * 0.02,
    paddingVertical: height * 0.01,
  },
  navButtonText: {
    fontSize: width * 0.03,
    color: 'white',
    marginTop: height * 0.01,
  },
  notificationBadge: {
    position: 'absolute',
    right: 22,
    top: -3,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 15,
    height: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: 'white',
    fontSize: 10,
  },
});

export default Orphanage_Dashboard;
