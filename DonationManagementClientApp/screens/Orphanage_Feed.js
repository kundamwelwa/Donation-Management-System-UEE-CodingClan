import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions, Image, TextInput, ScrollView, ActivityIndicator, Alert, StatusBar } from 'react-native';
import { Card, ProgressBar } from 'react-native-paper';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';
import moment from 'moment';

const { width, height } = Dimensions.get('window');

const Orphanage_Feed = ({ route, navigation }) => {
  const { orphanageId } = route.params;
  const [orphanageDetails, setOrphanageDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProjects, setFilteredProjects] = useState([]);

  useEffect(() => {
    const fetchOrphanageDetails = async () => {
      try {
        const trimmedOrphanageId = orphanageId?.trim();
        if (!trimmedOrphanageId) {
          console.error("No orphanageId provided.");
          throw new Error("No orphanageId provided.");
        }

        const token = await AsyncStorage.getItem('token');
        if (!token) throw new Error('Unauthorized. Please log in again.');

        const apiUrl = `${API_URL}/Orphanages/getOrphanageById/${trimmedOrphanageId}`;
        const headers = { Authorization: `Bearer ${token}` };

        const response = await axios.get(apiUrl, { headers });

        if (response.data) {
          setOrphanageDetails(response.data.orphanage);
          setFilteredProjects(response.data.projects || []);
        } else {
          console.error("Invalid response structure");
          Alert.alert("Error", "Invalid response structure.");
        }
      } catch (error) {
        console.error("Failed to load orphanage details:", error);
        Alert.alert("Error", "Failed to load orphanage details.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrphanageDetails();
  }, [orphanageId]);

  useEffect(() => {
    if (orphanageDetails?.projects) {
      const searchFilter = orphanageDetails.projects.filter((project) =>
        project.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProjects(searchFilter);
    }
  }, [searchTerm, orphanageDetails]);

  const calculateCountdown = (startDate) => {
    const now = moment();
    const start = moment(startDate);
    const duration = moment.duration(start.diff(now));

    return `${duration.days()}d ${duration.hours()}h ${duration.minutes()}m ${duration.seconds()}s`;
  };

  const renderProjectCard = ({ item }) => (
    <Card style={styles.projectCard}>
      <Image source={{ uri: item.image }} style={styles.projectImage} />
      <View style={styles.projectContent}>
        <Text style={styles.projectTitle}>{item.projectName}</Text>
        <Text style={styles.projectDescription}>{item.description}</Text>
        <Text style={styles.projectStatus}>Status: {item.status}</Text>
        <Text style={styles.projectCategory}>Category: {item.category}</Text>
        <Text style={styles.projectType}>Type: {item.projectType}</Text>
        <Text style={styles.projectAmount}>Projected Amount: ${item.projectedAmount}</Text>
        <View style={styles.progressContainer}>
          <Text style={styles.progressLabel}>Progress: {item.progress}%</Text>
          <ProgressBar progress={item.progress / 100} color="#FF5722" style={styles.progressBar} />
        </View>
        <Text style={styles.projectLocation}>Location: {item.location}</Text>
        <Text style={styles.countdown}>Starts in: {calculateCountdown(item.startDate)}</Text>
        <TouchableOpacity 
          style={styles.detailsButton} 
          onPress={() => navigation.navigate('Project_Details', { project: item })}
        >
          <Text style={styles.detailsButtonText}>View Details</Text>
          <FontAwesome name="arrow-right" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF5722" />
      </View>
    );
  }

  if (!orphanageDetails) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load orphanage details.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* StatusBar component */}
      <StatusBar barStyle="light-content" backgroundColor="#495464" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>{orphanageDetails.name}</Text>
        <Text style={styles.headerDescription}>{orphanageDetails.physicalAddress}</Text>
        <Text style={styles.headerDescription}>Number of Children: {orphanageDetails.numberOfChildren}</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search projects..."
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        <TouchableOpacity style={styles.searchIcon}>
          <MaterialCommunityIcons name="magnify" size={24} color="#201E43" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollView}>
        {filteredProjects.length === 0 ? (
          <View style={styles.noProjectsContainer}>
            <Text style={styles.noProjectsText}>No projects listed yet for this orphanage.</Text>
          </View>
        ) : (
          <FlatList
            data={filteredProjects}
            renderItem={renderProjectCard}
            keyExtractor={(item) => item.id.toString()}
          />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: height * 0.04,
    flex: 1,
    backgroundColor: '#F7F7F7',
    paddingHorizontal: 1,
  },
  header: {
    paddingVertical: height * 0.04,
    paddingTop: height * 0.06,
    backgroundColor: '#201E43',
    borderRadius: 10,
    marginBottom: height * 0.02,
    paddingHorizontal: width * 0.08,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 3,
  },
  headerTitle: {
    fontSize: width * 0.08,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerDescription: {
    fontSize: width * 0.04,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    marginTop: 20,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 15,
    elevation: 3,
    width: '90%',  // Set the width to 90% of the screen width
    alignSelf: 'center',  // This will center the search container horizontally
},
  searchInput: {
    flex: 1,
    height: height * 0.06,
    fontSize: width * 0.04,
    color: '#333333',
    
  },
  searchIcon: {
    paddingHorizontal: 10,
  },
  scrollView: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  projectCard: {
    marginBottom: 20,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    padding: 15,
  },
  projectImage: {
    width: '100%',
    height: width * 0.45,
    borderRadius: 15,
    marginBottom: 10,
    resizeMode: 'cover',
  },
  projectContent: {
    paddingTop: 10,
  },
  projectTitle: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: '#333333',
  },
  projectDescription: {
    fontSize: width * 0.04,
    color: '#555555',
    marginTop: 5,
    marginBottom: 10,
  },
  projectStatus: {
    fontSize: width * 0.04,
    color: '#FF5722',
  },
  projectCategory: {
    fontSize: width * 0.04,
    color: '#777777',
  },
  projectType: {
    fontSize: width * 0.04,
    color: '#777777',
  },
  projectAmount: {
    fontSize: width * 0.04,
    color: '#201E43',
    marginTop: 10,
  },
  progressContainer: {
    marginTop: 10,
  },
  progressLabel: {
    fontSize: width * 0.04,
    color: '#777777',
  },
  progressBar: {
    marginTop: 10,
  },
  projectLocation: {
    fontSize: width * 0.04,
    color: '#555555',
    marginTop: 10,
  },
  countdown: {
    fontSize: width * 0.04,
    color: '#201E43',
    marginTop: 10,
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    paddingVertical: 12,
    backgroundColor: '#FF5722',
    borderRadius: 25,
    justifyContent: 'center',
  },
  detailsButtonText: {
    fontSize: width * 0.04,
    color: '#FFFFFF',
    marginRight: 8,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: width * 0.05,
    color: '#FF5722',
  },
  noProjectsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: height * 0.05,
  },
  noProjectsText: {
    fontSize: width * 0.05,
    color: '#666666',
  },
});

export default Orphanage_Feed;
