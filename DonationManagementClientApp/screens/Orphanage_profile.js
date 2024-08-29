import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import { Card } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker'; // Importing ImagePicker for uploading images
import Icon from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const { width, height } = Dimensions.get('window');

const Orphanage_profile = () => {
  const [bioExpanded, setBioExpanded] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(require('../assets/Images/Orphanageuser1.jpg'));
  const [coverPhoto, setCoverPhoto] = useState(require('../assets/Images/Orphanagecover1.jpg'));

  const pickImage = async (setImage) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage({ uri: result.uri });
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Orphanage Card with Cover Photo */}
      <Card style={styles.userCard}>
        <View style={styles.coverContainer}>
          <TouchableOpacity onPress={() => pickImage(setCoverPhoto)}>
            <Image source={coverPhoto} style={styles.coverPhoto} />
          </TouchableOpacity>
        </View>
        <View style={styles.userInfo}>
          <TouchableOpacity onPress={() => pickImage(setProfilePhoto)}>
            <Image source={profilePhoto} style={styles.profilePhoto} />
          </TouchableOpacity>
          <View style={styles.userDetailsContainer}>
            <View style={styles.userDetails}>
              <Text style={styles.userName}>Hope Orphanage</Text>
              <Text style={styles.userEmail}>hopeorphanage@example.com</Text>
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
            We are dedicated to providing a loving home and quality education to orphans.
            {bioExpanded ? (
              <Text style={styles.fullBioText}>
                {"\n"}Founded in 1995, Hope Orphanage has been a beacon of hope for children in need. We provide shelter, education, and healthcare to over 100 children each year.
              </Text>
            ) : (
              <Text style={styles.expandText}>...Read more</Text>
            )}
          </Text>
        </Card>
      </TouchableOpacity>

      {/* Recent Projects Section */}
      <Card style={styles.projectsCard}>
        <View style={styles.cardHeader}>
          <MaterialCommunityIcons name="lightbulb-on-outline" size={20} color="#333" />
          <Text style={styles.projectsHeader}>Recent Projects</Text>
        </View>
        <Text style={styles.projectText}>
          - New dormitory construction completed in June 2024.
          - Launched a vocational training program for older children.
          - Hosted a community health camp in July 2024.
        </Text>
      </Card>

      {/* Donation Options Section */}
      <Card style={styles.donationCard}>
        <View style={styles.cardHeader}>
          <FontAwesome name="handshake-o" size={20} color="#333" />
          <Text style={styles.donationHeader}>Donation Options</Text>
        </View>
        <Text style={styles.donationText}>
          You can support us by donating items such as food, clothing, and books, or through monetary contributions.
        </Text>
      </Card>

      {/* Privacy and Communication Settings */}
      <Card style={styles.settingsCard}>
        <View style={styles.cardHeader}>
          <MaterialCommunityIcons name="shield-outline" size={20} color="#333" />
          <Text style={styles.settingsHeader}>Privacy Settings</Text>
        </View>
        <Text style={styles.settingsText}>
          Manage your privacy settings and communication preferences.
        </Text>
      </Card>

      {/* Logout Option */}
      <TouchableOpacity style={styles.logoutButton}>
        <AntDesign name="logout" size={20} color="#fff" />
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    marginBottom: height * 0.02,
  },
  userCard: {
    width: '100%',
    marginBottom: 20,
    paddingBottom: height * -0.01,
    backgroundColor: '#EEEEEE',
    borderLeftRadius: 30,
  },
  coverContainer: {
    position: 'relative',
  },
  coverPhoto: {
    width: '100%',
    height: height * 0.2,
  },
  userInfo: {
    flexDirection: 'row',
    padding: width * 0.04,
  },
  profilePhoto: {
    width: width * 0.27,
    height: width * 0.27,
    borderRadius: width * 0.130,
    borderWidth: 2,
    borderColor: '#EEF7FF',
    marginTop: -width * 0.1,
  },
  userDetailsContainer: {
    paddingHorizontal: width * 0.04,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between', // Make the user details and icons adapt
  },
  userDetails: {
    marginBottom: width * 0.02,
    maxWidth: '60%', // Adjust to ensure responsive text wrapping
  },
  userName: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: '#333',
  },
  userEmail: {
    fontSize: width * 0.035,
    color: '#777',
  },
  socialMediaIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginRight: width * 0.03,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: width * 0.05,
    paddingHorizontal: width * 0.03,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#201E43',
    paddingVertical: width * 0.03,
    paddingHorizontal: width * 0.05,
    borderRadius: 20,
    flex: 1,
    marginHorizontal: width * 0.02,
  },
  buttonText: {
    color: '#fff',
    marginLeft: width * 0.02,
    fontSize: width * 0.04,
  },
  bioCard: {
    marginBottom: 0,
    padding: width * 0.04,
    borderRadius: 0,
    backgroundColor: '#EEEEEE',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: width * 0.03,
  },
  bioHeader: {
    marginLeft: width * 0.03,
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
  bioText: {
    fontSize: width * 0.035,
    color: '#555',
  },
  fullBioText: {
    fontSize: width * 0.035,
    color: '#555',
  },
  expandText: {
    color: '#0066cc',
    marginTop: width * 0.01,
  },
  projectsCard: {
    marginBottom: 0,
    padding: width * 0.04,
    borderRadius: 0,
    backgroundColor: '#EEEEEE',
  },
  projectsHeader: {
    marginLeft: width * 0.03,
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
  projectText: {
    fontSize: width * 0.035,
    color: '#555',
  },
  donationCard: {
    marginBottom: 0,
    padding: width * 0.04,
    borderRadius: 0,
    backgroundColor: '#EEEEEE',
  },
  donationHeader: {
    marginLeft: width * 0.03,
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
  donationText: {
    fontSize: width * 0.035,
    color: '#555',
  },
  settingsCard: {
    marginBottom: width * 0.05,
    padding: width * 0.04,
    borderRadius: 0,
    backgroundColor: '#EEEEEE',
  },
  settingsHeader: {
    marginLeft: width * 0.03,
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
  settingsText: {
    fontSize: width * 0.035,
    color: '#555',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff3b30',
    paddingVertical: width * 0.04,
    marginHorizontal: width * 0.3,
    borderRadius: 30,
    marginBottom: height * 0.04,
  },
  logoutButtonText: {
    color: '#fff',
    marginLeft: width * 0.02,
    fontSize: width * 0.04,
  },
});

export default Orphanage_profile;
