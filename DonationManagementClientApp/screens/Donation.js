import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Updated import
import { FontAwesome } from '@expo/vector-icons'; // Import FontAwesome icons
import StatusBarManager from '../Component/StatusBarManager';

const { width, height } = Dimensions.get('window');

// Dummy data for demonstration
const orphanages = [
  { id: '1', name: 'Orphanage 1', location: 'Kitwe', type: 'Food', project: 'Feed the Children' },
  { id: '2', name: 'Orphanage 2', location: 'Ndola', type: 'Clothing', project: 'Clothing Drive' },
  // Add more orphanage data as needed
];

const Donation = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');
  const [selectedProject, setSelectedProject] = useState('All Projects');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [selectedType, setSelectedType] = useState('All Types');
  const [showFilters, setShowFilters] = useState(false); // State to control filter dropdown visibility

  // Function to handle search and filter
  const handleSearch = () => {
    return orphanages.filter(orphanage => {
      return (
        (searchText === '' || orphanage.name.toLowerCase().includes(searchText.toLowerCase())) &&
        (selectedProject === 'All Projects' || orphanage.project === selectedProject) &&
        (selectedLocation === 'All Locations' || orphanage.location === selectedLocation) &&
        (selectedType === 'All Types' || orphanage.type === selectedType)
      );
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Make a Donation</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBarContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for orphanages..."
            value={searchText}
            onChangeText={setSearchText}
          />
          <FontAwesome name="search" size={20} color="#0033A0" style={styles.searchIcon} />
        </View>
        <TouchableOpacity style={styles.filterButton} onPress={() => setShowFilters(!showFilters)}>
          <FontAwesome name="filter" size={20} color="#0033A0" />
        </TouchableOpacity>
      </View>

      {showFilters && (
        <View style={styles.filtersContainer}>
          <Text style={styles.filterLabel}>Location</Text>
          <Picker
            selectedValue={selectedLocation}
            style={styles.picker}
            onValueChange={(itemValue) => setSelectedLocation(itemValue)}
          >
            <Picker.Item label="All Locations" value="All Locations" />
            <Picker.Item label="Kitwe" value="Kitwe" />
            <Picker.Item label="Ndola" value="Ndola" />
            {/* Add more location options */}
          </Picker>

          <Text style={styles.filterLabel}>Project</Text>
          <Picker
            selectedValue={selectedProject}
            style={styles.picker}
            onValueChange={(itemValue) => setSelectedProject(itemValue)}
          >
            <Picker.Item label="All Projects" value="All Projects" />
            <Picker.Item label="Feed the Children" value="Feed the Children" />
            <Picker.Item label="Clothing Drive" value="Clothing Drive" />
            {/* Add more project options */}
          </Picker>

          <Text style={styles.filterLabel}>Type</Text>
          <Picker
            selectedValue={selectedType}
            style={styles.picker}
            onValueChange={(itemValue) => setSelectedType(itemValue)}
          >
            <Picker.Item label="All Types" value="All Types" />
            <Picker.Item label="Food" value="Food" />
            <Picker.Item label="Clothing" value="Clothing" />
            {/* Add more type options */}
          </Picker>
        </View>
      )}

      <FlatList
        data={handleSearch()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.orphanageCard} onPress={() => navigation.navigate('OrphanageDetails', { orphanageId: item.id })}>
            <Text style={styles.orphanageName}>{item.name}</Text>
            <Text style={styles.orphanageDetails}>{item.location} - {item.type} - {item.project}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: width * 0.05,
    backgroundColor: '#F9F9F9',
  },
  card: {
    backgroundColor: '#201E43',
    padding: width * 0.05,
    marginHorizontal: width * -0.01,
    borderRadius: 20,
    marginBottom: height * 0.02,
    alignItems: 'center',
  },
  title: {
    fontSize: width * 0.07,
    fontWeight: 'bold',
    color: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.07,
  },
  searchBarContainer: {
    flex: 1,
    position: 'relative',
  },
  searchInput: {
    height: height * 0.06,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: width * 0.1, // Padding to make space for the icon
    backgroundColor: '#fff',
    fontSize: width * 0.04,
  },
  searchIcon: {
    position: 'absolute',
    left: width * 0.03,
    top: height * 0.019,
    color: '#201E43',
},
filterButton: {
  marginLeft: width * 0.02,
  backgroundColor: '#4D869C',
  padding: width * 0.02,
  borderRadius: 10,
  alignItems: 'center',
  justifyContent: 'center',
  borderColor: '#4D869C',
},
filtersContainer: {
  marginBottom: height * 0.02,
},
filterLabel: {
  fontSize: width * 0.05,
  fontWeight: 'bold',
  marginBottom: height * 0.01,
},
picker: {
  height: height * 0.05,
  marginBottom: height * 0.01,
  color: 'EEF7FF',
  },
  orphanageCard: {
    padding: width * 0.05,
    marginBottom: height * 0.02,
    backgroundColor: '#EEEEEE',
    borderRadius: 10,
    elevation: 2,
  },
  orphanageName: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
  },
  orphanageDetails: {
    fontSize: width * 0.04,
    color: '#666666',
  },
});

export default Donation;
