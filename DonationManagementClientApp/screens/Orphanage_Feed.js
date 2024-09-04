import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions, Image, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { Card, ProgressBar } from 'react-native-paper';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// Mock function to fetch orphanage details (replace with real API call)
const fetchOrphanageDetails = async (id) => {
  // Simulate an API call
  const response = await new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: id,
        name: 'Bright Future Orphanage',
        description: 'A safe haven for children in need, providing shelter, education, and care.',
        image: require('../assets/Images/Orphanage1.jpg'),
      });
    }, 1000);
  });
  return response;
};

// Mock project data with progress and location
const projects = [
  { id: '1', title: 'New Playground Construction', description: 'Building a new playground for children.', status: 'Ongoing', progress: 70, location: 'Central Park, City', image: require('../assets/Images/Project1.jpg') },
  { id: '2', title: 'Winter Clothing Drive', description: 'Collecting and distributing winter clothing.', status: 'Upcoming', progress: 0, location: 'Main Hall, Downtown', image: require('../assets/Images/Project2.jpg') },
  // Add more projects as needed
];

const Orphanage_Feed = ({ route, navigation }) => {
  const { orphanageId } = route.params;
  const [orphanageDetails, setOrphanageDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProjects, setFilteredProjects] = useState(projects);

  useEffect(() => {
    const getOrphanageDetails = async () => {
      try {
        const details = await fetchOrphanageDetails(orphanageId);
        setOrphanageDetails(details);
      } catch (error) {
        console.error("Failed to fetch orphanage details", error);
      } finally {
        setLoading(false);
      }
    };
    
    getOrphanageDetails();
  }, [orphanageId]);

  useEffect(() => {
    // Filter projects based on search term
    const searchFilter = projects.filter(project => 
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProjects(searchFilter);
  }, [searchTerm]);

  const renderProjectCard = ({ item }) => (
    <Card style={styles.projectCard}>
      <Image source={item.image} style={styles.projectImage} />
      <View style={styles.projectContent}>
        <Text style={styles.projectTitle}>{item.title}</Text>
        <Text style={styles.projectDescription}>{item.description}</Text>
        <Text style={styles.projectStatus}>{item.status}</Text>
        <View style={styles.progressContainer}>
          <Text style={styles.progressLabel}>Progress: {item.progress}%</Text>
          <ProgressBar progress={item.progress / 100} color="#FF5722" style={styles.progressBar} />
        </View>
        <Text style={styles.projectLocation}>Location: {item.location}</Text>
        <TouchableOpacity style={styles.detailsButton} onPress={() => navigation.navigate('Project_Details', { project: item })}>
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
        <Image source={orphanageDetails.image} style={styles.orphanageImage} />
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
        <FlatList
          data={filteredProjects}
          renderItem={renderProjectCard}
          keyExtractor={(item) => item.id}
        />
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
});

export default Orphanage_Feed;
