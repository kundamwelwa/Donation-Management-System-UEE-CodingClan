import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  Dimensions, 
  ScrollView, 
  LayoutAnimation,
  Animated // Import Animated
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import StatusBarManager from '../Component/StatusBarManager';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const orphanageRequests = [
  { id: '1', donor: 'John Doe', request: 'Food Supplies', status: 'Pending' },
  { id: '2', donor: 'Jane Smith', request: 'Clothing', status: 'Approved' },
  // Add more requests as needed
];

const Orphanage_Dashboard = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [currentDate, setCurrentDate] = useState('');
  const [isFabOpen, setIsFabOpen] = useState(false); // Added state for FAB
  const navigation = useNavigation();

  // Create animated value for the welcome message
  const welcomeOpacity = useRef(new Animated.Value(0)).current;
  const welcomeTranslateY = useRef(new Animated.Value(-10)).current;

  // Animated values for FAB buttons
  const fabAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Set the current date dynamically
    const date = new Date();
    const formattedDate = date.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' });
    setCurrentDate(formattedDate);

    // Trigger the welcome message animation
    Animated.sequence([
      Animated.timing(welcomeTranslateY, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(welcomeOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const toggleFab = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsFabOpen(!isFabOpen);
    Animated.timing(fabAnimation, {
      toValue: isFabOpen ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // Define the fabButtonStyle function
  const fabButtonStyle = (order) => ({
    transform: [
      {
        translateY: fabAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -(order * 60)],
        }),
      },
      {
        scale: fabAnimation,
      },
    ],
    opacity: fabAnimation,
  });

  const changeSection = (section) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setActiveSection(section);
  };

  const handleViewRequest = (id) => {
    console.log(`Viewing request with ID: ${id}`);
  };

  const handleApproveRequest = (id) => {
    console.log(`Approving request with ID: ${id}`);
  };

  const handleRejectRequest = (id) => {
    console.log(`Rejecting request with ID: ${id}`);
  };

  return (
    <View style={styles.container}>
      <StatusBarManager backgroundColor="#201E43" barStyle="light-content" />

      <View style={styles.userCard}>
        {/* Animated Welcome Message */}
        <Animated.Text 
          style={[
            styles.welcomeText, 
            { 
              opacity: welcomeOpacity,
              transform: [{ translateY: welcomeTranslateY }]
            }
          ]}
        >
          WELCOME
        </Animated.Text>
        <Text style={styles.userName}>CHAPAMO FOREVER ORPHANAGE!</Text>
        <Text style={styles.userDate}>{currentDate}</Text>
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
                  <TouchableOpacity style={styles.actionButton} onPress={() => handleViewRequest(item.id)}>
                    <Text style={styles.actionButtonText}>View</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton} onPress={() => handleApproveRequest(item.id)}>
                    <Text style={styles.actionButtonText}>Approve</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton} onPress={() => handleRejectRequest(item.id)}>
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
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Statistics_Screen')}>
          <FontAwesome name="line-chart" size={24} color="white" />
          <Text style={styles.navButtonText}>Statistics</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => console.log('Navigate to Notifications')}>
          <FontAwesome name="bell" size={24} color="white" />
          <Text style={styles.navButtonText}>Notifications</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Orphanage_profile')}>
          <FontAwesome name="user" size={24} color="white" />
          <Text style={styles.navButtonText}>Profile</Text>
        </TouchableOpacity>
      </View>

       {/* Floating Action Button */}
      <View style={styles.fabContainer}>
        <TouchableOpacity onPress={() => console.log('Add a Campaign')} style={[styles.fabButton, fabButtonStyle(1)]}>
          <FontAwesome name="bullhorn" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Project_Listing')} style={[styles.fabButton, fabButtonStyle(2)]}>
          <FontAwesome name="tasks" size={24} color="white" />
        </TouchableOpacity>
        {/* Add more buttons if necessary */}
        <TouchableOpacity onPress={toggleFab} style={styles.fabMain}>
          <FontAwesome name={isFabOpen ? 'times' : 'plus'} size={24} color="white" />
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
    paddingVertical: height * 0.1,
    paddingHorizontal: width * 0.07,
    backgroundColor: '#201E43',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: height * 0.02,
    alignItems: 'center',
  },
  welcomeText: {
    marginVertical: height * -0.07,
    fontSize: width * 0.08,
    fontWeight: 'bold',
    color: '#F0F8FF',
    marginBottom: height * 0.02,
  },
  userName: {
    fontSize: width * 0.07,
    fontWeight: 'bold',
    color: '#508C9B',
    marginBottom: height * 0.02,
  },
  userDate: {
    fontSize: width * 0.04,
    color: '#EEEEEE',
  },
  dashboardContent: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  iconContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
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
    marginBottom: height * 0.01,
  },
  requestDetail: {
    fontSize: width * 0.035,
    color: '#666',
  },
  requestStatus: {
    fontSize: width * 0.035,
    color: '#134B70',
    marginBottom: height * 0.01,
  },
  requestActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: height * 0.01,
  },
  actionButton: {
    backgroundColor: '#134B70',
    padding: width * 0.02,
    borderRadius: 15,
  },
  actionButtonText: {
    color: '#FFF',
    fontSize: width * 0.035,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#201E43',
    height: height * 0.08,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
  },
  navButton: {
    alignItems: 'center',
  },
  navButtonText: {
    color: '#FFFFFF',
    fontSize: width * 0.03,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    
  },
  fabMain: {
    marginVertical: height * 0.00,
    backgroundColor: '#201E43',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabButton: {
    position: 'absolute',
    right: 0,
    backgroundColor: '#134B70',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Orphanage_Dashboard;
