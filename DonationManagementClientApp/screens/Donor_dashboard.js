import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions,Image, ScrollView, LayoutAnimation } from 'react-native';
import { Card } from 'react-native-paper';
import { FontAwesome } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const donationHistory = [
  { id: '1', date: '2024-08-15', amount: '$100', campaign: 'Feed the Children' },
  { id: '2', date: '2024-07-22', amount: '$50', campaign: 'Clothing Drive' },
  // Add more donation history as needed
];

const ongoingCampaigns = [
  { id: '1', name: 'Feed the Children', status: 'Active' },
  { id: '2', name: 'Clothing Drive', status: 'Completed' },
  // Add more campaigns as needed
];

const Orphanage1 = require('../assets/Images/Orphanage1.jpg');
const Orphanage2 = require('../assets/Images/Orphanage2.jpg');
const Orphanage3 = require('../assets/Images/Orphanage3.jpg');
const Orphanage4 = require('../assets/Images/Orphanage4.jpg');


const orphanageCards = [
  { id: '1', name: 'Orphanage 1', description: 'Helping underprivileged children.', coverPhoto: Orphanage1 },
  { id: '2', name: 'Orphanage 2', description: 'Providing food and shelter.', coverPhoto: Orphanage2 },
  { id: '3', name: 'Orphanage 3', description: 'Supporting education.', coverPhoto: Orphanage3 },
  { id: '4', name: 'Orphanage 4', description: 'Offering medical aid.', coverPhoto: Orphanage4 },
  // Add more orphanage cards as needed
];



const Donor_Dashboard = ({ navigation }) => {
  const [activeSection, setActiveSection] = useState('home'); // Manage active section

  // Function to handle section change with animation
  const changeSection = (section) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setActiveSection(section);
  };

  return (
    <View style={styles.container}>
      <View style={styles.userCard}>
        <Text style={styles.userName}>Welcome, Kelly!</Text>
        <Text style={styles.userDate}>Sat, 9 July</Text>
      </View>

      <View style={styles.spacer} />

      {activeSection === 'home' && (
        <>
          <ScrollView style={styles.orphanageCards} horizontal showsHorizontalScrollIndicator={false}>
            {orphanageCards.map((item) => (
              <Card key={item.id} style={styles.card}>
                <View style={styles.coverPhotoContainer}>
                  <Image source={item.coverPhoto} style={styles.coverPhoto} />
                </View>
                <View style={styles.cardFooter}>
                  <Text style={styles.cardTitle}>{item.name}</Text>
                  <TouchableOpacity style={styles.exploreButton} onPress={() => navigation.navigate('OrphanageDetails', { orphanageId: item.id })}>
                    <Text style={styles.exploreButtonText}>Explore</Text>
                    <FontAwesome name="arrow-right" size={20} color="white" />
                  </TouchableOpacity>
                </View>
              </Card>
            ))}
          </ScrollView>



          <TouchableOpacity style={styles.donateButton} onPress={() => navigation.navigate('Donate')}>
            <FontAwesome name="dollar" size={30} color="white" />
            <Text style={styles.donateButtonText}>Donate</Text>
          </TouchableOpacity>

          <View style={styles.spacer} />
        </>
      )}

      {activeSection === 'donationHistory' && (
        <>
          <ScrollView style={styles.dashboardOverview} horizontal showsHorizontalScrollIndicator={false}>
            <Card style={styles.card}>
              <Text style={styles.cardTitle}>Total Donations</Text>
              <Text style={styles.cardValue}>$10,000</Text>
            </Card>
            <Card style={styles.card}>
              <Text style={styles.cardTitle}>Ongoing Campaigns</Text>
              <Text style={styles.cardValue}>2</Text>
            </Card>
            <Card style={styles.card}>
              <Text style={styles.cardTitle}>Upcoming Events</Text>
              <Text style={styles.cardValue}>3 Events</Text>
            </Card>
            <Card style={styles.card}>
              <Text style={styles.cardTitle}>Recent Activities</Text>
              <Text style={styles.cardValue}>5 Activities</Text>
            </Card>
          </ScrollView>

          <Text style={styles.sectionTitle}>Donation History</Text>
          <FlatList
            data={donationHistory}
            renderItem={({ item }) => (
              <View style={styles.historyCard}>
                <Text style={styles.historyDate}>{item.date}</Text>
                <Text style={styles.historyAmount}>{item.amount}</Text>
                <Text style={styles.historyCampaign}>{item.campaign}</Text>
              </View>
            )}
            keyExtractor={(item) => item.id}
          />

          <Text style={styles.sectionTitle}>Ongoing Campaigns</Text>
          <FlatList
            data={ongoingCampaigns}
            renderItem={({ item }) => (
              <View style={styles.campaignCard}>
                <Text style={styles.campaignName}>{item.name}</Text>
                <Text style={styles.campaignStatus}>{item.status}</Text>
              </View>
            )}
            keyExtractor={(item) => item.id}
          />
        </>
      )}

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
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Notifications')}>
          <FontAwesome name="bell" size={24} color="white" />
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
    paddingHorizontal: width * 0.01,
    paddingBottom: height * 0.01,
  },
  userCard: {
    marginTop: height * 0.01,
    paddingVertical: height * 0.11,
    paddingHorizontal: width * 0.06,
    backgroundColor: '#201E43',
    borderRadius: 10,
    marginBottom: height * 0.01,
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
    width: width * 0.75,
    height: width * 0.7, // Ensure height fits the aspect ratio
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
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // Semi-transparent background
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
    paddingHorizontal: width * 0.00,
    borderRadius: 25,
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
  dashboardOverview: {
    marginBottom: height * 0.03,
    marginBottom: 20,
    paddingVertical: -height * 0.1,
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
    width: '100%', // Ensure it spans the full width of the screen
    flexDirection: 'row',
    backgroundColor: '#201E43',
    justifyContent: 'space-between',
    paddingVertical: '3%',
    paddingHorizontal: '4%', // Adjust or remove if needed
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    position: 'absolute', // Stick the navbar to the bottom
    bottom: 0,
    left: 0, // Stick the navbar to the left edge
    right: 0, // Stick the navbar to the right edge
 },

  navButton: {
    alignItems: 'center',
  },
  navButtonText: {
    color: '#FFFFFF',
    fontSize: width * 0.03,
  },
});



export default Donor_Dashboard;
