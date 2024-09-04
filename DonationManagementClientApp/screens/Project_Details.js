import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { Card, ProgressBar } from 'react-native-paper';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import StatusBarManager from '../Component/StatusBarManager';

const { width, height } = Dimensions.get('window');

const Project_Details = ({ route, navigation }) => {
  const { project } = route.params;

  if (!project) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No project details available.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Image source={project.image} style={styles.projectImage} />
        <View style={styles.projectContent}>
          <Text style={styles.projectTitle}>{project.title}</Text>
          <Text style={styles.projectDescription}>{project.description}</Text>
          <View style={styles.progressContainer}>
            <Text style={styles.progressLabel}>Progress: {project.progress}%</Text>
            <ProgressBar progress={project.progress / 100} color="#FF5722" style={styles.progressBar} />
          </View>
          <View style={styles.locationContainer}>
            <MaterialCommunityIcons name="map-marker" size={24} color="#201E43" />
            <Text style={styles.projectLocation}>{project.location}</Text>
          </View>
        </View>
      </Card>

      <TouchableOpacity
        style={styles.donateButton}
        onPress={() => navigation.navigate('Add_Donation', { project })}
      >
        <Text style={styles.donateButtonText}>Donate Now</Text>
        <FontAwesome name="credit-card" size={20} color="#FFFFFF" />
      </TouchableOpacity>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F5F5F5',
    padding: width * 0.04,
  },
  card: {
    marginBottom: height * 0.02,
  },
  projectImage: {
    width: '100%',
    height: width * 0.4,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  projectContent: {
    padding: width * 0.04,
  },
  projectTitle: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: '#201E43',
    marginBottom: height * 0.01,
  },
  projectDescription: {
    fontSize: width * 0.04,
    color: '#666666',
    marginBottom: height * 0.01,
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
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.02,
  },
  projectLocation: {
    fontSize: width * 0.04,
    color: '#888888',
    marginLeft: width * 0.02,
  },
  donateButton: {
    backgroundColor: '#201E43',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.04,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  donateButtonText: {
    color: '#FFFFFF',
    fontSize: width * 0.04,
    marginRight: width * 0.02,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  errorText: {
    fontSize: width * 0.05,
    color: '#201E43',
  },
});

export default Project_Details;
