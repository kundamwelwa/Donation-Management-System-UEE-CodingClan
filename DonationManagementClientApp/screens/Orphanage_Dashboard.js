import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions, ScrollView, LayoutAnimation } from 'react-native';
import { Card } from 'react-native-paper';
import { FontAwesome } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const orphanageRequests = [
  { id: '1', donor: 'John Doe', request: 'Food Supplies', status: 'Pending' },
  { id: '2', donor: 'Jane Smith', request: 'Clothing', status: 'Approved' },
  // Add more requests as needed
];

const Orphanage_Dashboard = ({ navigation }) => {
  const [activeSection, setActiveSection] = useState('home'); // Manage active section

  // Function to handle section change with animation
  const changeSection = (section) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setActiveSection(section);
  };

  return (
    <View style={styles.container}>
      <View style={styles.userCard}>
        <Text style={styles.userName}>Hi, Kelly!</Text>
        <Text style={styles.userDate}>Sat, 9 July</Text>
      </View>

      <View style={styles.spacer} />

      {activeSection === 'home' && (
        <>
          <ScrollView style={styles.dashboardOverview} horizontal={true} showsHorizontalScrollIndicator={false}>
            <Card style={styles.card}>
              <Text style={styles.cardTitle}>Total Donations</Text>
              <Text style={styles.cardValue}>$10,000</Text>
            </Card>
            <Card style={styles.card}>
              <Text style={styles.cardTitle}>Pending Requests</Text>
              <Text style={styles.cardValue}>5</Text>
            </Card>
            <Card style={styles.card}>
              <Text style={styles.cardTitle}>Upcoming Events</Text>
              <Text style={styles.cardValue}>3 Events</Text>
            </Card>
            <Card style={styles.card}>
              <Text style={styles.cardTitle}>Projects</Text>
              <Text style={styles.cardValue}>2 Projects</Text>
            </Card>
            <Card style={styles.card}>
              <Text style={styles.cardTitle}>Recent Donors</Text>
              <Text style={styles.cardValue}>John Doe, Jane Smith</Text>
            </Card>
          </ScrollView>

          <Text style={styles.sectionTitle}>Requests from Donors</Text>
          <FlatList
            data={orphanageRequests}
            renderItem={({ item }) => (
              <View style={styles.requestCard}>
                <Text style={styles.requestDonor}>{item.donor}</Text>
                <Text style={styles.requestDetail}>{item.request}</Text>
                <Text style={styles.requestStatus}>{item.status}</Text>
                <View style={styles.requestActions}>
                  <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionButtonText}>View</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionButtonText}>Approve</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionButtonText}>Reject</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            keyExtractor={(item) => item.id}
          />
        </>
      )}

      {activeSection === 'requests' && (
        <>
          <Text style={styles.sectionTitle}>Requests from Donors</Text>
          <FlatList
            data={orphanageRequests}
            renderItem={({ item }) => (
              <View style={styles.requestCard}>
                <Text style={styles.requestDonor}>{item.donor}</Text>
                <Text style={styles.requestDetail}>{item.request}</Text>
                <Text style={styles.requestStatus}>{item.status}</Text>
                <View style={styles.requestActions}>
                  <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionButtonText}>View</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionButtonText}>Approve</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionButtonText}>Reject</Text>
                  </TouchableOpacity>
                </View>
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
        <TouchableOpacity style={styles.navButton} onPress={() => changeSection('requests')}>
          <FontAwesome name="envelope-open" size={23} color="white" />
          <Text style={styles.navButtonText}>Requests</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <FontAwesome name="line-chart" size={24} color="white" />
          <Text style={styles.navButtonText}>Statistics</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <FontAwesome name="bell" size={24} color="white" />
          <Text style={styles.navButtonText}>Notifications</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
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
    paddingBottom: height * 0.00, // 2% of screen height
  },
  userCard: {
    marginTop: height * 0.01, // 5% of screen height
    paddingVertical: height * 0.09, // 8% of screen height
    paddingHorizontal: width * 0.07, // 6% of screen width
    backgroundColor: '#2C2C2E',
    borderRadius: 10,
    marginBottom: height * 0.02, // 2% of screen height
    alignItems: 'center',
  },
  userName: {
    fontSize: width * 0.07, // 7% of screen width
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  userDate: {
    fontSize: width * 0.04, // 4% of screen width
    color: '#A1A1A3',
  },
  spacer: {
    height: height * 0.02, // 2% of screen height
  },
  dashboardOverview: {
    flexDirection: 'row',
    marginBottom: height * 0.02, // Adjusted to provide space after ScrollView
    
  },
  card: {
    width: width * 0.4, // Adjusted for horizontal scrolling
    marginRight: width * 0.05, // Space between cards
    padding: width * 0.04, // 4% of screen width
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardTitle: {
    fontSize: width * 0.045, // 4.5% of screen width
    fontWeight: 'bold',
    color: '#333',
  },
  cardValue: {
    fontSize: width * 0.055, // 5.5% of screen width
    color: '#4A90E2',
  },
  sectionTitle: {
    fontSize: width * 0.05, // 5% of screen width
    fontWeight: 'bold',
    color: '#333',
    marginBottom: height * 0.01, // 1% of screen height
  },
  requestCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: width * 0.04, // 4% of screen width
    marginBottom: height * 0.01, // 1% of screen height
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  requestDonor: {
    fontSize: width * 0.04, // 4% of screen width
    fontWeight: 'bold',
    color: '#333',
  },
  requestDetail: {
    fontSize: width * 0.035, // 3.5% of screen width
    color: '#555',
  },
  requestStatus: {
    fontSize: width * 0.035, // 3.5% of screen width
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  requestActions: {
    flexDirection: 'row',
    marginTop: height * 0.01, // 1% of screen height
  },
  actionButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: height * 0.01, // 1% of screen height
    paddingHorizontal: width * 0.03, // 3% of screen width
    borderRadius: 5,
    marginRight: width * 0.02, // 2% of screen width
  },
  actionButtonText: {
    color: '#fff',
    fontSize: width * 0.035, // 3.5% of screen width
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.05, // 3% of screen width
    paddingVertical: height * 0.016, // 2.5% of screen height
    backgroundColor: '#2C2C2E',
    borderRadius: 10,
    elevation: 3,
  },
  navButton: {
    alignItems: 'center',
  },
  navButtonText: {
    color: 'white',
    marginTop: height * 0.01, // 1% of screen height
    fontSize: width * 0.02, // 3% of screen width
  },
});

export default Orphanage_Dashboard;
