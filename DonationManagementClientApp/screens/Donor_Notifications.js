import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Card, Badge } from 'react-native-paper';

const { width, height } = Dimensions.get('window');

const notificationsData = [
  { id: '1', title: 'New Donation Received', description: 'You have received a $50 donation for Feed the Children.', time: '10 mins ago', type: 'donation' },
  { id: '2', title: 'Campaign Update', description: 'The Clothing Drive campaign has reached its goal.', time: '1 hour ago', type: 'campaign' },
  { id: '3', title: 'Thank You Message', description: 'Orphanage 1 sent you a thank you message.', time: 'Yesterday', type: 'message' },
];

const Donor_Notifications = ({ navigation, route }) => {
  const [notifications, setNotifications] = useState(notificationsData);

  useEffect(() => {
    // Retrieve setNotificationCount function from route.params if it's passed
    const { setNotificationCount } = route.params || {};
    
    if (setNotificationCount) {
      setNotificationCount(notifications.length);
    }
  }, [notifications, route.params]);

  const renderNotification = ({ item }) => {
    let icon;
    let iconColor;
    switch (item.type) {
      case 'donation':
        icon = 'dollar';
        iconColor = '#4CAF50';
        break;
      case 'campaign':
        icon = 'bullhorn';
        iconColor = '#FFD700';
        break;
      case 'message':
        icon = 'envelope';
        iconColor = '#1E90FF';
        break;
      default:
        icon = 'bell';
        iconColor = '#201E43';
    }

    return (
      <TouchableOpacity onPress={() => navigation.navigate('NotificationDetail', { notificationId: item.id })}>
        <Card style={styles.notificationCard}>
          <View style={styles.iconContainer}>
            <FontAwesome name={icon} size={24} color={iconColor} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.notificationTitle}>{item.title}</Text>
            <Text style={styles.notificationDescription}>{item.description}</Text>
            <Text style={styles.notificationTime}>{item.time}</Text>
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Notifications</Text>
        <Badge style={styles.badge} size={24}>{notifications.length}</Badge>
      </View>
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F5',
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.05,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: height * 0.02,
  },
  headerText: {
    fontSize: width * 0.07,
    fontWeight: 'bold',
    color: '#201E43',
  },
  badge: {
    backgroundColor: '#FF6347',
    color: '#FFFFFF',
  },
  listContainer: {
    paddingBottom: height * 0.1,
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginBottom: height * 0.02,
    padding: width * 0.04,
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: width * 0.04,
    backgroundColor: '#F0F0F5',
    padding: width * 0.04,
    borderRadius: 10,
  },
  textContainer: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: height * 0.005,
  },
  notificationDescription: {
    fontSize: width * 0.04,
    color: '#666666',
    marginBottom: height * 0.01,
  },
  notificationTime: {
    fontSize: width * 0.035,
    color: '#999999',
  },
});

export default Donor_Notifications;
