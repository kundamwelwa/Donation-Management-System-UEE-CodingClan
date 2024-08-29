import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions, ScrollView, LayoutAnimation } from 'react-native';
import { Card } from 'react-native-paper';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const orphanageRequests = [
  { id: '1', donor: 'John Doe', request: 'Food Supplies', status: 'Pending' },
  { id: '2', donor: 'Jane Smith', request: 'Clothing', status: 'Approved' },
  // Add more requests as needed
];

const Orphanage_Dashboard = () => {
  const [activeSection, setActiveSection] = useState('home');
  const navigation = useNavigation();

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

      {activeSection === 'home' && (
        <ScrollView
          contentContainerStyle={styles.dashboardContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.iconContainer}>
            <TouchableOpacity style={styles.iconCard}>
              <FontAwesome name="dollar" size={24} color="#134B70" />
              <Text style={styles.iconText}>Total Donations</Text>
              <Text style={styles.iconValue}>$10,000</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconCard}>
              <FontAwesome name="envelope" size={24} color="#134B70" />
              <Text style={styles.iconText}>Pending Requests</Text>
              <Text style={styles.iconValue}>5</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconCard}>
              <FontAwesome name="calendar" size={24} color="#134B70" />
              <Text style={styles.iconText}>Upcoming Events</Text>
              <Text style={styles.iconValue}>3 Events</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconCard}>
              <FontAwesome name="briefcase" size={24} color="#134B70" />
              <Text style={styles.iconText}>Projects</Text>
              <Text style={styles.iconValue}>2 Projects</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconCard}>
              <FontAwesome name="users" size={24} color="#134B70" />
              <Text style={styles.iconText}>Recent Donors</Text>
              <Text style={styles.iconValue}>John Doe, Jane Smith</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Orphanage_profile')}>
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
    paddingBottom: height * 0.00,
  },
  userCard: {
    marginTop: 0,
    paddingVertical: height * 0.1,
    paddingHorizontal: width * 0.07,
    backgroundColor: '#2C2C2E',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: height * 0.02,
    alignItems: 'center',
  },
  userName: {
    fontSize: width * 0.07,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  userDate: {
    fontSize: width * 0.04,
    color: '#A1A1A3',
  },
  dashboardContent: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  iconContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'relative',
    alignItems: 'flex-start',
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.04,
  },
  iconCard: {
    width: width * 0.4,
    margin: width * 0.02,
    padding: width * 0.04,
    backgroundColor: '#EEEEEE',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
    alignItems: 'center',
  },
  iconText: {
    fontSize: width * 0.04,
    fontWeight: 'bold',
    color: '#333',
    marginTop: height * 0.01,
  },
  iconValue: {
    fontSize: width * 0.045,
    color: '#134B70',
  },
  sectionTitle: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: height * 0.01,
    marginLeft: width * 0.04,
  },
  requestCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: width * 0.04,
    marginBottom: height * 0.01,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  requestDonor: {
    fontSize: width * 0.04,
    fontWeight: 'bold',
    color: '#333',
  },
  requestDetail: {
    fontSize: width * 0.035,
    color: '#555',
  },
  requestStatus: {
    fontSize: width * 0.035,
    fontWeight: 'bold',
    color: '#508C9B',
  },
  requestActions: {
    flexDirection: 'row',
    marginTop: height * 0.01,
  },
  actionButton: {
    backgroundColor: '#201E43',
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.03,
    borderRadius: 15,
    marginRight: width * 0.02,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: width * 0.035,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.0, // 3% of screen width
    paddingVertical: height * 0.01, // 2.5% of screen height
    backgroundColor: '#201E43',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    elevation: 4,
  },
  navButton: {
    alignItems: 'center',
    flex: 1,
    padding: width * 0.02,
  },
  navButtonText: {
    color: 'white',
    fontSize: width * 0.02,
    marginTop: height * 0.01,
  },
});

export default Orphanage_Dashboard;
