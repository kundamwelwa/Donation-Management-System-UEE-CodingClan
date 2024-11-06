import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions, Image, LayoutAnimation, StatusBar, ActivityIndicator, Alert, ImageBackground } from 'react-native';
import { Card } from 'react-native-paper';
import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';

const { width, height } = Dimensions.get('window');
const defaultCoverPhoto = require('../assets/Images/DefaultImage.png');
const userCardBackgroundImage = require('../assets/Images/UserCardBackground.jpg'); // Add your background image here

const Donor_Dashboard = ({ navigation }) => {
  const [activeSection, setActiveSection] = useState('home');
  const [currentDate, setCurrentDate] = useState('');
  const [userName, setUserName] = useState('');
  const [orphanageCards, setOrphanageCards] = useState([]);
  const [donationHistory, setDonationHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notificationCount, setNotificationCount] = useState(5);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          Alert.alert('Error', 'You are not logged in. Please log in again.');
          navigation.navigate('Donor_Login');
          return;
        }

        const headers = { Authorization: `Bearer ${token}` };
        const apiUrl = API_URL || 'http://192.168.224.200:5001/api';

        const userResponse = await axios.get(`${apiUrl}/auth/getUser`, { headers });
        setUserName(userResponse.data.name);

        const orphanagesResponse = await axios.get(`${apiUrl}/orphanages/getAllOrphanages`, { headers });
        setOrphanageCards(orphanagesResponse.data);

        const donationsResponse = await axios.get(`${apiUrl}/donations/getDonationHistory`, { headers });
        setDonationHistory(donationsResponse.data);

        const date = new Date().toLocaleDateString('en-GB', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
        });
        setCurrentDate(date);
      } catch (error) {
        setError('Error fetching data. Please try again later.');
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    StatusBar.setTranslucent(true); // Make the status bar translucent
    StatusBar.setBackgroundColor('transparent'); // Set the background color to transparent
  }, []);

  const changeSection = (section) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setActiveSection(section);
  };

  const renderOrphanageCard = ({ item }) => (
    <Card key={item._id} style={styles.card}>
      <View style={styles.coverPhotoContainer}>
        <Image
          source={item.coverPhoto && typeof item.coverPhoto === 'string' ? { uri: item.coverPhoto } : defaultCoverPhoto}
          style={styles.coverPhoto}
        />
      </View>
      <View style={styles.cardFooter}>
        <Text style={styles.cardTitle}>{item.orphanageName}</Text>
        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <FontAwesome name="map-marker" size={16} color="#474F7A" />
            <Text style={styles.infoText}>{item.physicalAddress}</Text>
          </View>
          <View style={styles.infoItem}>
            <FontAwesome name="child" size={16} color="#474F7A" />
            <Text style={styles.infoText}>{item.numberOfChildren}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.exploreButton}
          onPress={() => navigation.navigate('Orphanage_Feed', { orphanageId: item._id })}
        >
          <Text style={styles.exploreButtonText}>Explore</Text>
          <FontAwesome name="arrow-right" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </Card>
  );

  const renderDonationHistory = ({ item }) => (
    <View style={styles.historyCard}>
      <Text style={styles.historyDate}>{item.date}</Text>
      <Text style={styles.historyAmount}>${item.amount}</Text>
      <Text style={styles.historyCampaign}>{item.campaign}</Text>
    </View>
  );

  const renderItem = () => {
    switch (activeSection) {
      case 'home':
        return orphanageCards.length > 0 ? (
          <FlatList
            data={orphanageCards}
            renderItem={renderOrphanageCard}
            keyExtractor={(item) => item._id ? item._id.toString() : Math.random().toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.orphanageCards}
            contentContainerStyle={{
              paddingRight: width * 0.09,  // Adds space after the last orphanage card
            }}
          />
        ) : (
          <View style={styles.noOrphanagesContainer}>
            <Text style={styles.noOrphanagesText}>You don’t have any Orphanages yet</Text>
            <Text style={styles.searchInstruction}>
              Search for orphanages by hitting the Donate button
            </Text>
          </View>
        );

      case 'donationHistory':
        return donationHistory.length > 0 ? (
          <FlatList
            data={donationHistory}
            renderItem={renderDonationHistory}
            keyExtractor={(item) => item.id ? item.id.toString() : Math.random().toString()}
            style={styles.historyList}
          />
        ) : (
          <View style={styles.noDataContainer}>
            <Text>No donation data available.</Text>
          </View>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return <View style={styles.loader}><ActivityIndicator size="large" color="#0000ff" /></View>;
  }

  if (error) {
    return <View style={styles.loader}><Text>{error}</Text></View>;
  }

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content" // or "dark-content" depending on your background
        translucent
        backgroundColor="transparent" // Background color to match the design
      />
      {/* User card */}
      <ImageBackground source={userCardBackgroundImage} style={styles.userCard}>
        <View style={styles.userCardOverlay} />
        <Text style={styles.userName}>Welcome, {userName}!</Text>
        <Text style={styles.userDate}>{currentDate}</Text>
      </ImageBackground>

      <View style={styles.spacer} />

      {renderItem()}

      {/* Donate button with adaptive size */}
      <TouchableOpacity style={styles.donateButton} onPress={() => navigation.navigate('Donation')}>
        <FontAwesome name="heart" size={24} color="white" />
        <Text style={styles.donateButtonText}>Donate</Text>
      </TouchableOpacity>

      {/* Modernized Bottom Navbar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={[
            styles.navButton,
            activeSection === 'home' ? styles.navButtonActive : null,
          ]}
          onPress={() => changeSection('home')}
        >
          <FontAwesome name="home" size={24} color="white" />
          <Text style={styles.navButtonText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.navButton,
            activeSection === 'donationHistory' ? styles.navButtonActive : null,
          ]}
          onPress={() => changeSection('donationHistory')}
        >
          <FontAwesome name="calendar-o" size={24} color="white" />
          <Text style={styles.navButtonText}>Activities</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.navButton,
            activeSection === 'ongoingCampaigns' ? styles.navButtonActive : null,
          ]}
          onPress={() => changeSection('ongoingCampaigns')}
        >
          <FontAwesome name="star" size={24} color="white" />
          <Text style={styles.navButtonText}>Campaigns</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('Donor_Notifications')}
        >
          <View style={styles.notificationIconContainer}>
            <FontAwesome name="bell" size={24} color="white" />
            {notificationCount > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>{notificationCount}</Text>
              </View>
            )}
          </View>
          <Text style={styles.navButtonText}>Notifications</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('Donor_Profile')}
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
    width: width,
    paddingVertical: height * 0.1,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
    overflow: 'hidden',
  },
  userCardOverlay: {
    marginTop: 0,
    position: 'absolute',
    width: '100%',
    height: '100%',
    //backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  userName: {
    fontSize: width * 0.07,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  userDate: {
    fontSize: width * 0.04,
    color: '#CCCCCC',
  },
  spacer: {
    height: height * 0.02,
  },
  orphanageCards: {
    marginBottom: height * 0.03,
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.04,
    textAlign: 'center',
  },
  singleCardContainer: {
    justifyContent: 'center',
  },
  card: {
    width: width * 0.9,
    height: width * 0.6,
    marginHorizontal: width * 0.01,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  coverPhoto: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  coverPhotoContainer: {
    height: '100%',
    overflow: 'hidden',
  },
  cardFooter: {
    paddingVertical: height * 0.01,  // Reduced padding to make footer shorter
    paddingHorizontal: width * 0.02,
    backgroundColor: 'white',        // Keep the background white
    width: '100%',
    alignItems: 'flex-start',
    position: 'absolute',
    bottom: 0,                       // Stick to the bottom of the card
    height: height * 0.1,            // Define height to make it shorter
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: width * 0.045,
    color: '#000000',
    fontFamily: 'sans-serif-medium',  // Set the font family
    fontWeight: 'bold',
    marginBottom: height * 0.005,    // Reduce space between title and info
  },
  infoContainer: {
    marginVertical: height * 0.005,  // Reduce space between title and info icons
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Space between icons
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: width * 0.03,       // Reduced space between info items
  },
  infoText: {
    color: '#000000',
    marginLeft: width * 0.01,
    fontSize: width * 0.03,          // Adjust font size to fit better
  },
  exploreButton: {
    position: 'absolute',
    right: width * 0.02,
    bottom: height * 0.015,          // Adjust bottom space to fit within shorter footer
    backgroundColor: '#071952',
    paddingVertical: height * 0.012, // Reduced padding for a smaller button
    paddingHorizontal: width * 0.03,
    borderRadius: 20,
    alignItems: 'center',
    flexDirection: 'row',
  },
  exploreButtonText: {
    fontSize: width * 0.04,
    color: 'white',
    marginRight: width * 0.01,
  },
  noOrphanagesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noOrphanagesText: {
    fontSize: width * 0.05,
    textAlign: 'center',
    marginBottom: height * 0.01,
  },
  searchInstruction: {
    textAlign: 'center',
    fontSize: width * 0.04,
    color: '#888888',
  },
  donateButton: {
    backgroundColor: '#071952',
    paddingVertical: height * 0.02,
    marginHorizontal: width * 0.2,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom: height * 0.2,
  },
  donateButtonText: {
    color: '#FFFFFF',
    fontSize: width * 0.06,
    marginLeft: width * 0.02,
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
    alignItems: 'center',
    padding: width * 0.02,
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
  notificationIconContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    right: -8,
    top: -5,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: 'white',
    fontSize: 12,
  },
  historyList: {
    paddingBottom: height * 0.05,
  },
  historyCard: {
    padding: height * 0.02,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
  },
  historyDate: {
    fontSize: width * 0.04,
    color: '#888888',
  },
  historyAmount: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
  },
  historyCampaign: {
    fontSize: width * 0.04,
    color: '#888888',
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Donor_Dashboard;