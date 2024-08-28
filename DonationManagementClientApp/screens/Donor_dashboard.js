import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions, ScrollView, LayoutAnimation } from 'react-native';
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

const orphanageCards = [
  { id: '1', name: 'Orphanage 1', description: 'Helping underprivileged children.' },
  { id: '2', name: 'Orphanage 2', description: 'Providing food and shelter.' },
  { id: '3', name: 'Orphanage 3', description: 'Supporting education.' },
  { id: '4', name: 'Orphanage 4', description: 'Offering medical aid.' },
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
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardValue}>{item.description}</Text>
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
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Profile')}>
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
    paddingHorizontal: width * 0.01, // 5% of screen width
    paddingBottom: height * 0.01, // 2% of screen height
  },
  userCard: {
    marginTop: height * 0.01, // 5% of screen height
    paddingVertical: height * 0.11, // 8% of screen height
    paddingHorizontal: width * 0.06, // 6% of screen width
    backgroundColor: '#2C2C2E',
    borderRadius: 10,
    marginBottom: height * 0.01, // 2% of screen height
    alignItems: 'center',
  },
  userName: {
    fontSize: width * 0.07, // 7% of screen width
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  userDate: {
    fontSize: width * 0.04, // 4% of screen width
    color: '#CCCCCC',
  },
  spacer: {
    height: height * 0.02, // 2% of screen height
  },
  orphanageCards: {
    marginBottom: height * 0.03, // 3% of screen height
    paddingVertical: height * 0.00, // 8% of screen height
    textAlign: 'center',
    
  },
  card: {
    width: width * 0.75, // 75% of screen width
    padding: width * 0.05, // 5% of screen width
    marginHorizontal: width * 0.02, // 2% of screen width
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
  },
  cardTitle: {
    fontSize: width * 0.05, // 5% of screen width
    fontWeight: 'bold',
  },
  cardValue: {
    fontSize: width * 0.04, // 4% of screen width
    color: '#666666',
  },
  donateButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: height * 0.02, // 2% of screen height
    paddingHorizontal: width * 0.00, // 5% of screen width
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom: height * 0.03, // 3% of screen height
  },
  donateButtonText: {
    color: '#FFFFFF',
    fontSize: width * 0.06, // 5% of screen width
    marginLeft: width * 0.02, // 2% of screen width
  },
  dashboardOverview: {
    marginBottom: height * 0.00, // 3% of screen height
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: width * 0.05, // 5% of screen width
    fontWeight: 'bold',
    marginBottom: height * 0.02, // 2% of screen height
  },
  historyCard: {
    padding: width * 0.05, // 5% of screen width
    marginBottom: height * 0.02, // 2% of screen height
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
  },
  historyDate: {
    fontSize: width * 0.045, // 4.5% of screen width
    fontWeight: 'bold',
  },
  historyAmount: {
    fontSize: width * 0.04, // 4% of screen width
    color: '#4CAF50',
  },
  historyCampaign: {
    fontSize: width * 0.04, // 4% of screen width
    color: '#666666',
  },
  campaignCard: {
    padding: width * 0.05, // 5% of screen width
    marginBottom: height * 0.02, // 2% of screen height
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
  },
  campaignName: {
    fontSize: width * 0.045, // 4.5% of screen width
    fontWeight: 'bold',
  },
  campaignStatus: {
    fontSize: width * 0.04, // 4% of screen width
    color: '#FF5722',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: height * 0.03, // 2% of screen height
    paddingHorizontal: height * 0.01,
    backgroundColor: '#333333',
    borderRadius: 14,
  },
  navButton: {
    alignItems: 'center',
  },
  navButtonText: {
    color: '#FFFFFF',
    fontSize: width * 0.03, // 4% of screen width
  },
});

export default Donor_Dashboard;
