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
  const [remainingTimes, setRemainingTimes] = useState({});

  // Fetch orphanage details
  useEffect(() => {
    const fetchOrphanageDetails = async () => {
      try {
        const trimmedOrphanageId = orphanageId?.trim();
        if (!trimmedOrphanageId) {
          Alert.alert("Error", "No orphanageId provided.");
          setLoading(false);
          return;
        }

        const token = await AsyncStorage.getItem('token');
        if (!token) {
          Alert.alert('Unauthorized', 'Please log in again.');
          setLoading(false);
          return;
        }

        const apiUrl = `${API_URL}/Orphanages/getOrphanageById/${trimmedOrphanageId}`;
        const headers = { Authorization: `Bearer ${token}` };

        const response = await axios.get(apiUrl, { headers });
        if (response.data) {
          setOrphanageDetails(response.data.orphanage);
          setFilteredProjects(response.data.projects || []);
          initializeRemainingTimes(response.data.projects || []);
        } else {
          throw new Error("Invalid response structure.");
        }
      } catch (error) {
        console.error("Failed to load orphanage details:", error);
        Alert.alert("Error", `Failed to load orphanage details: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchOrphanageDetails();
  }, [orphanageId]);

  // Calculate initial remaining times for all projects
  const initializeRemainingTimes = (projects) => {
    const times = {};
    projects.forEach((project) => {
      times[project.id] = calculateCountdown(project.endDate);
    });
    setRemainingTimes(times);
  };

  // Update remaining times every second
  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingTimes((prevTimes) => {
        const updatedTimes = {};
        filteredProjects.forEach((project) => {
          updatedTimes[project.id] = calculateCountdown(project.endDate);
        });
        return updatedTimes;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [filteredProjects]);

  // Countdown calculator
  const calculateCountdown = (endDate) => {
    const now = moment();
    const end = moment(endDate);
    const duration = moment.duration(end.diff(now));
    return `${duration.days()}d ${duration.hours()}h ${duration.minutes()}m ${duration.seconds()}s`;
  };

  // Render project card
  const renderProjectCard = ({ item }) => {
    const progress = (item.currentAmount / item.projectedAmount) * 100;
    const remainingTime = remainingTimes[item.id] || 'Loading...';

    return (
      <Card style={styles.projectCard}>
        {item.imageUri && (
          <Image
            source={{ uri: item.imageUri }}
            style={styles.projectImage}
            resizeMode="cover"
          />
        )}
        <View style={styles.projectContent}>
          <Text style={styles.projectTitle}>{item.projectName}</Text>
          <Text style={styles.projectDescription}>{item.description}</Text>

          <View style={styles.projectDetails}>
            <MaterialCommunityIcons name="calendar-check" size={18} color="#FF5722" />
            <Text style={styles.projectStatus}>Status: {item.status}</Text>
          </View>

          <View style={styles.projectDetails}>
            <MaterialCommunityIcons name="shape-outline" size={18} color="#FF5722" />
            <Text style={styles.projectCategory}>Category: {item.category}</Text>
          </View>

          <View style={styles.projectDetails}>
            <MaterialCommunityIcons name="cash" size={18} color="#FF5722" />
            <Text style={styles.projectAmount}>Projected Amount: ${item.projectedAmount}</Text>
          </View>

          <View style={styles.progressContainer}>
            <Text style={styles.progressLabel}>Progress: {progress.toFixed(2)}%</Text>
            <ProgressBar progress={progress / 100} color="#FF5722" style={styles.progressBar} />
          </View>

          <View style={styles.projectDetails}>
            <MaterialCommunityIcons name="clock-outline" size={18} color="#FF5722" />
            <Text style={styles.countdown}>Time Left: {remainingTime}</Text>
          </View>

          <TouchableOpacity
            style={styles.detailsButton}
            onPress={() => navigation.navigate('Project_Details', { project: item })}
          >
            <Text style={styles.detailsButtonText}>Donate</Text>
            <FontAwesome name="arrow-right" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </Card>
    );
  };

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
            horizontal
            data={filteredProjects}
            renderItem={renderProjectCard}
            keyExtractor={(item) => item.id.toString()}
            showsHorizontalScrollIndicator={false}
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
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  headerDescription: {
    fontSize: 16,
    color: '#D1D1D1',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#FFF',
    borderRadius: 10,
    margin: 10,
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    height: 30,
    paddingLeft: 10,
    fontSize: 16,
  },
  searchIcon: {
    marginLeft: 10,
  },
  scrollView: {
    paddingBottom: 20,
  },
  projectCard: {
    marginHorizontal: 10,
    marginVertical: 10,
    width: width * 0.8,
    borderRadius: 15,
    elevation: 5,
    backgroundColor: 'white',
    padding: 15,
  },
  projectImage: {
    width: '100%',
    height: 200,
    borderRadius: 15,
  },
  projectContent: {
    paddingTop: 10,
  },
  projectTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  projectDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  projectDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  projectStatus: {
    marginLeft: 10,
    fontSize: 14,
  },
  projectCategory: {
    marginLeft: 10,
    fontSize: 14,
  },
  projectType: {
    marginLeft: 10,
    fontSize: 14,
  },
  projectAmount: {
    marginLeft: 10,
    fontSize: 14,
  },
  progressContainer: {
    marginTop: 10,
  },
  progressLabel: {
    fontSize: 14,
    color: '#333',
  },
  progressBar: {
    marginTop: 5,
  },
  projectLocation: {
    marginLeft: 10,
    fontSize: 14,
  },
  countdown: {
    marginLeft: 10,
    fontSize: 14,
    color: '#FF5722',
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: '#001F3F',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 30,
    justifyContent: 'center',
  },
  detailsButtonText: {
    color: 'white',
    fontSize: 16,
    marginRight: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noProjectsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  noProjectsText: {
    fontSize: 16,
    color: '#FF5722',
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#FF5722',
  },
});

export default Orphanage_Feed;
