import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image, StatusBar, Alert, ImageBackground, Animated, ActivityIndicator, ScrollView } from 'react-native';
import { FAB } from 'react-native-paper';
import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';

const { width, height } = Dimensions.get('window');
const scale = size => (width / 375) * size;
const scaleHeight = size => (height / 667) * size;
const userCardBackgroundImage = require('../assets/Images/UserCardBackground.jpg');
const completedProjects = [
  { id: 1, title: 'LivingStone Tour', image: require('../assets/Images/Orphanage1.jpg') },
  { id: 2, title: 'Children Outreach', image: require('../assets/Images/Orphanage2.jpg') },
  { id: 3, title: 'School Building', image: require('../assets/Images/Orphanage3.jpg') },
];

const Orphanage_Dashboard = ({ navigation }) => {
  const [activeSection, setActiveSection] = useState('home');
  const [orphanageName, setOrphanageName] = useState('');
  const [location, setLocation] = useState('');
  const [numberOfChildren, setNumberOfChildren] = useState(0);
  const [totalDonations, setTotalDonations] = useState(0);
  const [fabOpen, setFabOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const [loading, setLoading] = useState(true);
  const scaleValue = new Animated.Value(1);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      setLoading(true);
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
        const apiUrl = API_URL || 'http:/192.168.179.200:5001/api';

        const userResponse = await axios.get(`${apiUrl}/Orphanages/getOrphanage`, { headers });
        const orphanageData = userResponse.data || {};
        const { physicalAddress, numberOfChildren, totalDonations } = orphanageData;

        if (isMounted) {
          setLocation(physicalAddress || 'Location not provided');
          setNumberOfChildren(typeof numberOfChildren === 'number' ? numberOfChildren : 'N/A');
          setTotalDonations(totalDonations || 0);
        }
      } catch (error) {
        console.error('Error fetching data:', error.message);
        Alert.alert('Error', error.response ? error.response.data.message : error.message);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, [navigation]);

  const toggleFab = () => setFabOpen(!fabOpen);

  const changeSection = (section) => {
    setActiveSection(section);
    Animated.spring(scaleValue, { toValue: 1.2, useNativeDriver: true }).start(() =>
      Animated.spring(scaleValue, { toValue: 1, useNativeDriver: true }).start()
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

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


          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={styles.loadingText}>Loading...</Text>
            </View>
          ) : (
            <>
              {/* Donations Card */}
              <View style={styles.donationsCard}>
                <Text style={styles.donationsText}>Total Donations:</Text>
                <Text style={styles.donationsAmount}>${totalDonations.toLocaleString()}</Text>
              </View>


               
          {/* Projects Slider */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.projectsSlider}>
            {completedProjects.map((project) => (
              <View key={project.id} style={styles.projectCard}>
                <Image source={project.image} style={styles.projectImage} />
                <Text style={styles.projectTitle}>{project.title}</Text>
              </View>
            ))}
          </ScrollView>

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
    paddingBottom: scaleHeight(15),
    backgroundColor: '#EBF4F6',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: scale(18),
    color: '#007AFF',
    marginTop: scaleHeight(10),
  },
  userCard: {
    width,
    paddingVertical: scaleHeight(60), // Changed for responsive design
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomRightRadius: scale(15),
    borderBottomLeftRadius: scale(15),
    overflow: 'hidden',
  },
  userCardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  userName: {
    fontSize: scale(30),
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: scaleHeight(9),
  },
  userInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: scale(20),
    marginTop: scaleHeight(10),
  },

  donationsCard: {
    padding: scale(25),
    backgroundColor: '#071952',
    margin: scale(10),
    borderRadius: scale(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  donationsText: {
    color: 'white',
    fontSize: scale(16),
  },
  donationsAmount: {
    color: 'white',
    fontSize: scale(24),
    fontWeight: 'bold',
  },

  cardHeader: {
    padding: scale(10),
    fontSize: scale(14),
    fontWeight: 'bold',
    color: '#333',
  },

  projectsSlider: {
    marginTop: scale(20),
    paddingHorizontal: scale(10),
  },
  projectCard: {
    width: scale(150),
    height: scale(170),
    marginRight: scale(10),
    borderRadius: scale(10),
    overflow: 'hidden',
    backgroundColor: '#C5D3E8',
  },
  projectImage: {
    width: '100%',
    height: scaleHeight(80),
  },
  projectTitle: {
    padding: scale(10),
    fontSize: scale(14),
    fontWeight: 'bold',
    color: '#333',
  },

  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    color: 'white',
    fontSize: scale(16),
    marginLeft: scale(8),
  },
  fab: {
    position: 'absolute',
    bottom: scaleHeight(80),
    right: scale(20),
    backgroundColor: '#C5D3E8',
  },
  fabOptions: {
    position: 'absolute',
    bottom: scaleHeight(150),
    right: scale(20),
    backgroundColor: '#C5D3E8',
    borderRadius: scale(8),
    elevation: 4,
  },
  fabOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: scale(10),
  },
  fabOptionText: {
    color: '#021526',
    fontSize: scale(16),
    fontWeight: 'bold',
    marginLeft: scale(8),
  },
  bottomNav: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: '#071952',
    justifyContent: 'space-between',
    paddingVertical: scaleHeight(5),
    paddingHorizontal: scale(16),
    borderTopLeftRadius: scale(15),
    borderTopRightRadius: scale(15),
    position: 'absolute',
    bottom: 0,
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
  },
  navButtonActive: {
    backgroundColor: '#021526',
    borderRadius: scale(10),
    paddingHorizontal: scale(8),
    paddingVertical: scaleHeight(5),
  },
  navButtonText: {
    fontSize: scale(13),
    color: 'white',
    marginTop: scaleHeight(5),
  },
  notificationBadge: {
    position: 'absolute',
    right: scale(22),
    top: -scale(3),
    backgroundColor: 'red',
    borderRadius: scale(10),
    width: scale(15),
    height: scale(15),
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: 'white',
    fontSize: scale(10),
  },
});

export default Orphanage_Dashboard;
