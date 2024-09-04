import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions, Image, LayoutAnimation } from 'react-native';
import { Card } from 'react-native-paper';
import { FontAwesome } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// Sample data
const donationHistory = [
  { id: '1', date: '2024-08-15', amount: '$100', campaign: 'Feed the Children' },
  { id: '2', date: '2024-07-22', amount: '$50', campaign: 'Clothing Drive' },
];

const ongoingCampaigns = [
  { id: '1', name: 'Feed the Children', status: 'Active' },
  { id: '2', name: 'Clothing Drive', status: 'Completed' },
];

const orphanageCards = [
  { id: '1', name: 'Orphanage 1', description: 'Helping underprivileged children.', coverPhoto: require('../assets/Images/Orphanage1.jpg') },
  { id: '2', name: 'Orphanage 2', description: 'Providing food and shelter.', coverPhoto: require('../assets/Images/Orphanage2.jpg') },
  { id: '3', name: 'Orphanage 3', description: 'Supporting education.', coverPhoto: require('../assets/Images/Orphanage3.jpg') },
  { id: '4', name: 'Orphanage 4', description: 'Offering medical aid.', coverPhoto: require('../assets/Images/Orphanage4.jpg') },
];

const Donor_Dashboard = ({ navigation }) => {
  const [activeSection, setActiveSection] = useState('home');
  const [notificationCount, setNotificationCount] = useState(5); // Replace with dynamic data
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    // Update current date
    const date = new Date().toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
    setCurrentDate(date);
  }, []);

  const changeSection = (section) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setActiveSection(section);
  };

  const renderOrphanageCard = ({ item }) => (
    <Card key={item.id} style={styles.card}>
      <View style={styles.coverPhotoContainer}>
        <Image source={item.coverPhoto} style={styles.coverPhoto} />
      </View>
      <View style={styles.cardFooter}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <TouchableOpacity 
          style={styles.exploreButton} 
          onPress={() => navigation.navigate('Orphanage_Feed', { orphanageId: item.id })}
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
      <Text style={styles.historyAmount}>{item.amount}</Text>
      <Text style={styles.historyCampaign}>{item.campaign}</Text>
    </View>
  );

  const renderCampaign = ({ item }) => (
    <View style={styles.campaignCard}>
      <Text style={styles.campaignName}>{item.name}</Text>
      <Text style={styles.campaignStatus}>{item.status}</Text>
    </View>
  );

  const renderItem = () => {
    switch (activeSection) {
      case 'home':
        return (
          <FlatList
            data={orphanageCards}
            renderItem={renderOrphanageCard}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.orphanageCards}
          />
        );
      case 'donationHistory':
        return (
          <>
            <FlatList
              data={donationHistory}
              renderItem={renderDonationHistory}
              keyExtractor={item => item.id}
              style={styles.historyList}
            />
            <FlatList
              data={ongoingCampaigns}
              renderItem={renderCampaign}
              keyExtractor={item => item.id}
              style={styles.campaignList}
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.userCard}>
        <Text style={styles.userName}>Welcome, Kelly!</Text>
        <Text style={styles.userDate}>{currentDate}</Text>
      </View>

      <View style={styles.spacer} />

      {activeSection === 'home' && (
        <>
          <FlatList
            data={orphanageCards}
            renderItem={renderOrphanageCard}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.orphanageCards}
          />

          <TouchableOpacity style={styles.donateButton} onPress={() => navigation.navigate('Donation')}>
            <FontAwesome name="dollar" size={30} color="white" />
            <Text style={styles.donateButtonText}>Donate</Text>
          </TouchableOpacity>

          <View style={styles.spacer} />
        </>
      )}

      {activeSection === 'donationHistory' && renderItem()}

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton} onPress={() => changeSection('home')}>
          <FontAwesome name="home" size={24} color="white" />
          <Text style={styles.navButtonText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => changeSection('donationHistory')}>
          <FontAwesome name="calendar-o" size={24} color="white" />
          <Text style={styles.navButtonText}>Activities</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Campaigns')}>
          <FontAwesome name="star" size={24} color="white" />
          <Text style={styles.navButtonText}>Campaigns</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Donor_Notifications')}>
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
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Donor_Profile')}>
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
  },
  userCard: {
    paddingVertical: height * 0.11,
    paddingHorizontal: width * 0.06,
    backgroundColor: '#201E43',
    marginBottom: height * 0.01,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    alignItems: 'center',
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
    paddingVertical: height * 0.00,
    textAlign: 'center',
  },
  card: {
    width: width * 0.8, // Adjusted to 80% of screen width
    height: width * 0.6, // Adjusted height relative to width
    marginHorizontal: width * 0.02,
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
  cardFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    padding: width * 0.05,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    width: '100%',
    borderBottomLeftRadius: 10,
    borderTopRightRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: '#000000',
  },
  exploreButton: {
    backgroundColor: '#201E43',
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.04,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  exploreButtonText: {
    color: '#FFFFFF',
    fontSize: width * 0.04,
    marginRight: width * 0.02,
  },
  donateButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: height * 0.02,
    marginHorizontal: width * 0.2,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom: height * 0.10,
  },
  donateButtonText: {
    color: '#FFFFFF',
    fontSize: width * 0.06,
    marginLeft: width * 0.02,
  },
  sectionTitle: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    marginBottom: height * 0.02,
  },
  historyCard: {
    padding: width * 0.05,
    marginBottom: height * 0.02,
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
  },
  historyDate: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
  historyAmount: {
    fontSize: width * 0.04,
    color: '#4CAF50',
  },
  historyCampaign: {
    fontSize: width * 0.04,
    color: '#666666',
  },
  campaignCard: {
    padding: width * 0.05,
    marginBottom: height * 0.02,
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
  },
  campaignName: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
  campaignStatus: {
    fontSize: width * 0.04,
    color: '#FF5722',
  },
  bottomNav: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: '#201E43',
    justifyContent: 'space-between',
    paddingVertical: '3%',
    paddingHorizontal: '4%',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    position: 'absolute',
    bottom: 0,
  },
  navButton: {
    alignItems: 'center',
  },
  navButtonText: {
    color: '#FFFFFF',
    fontSize: width * 0.03,
  },

  notificationIconContainer: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
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
    fontWeight: 'bold',
  },
  
});

export default Donor_Dashboard;
