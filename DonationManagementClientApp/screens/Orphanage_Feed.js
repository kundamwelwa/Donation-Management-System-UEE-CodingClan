import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions, Image, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { Card, ProgressBar } from 'react-native-paper';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';

const { width, height } = Dimensions.get('window');

const Orphanage_Feed = ({ route, navigation }) => {
  const { getOrphanageById } = route.params;
  const [orphanageDetails, setOrphanageDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProjects, setFilteredProjects] = useState([]);

  useEffect(() => {
    const fetchOrphanageDetails = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          throw new Error('Unauthorized. Please log in again.');
        }

        const headers = { Authorization: `Bearer ${token}` };
        const apiUrl = API_URL || 'http://192.168.43.189:5001/api';

        // Log the ID being used for fetching
        console.log('Fetching orphanage details for ID:', getOrphanageById);

        // Fetch orphanage details including projects
        const response = await axios.get(`${apiUrl}/orphanages/${getOrphanageById}`, { headers });
        setOrphanageDetails(response.data);
        setFilteredProjects(response.data.projects || []);  // Assuming 'projects' is part of orphanage data
      } catch (error) {
        if (error.response) {
          console.error("Response error:", error.response.data);
          console.error("Response status:", error.response.status);
          alert("Failed to load orphanage details: " + error.response.data.message);
        } else if (error.request) {
          console.error("Request error:", error.request);
          alert("Failed to load orphanage details. No response from server.");
        } else {
          console.error("General error:", error.message);
          alert("Failed to load orphanage details. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrphanageDetails();
  }, [getOrphanageById]);

  useEffect(() => {
    // Filter projects based on search term
    const searchFilter = (orphanageDetails?.projects || []).filter(project => 
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProjects(searchFilter);
  }, [searchTerm, orphanageDetails]);

  const renderProjectCard = ({ item }) => (
    <Card style={styles.projectCard}>
      <Image source={{ uri: item.image }} style={styles.projectImage} />
      <View style={styles.projectContent}>
        <Text style={styles.projectTitle}>{item.title}</Text>
        <Text style={styles.projectDescription}>{item.description}</Text>
        <Text style={styles.projectStatus}>{item.status}</Text>
        <View style={styles.progressContainer}>
          <Text style={styles.progressLabel}>Progress: {item.progress}%</Text>
          <ProgressBar progress={item.progress / 100} color="#FF5722" style={styles.progressBar} />
        </View>
        <Text style={styles.projectLocation}>Location: {item.location}</Text>
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
        <ActivityIndicator size="large" color="#201E43" />
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
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{orphanageDetails.name}</Text>
        <Text style={styles.headerDescription}>{orphanageDetails.description}</Text>
        <Image source={{ uri: orphanageDetails.image }} style={styles.orphanageImage} />
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search projects..."
            placeholderTextColor="#888888"
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
          <TouchableOpacity style={styles.searchIcon}>
            <MaterialCommunityIcons name="magnify" size={24} color="#201E43" />
          </TouchableOpacity>
        </View>
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
            keyExtractor={(item) => item.id.toString()} // Ensure the id is converted to a string
          />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    paddingVertical: height * 0.02,
    backgroundColor: '#201E43',
    marginBottom: height * 0.02,
    alignItems: 'center',
    paddingHorizontal: width * 0.04,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
  },
  headerTitle: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerDescription: {
    fontSize: width * 0.04,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: height * 0.02,
  },
  orphanageImage: {
    width: '100%',
    height: width * 0.4,
    resizeMode: 'cover',
    borderRadius: 10,
    marginBottom: height * 0.02,
  },
  searchContainer: {
    flexDirection: 'row',
    marginTop: height * 0.02,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: width * 0.02,
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    height: height * 0.06,
    fontSize: width * 0.04,
  },
  searchIcon: {
    paddingHorizontal: width * 0.02,
  },
  scrollView: {
    flexGrow: 1,
  },
  projectCard: {
    marginBottom: height * 0.02,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    marginHorizontal: width * 0.02,
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  projectImage: {
    width: '100%',
    height: width * 0.4,
    resizeMode: 'cover',
  },
  projectContent: {
    padding: width * 0.04,
  },
  projectTitle: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: '#201E43',
    marginBottom: height * 0.01,
  },
  projectDescription: {
    fontSize: width * 0.04,
    color: '#666666',
    marginBottom: height * 0.01,
  },
  projectStatus: {
    fontSize: width * 0.04,
    color: '#FF5722',
    marginBottom: height * 0.02,
  },
  progressContainer: {
    marginBottom: height * 0.02,
  },
  progressLabel: {
    fontSize: width * 0.04,
    color: '#201E43',
    marginBottom: height * 0.01,
  },
  progressBar: {
    height: height * 0.02,
    borderRadius: 10,
  },
  projectLocation: {
    fontSize: width * 0.04,
    color: '#888888',
    marginBottom: height * 0.02,
  },
  detailsButton: {
    backgroundColor: '#201E43',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.04,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsButtonText: {
    color: '#FFFFFF',
    fontSize: width * 0.04,
    marginRight: width * 0.02,
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
    color: '#FF0000',
  },

  // New styles for the no projects alert
  noProjectsContainer: {
    padding: height * 0.02,
    borderRadius: 10,
    backgroundColor: '#FFEB3B',
    alignItems: 'center',
    marginVertical: height * 0.02,
    marginHorizontal: width * 0.02,
  },
  noProjectsText: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    color: '#201E43',
    textAlign: 'center',
  },

});

export default Orphanage_Feed;
