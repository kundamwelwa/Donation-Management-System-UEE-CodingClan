import React, { cloneElement, useState } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import { Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const { width, height } = Dimensions.get('window');

const Donor_Profile = () => {
  const [bioExpanded, setBioExpanded] = useState(false);

  return (
    <ScrollView style={styles.container}>
      {/* User Card with Cover Photo */}
      <Card style={styles.userCard}>
        <View style={styles.coverContainer}>
          <Image
            source={require('../assets/Images/Cover1.jpg')}
            style={styles.coverPhoto}
          />
        </View>
        <View style={styles.userInfo}>
          <Image
            source={require('../assets/Images/User1.jpg')}
            style={styles.profilePhoto}
          />
          <View style={styles.userDetailsContainer}>
            <View style={styles.userDetails}>
              <Text style={styles.userName}>Micheal Ghost</Text>
              <Text style={styles.userEmail}>Michealghost@gmail.com</Text>
            </View>
            <View style={styles.socialMediaIcons}>
              <TouchableOpacity style={styles.iconButton}>
                <AntDesign name="twitter" size={20} color="#1DA1F2" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <FontAwesome name="facebook" size={20} color="#1877F2" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <FontAwesome name="instagram" size={20} color="#C13584" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Card>

      {/* Edit Profile and Settings Buttons Side by Side */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button}>
          <Icon name="edit" size={20} color="#fff" />
          <Text style={styles.buttonText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Icon name="settings" size={20} color="#fff" />
          <Text style={styles.buttonText}>Settings</Text>
        </TouchableOpacity>
      </View>

      {/* Biography Section */}
      <TouchableOpacity onPress={() => setBioExpanded(!bioExpanded)}>
        <Card style={styles.bioCard}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="account" size={20} color="#333" />
            <Text style={styles.bioHeader}>Biography</Text>
          </View>
          <Text style={styles.bioText}>
            Passionate donor, involved in various charitable activities, focusing on child welfare and education.
            {bioExpanded ? (
              <Text style={styles.fullBioText}>
                {"\n"}Full biography text displayed here when expanded.
              </Text>
            ) : (
              <Text style={styles.expandText}>...Read more</Text>
            )}
          </Text>
        </Card>
      </TouchableOpacity>

      {/* Other Sections */}
      <Card style={styles.favoritesCard}>
        <View style={styles.cardHeader}>
          <MaterialCommunityIcons name="heart" size={20} color="#333" />
          <Text style={styles.sectionHeader}>Favorite Causes</Text>
        </View>
        <Text style={styles.sectionText}>Orphanage 1, Orphanage 2, Child Education</Text>
      </Card>

      <Card style={styles.achievementsCard}>
        <View style={styles.cardHeader}>
          <MaterialCommunityIcons name="trophy" size={20} color="#333" />
          <Text style={styles.sectionHeader}>Achievements</Text>
        </View>
        <Text style={styles.sectionText}>Gold Donor Badge, 100 Donations Milestone</Text>
      </Card>

      <Card style={styles.messagesCard}>
        <View style={styles.cardHeader}>
          <MaterialCommunityIcons name="message" size={20} color="#333" />
          <Text style={styles.sectionHeader}>Messages</Text>
        </View>
        <Text style={styles.sectionText}>Thank you for your support! - Orphanage 1</Text>
      </Card>

      <Card style={styles.paymentCard}>
        <View style={styles.cardHeader}>
          <MaterialCommunityIcons name="credit-card" size={20} color="#333" />
          <Text style={styles.sectionHeader}>Payment Methods</Text>
        </View>
        <Text style={styles.sectionText}>Visa **** 1234, PayPal john@example.com</Text>
      </Card>

      <Card style={styles.privacyCard}>
        <View style={styles.cardHeader}>
          <MaterialCommunityIcons name="shield" size={20} color="#333" />
          <Text style={styles.sectionHeader}>Privacy Settings</Text>
        </View>
        <Text style={styles.sectionText}>Donations visible to public</Text>
      </Card>

      <Card style={styles.communicationCard}>
        <View style={styles.cardHeader}>
          <MaterialCommunityIcons name="bell" size={20} color="#333" />
          <Text style={styles.sectionHeader}>Communication Preferences</Text>
        </View>
        <Text style={styles.sectionText}>Email: Enabled, SMS: Disabled, App Notifications: Enabled</Text>
      </Card>

      {/* Logout Button */}
      <TouchableOpacity style={[styles.button, styles.logoutButton]}>
        <Icon name="logout" size={20} color="#fff" />
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: height * 0.05,
    marginBottom: height * 0.02,
  },
  userCard: {
    backgroundColor: '#EEF7FF',
    marginBottom: height * 0.02,
    overflow: 'hidden',
  },
  coverContainer: {
    width: '100%',
    height: height * 0.2,
  },
  coverPhoto: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    resizeMode: 'cover',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -height * 0.05,
    paddingHorizontal: width * 0.04,
  },
  profilePhoto: {
    width: width * 0.25,
    height: width * 0.25,
    borderRadius: width * 0.125,
    borderWidth: 2,
    borderColor: '#EEF7FF',
    marginRight: width * 0.04,
  },
  userDetailsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userDetails: {
    flex: 1,
    marginTop: height * 0.05,
  },
  userName: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: '#1A2130',
  },
  userEmail: {
    fontSize: width * 0.04,
    color: '#1A2130',
  },
  socialMediaIcons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  iconButton: {
    marginLeft: width * 0.02,
    marginTop: height * 0.07,

  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: height * 0.02,
    marginLeft: 7,
    marginRight: 7,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#201E43',
    padding: width * 0.03,
    borderRadius: 20,
    width: width * 0.43,
  },
  buttonText: {
    color: '#fff',
    fontSize: width * 0.04,
    marginLeft: 8,
  },
  bioCard: {
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.04,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: height * 0.02,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.01,
  },
  bioHeader: {
    fontSize: width * 0.04,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  bioText: {
    fontSize: width * 0.04,
    color: '#555',
  },
  fullBioText: {
    fontSize: width * 0.04,
    color: '#555',
    marginTop: 4,
  },
  expandText: {
    color: '#1E90FF',
    marginTop: 4,
  },
  favoritesCard: {
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.04,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: height * 0.02,
    elevation: 3,
  },
  achievementsCard: {
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.04,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: height * 0.02,
    elevation: 3,
  },
  messagesCard: {
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.04,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: height * 0.02,
    elevation: 3,
  },
  paymentCard: {
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.04,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: height * 0.02,
    elevation: 3,
  },
  privacyCard: {
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.04,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: height * 0.02,
    elevation: 3,
  },
  communicationCard: {
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.04,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: height * 0.02,
    elevation: 3,
  },
  sectionHeader: {
    fontSize: width * 0.04,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  sectionText: {
    fontSize: width * 0.04,
    color: '#555',
  },
  logoutButton: {
    backgroundColor: '#FF204E',
    marginTop: height * 0.02,
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 30,
  },
});

export default Donor_Profile;
