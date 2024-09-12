import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions, Image, LayoutAnimation, StatusBar, ActivityIndicator } from 'react-native';
import { Card } from 'react-native-paper';
import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';
import { Config } from 'react-native-config'; // Import as named import

const { width, height } = Dimensions.get('window');

const Donor_Dashboard = ({ navigation }) => {
  const [activeSection, setActiveSection] = useState('home');
  const [notificationCount, setNotificationCount] = useState(5); // Replace with dynamic data
  const [currentDate, setCurrentDate] = useState('');
  const [userName, setUserName] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [orphanageCards, setOrphanageCards] = useState([]);
  const [donationHistory, setDonationHistory] = useState([]);
  const [ongoingCampaigns, setOngoingCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getToken(); // Function to get token from your secure storage
        const headers = { 'Authorization': `Bearer ${token}` };

        const userResponse = await axios.get(`${Config.API_URL}/api/user`, { headers });
        setUserName(userResponse.data.name);

        const orphanagesResponse = await axios.get(`${Config.API_URL}/api/orphanages`, { headers });
        setOrphanageCards(orphanagesResponse.data);

        const donationsResponse = await axios.get(`${Config.API_URL}/api/donations`, { headers });
        setDonationHistory(donationsResponse.data);

        const campaignsResponse = await axios.get(`${Config.API_URL}/api/campaigns`, { headers });
        setOngoingCampaigns(campaignsResponse.data);

        const date = new Date().toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
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
    StatusBar.setBackgroundColor(backgroundColor);
  }, [backgroundColor]);

  const getToken = async () => {
    return 'Y048e0fbf2ca51a2e24adb847077ef0871b795a1bc1bbbbd7ce4008b2a182921a6472590fa8be1ee7e5e0947d9b6fa836a07edec7d36fb83df9d8f7a426810bcf'; 
  };

  const changeSection = (section) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setActiveSection(section);
  };

  const renderOrphanageCard = ({ item }) => (
    <Card key={item.id} style={styles.card}>
      <View style={styles.coverPhotoContainer}>
        <Image source={{ uri: item.coverPhoto }} style={styles.coverPhoto} />
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
          <View>
            {orphanageCards.length > 0 ? (
              <FlatList
                data={orphanageCards}
                renderItem={renderOrphanageCard}
                keyExtractor={item => item.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.orphanageCards}
              />
            ) : (
              <View style={styles.noOrphanagesContainer}>
                <Text style={styles.noOrphanagesText}>You don’t have any Orphanages yet</Text>
                <Text style={styles.searchInstruction}>Search for orphanages by hitting the Donate button</Text>
              </View>
            )}
          </View>
        );
      case 'donationHistory':
        return (
          <>
            <FlatList
              data={donationHistory}
              renderItem={renderDonationHistory}
              keyExtractor={item => item.id.toString()}
              style={styles.historyList}
            />
            <FlatList
              data={ongoingCampaigns}
              renderItem={renderCampaign}
              keyExtractor={item => item.id.toString()}
              style={styles.campaignList}
            />
          </>
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
    <View style={[styles.container, { backgroundColor }]}>
      <StatusBar backgroundColor="#201E43" barStyle="light-content" />

      <View style={styles.userCard}>
        <Text style={styles.userName}>Welcome, {userName}!</Text>
        <Text style={styles.userDate}>{currentDate}</Text>
      </View>

      <View style={styles.spacer} />

      {activeSection === 'home' && (
        <>
          <FlatList
            data={orphanageCards}
            renderItem={renderOrphanageCard}
            keyExtractor={item => item.id.toString()}
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
  coverPhotoContainer: {
    height: '60%',
    overflow: 'hidden',
  },
  cardFooter: {
    paddingVertical: width * 0.03,
    paddingHorizontal: width * 0.02,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    width: '100%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: '#201E43',
  },
  exploreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: width * 0.02,
    backgroundColor: '#201E43',
    borderRadius: 5,
  },
  exploreButtonText: {
    fontSize: width * 0.04,
    color: 'white',
    marginRight: width * 0.01,
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
    top: 0,
    right: 0,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    fontSize: 12,
    color: 'white',
  },
  noOrphanagesContainer: {
    alignItems: 'center',
    marginTop: height * 0.1,
  },
  noOrphanagesText: {
    fontSize: width * 0.04,
    color: '#201E43',
    textAlign: 'center',
  },
  searchInstruction: {
    fontSize: width * 0.03,
    color: '#201E43',
    textAlign: 'center',
    marginTop: height * 0.02,
  },
  historyList: {
    marginBottom: height * 0.03,
  },
  historyCard: {
    padding: width * 0.05,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginBottom: height * 0.02,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  historyDate: {
    fontSize: width * 0.04,
    color: '#201E43',
  },
  historyAmount: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: '#201E43',
  },
  historyCampaign: {
    fontSize: width * 0.04,
    color: '#CCCCCC',
  },
  campaignList: {
    marginBottom: height * 0.03,
  },
  campaignCard: {
    padding: width * 0.05,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginBottom: height * 0.02,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  campaignName: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: '#201E43',
  },
  campaignStatus: {
    fontSize: width * 0.04,
    color: '#CCCCCC',
  },
});

export default Donor_Dashboard;
