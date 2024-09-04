import React, { useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Donor_Dashboard from '../screens/Donor_dashboard'; // Adjust the path as necessary
import Donor_Notifications from '../screens/Donor_Notifications'; // Adjust the path as necessary

const { width, height } = Dimensions.get('window');

const Stack = createStackNavigator();

const MainNavigator = () => {
  const [notificationCount, setNotificationCount] = useState(0);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Donor_Dashboard">
        <Stack.Screen name="Donor_Dashboard">
          {(props) => <Donor_Dashboard {...props} notificationCount={notificationCount} />}
        </Stack.Screen>
        <Stack.Screen name="Donor_Notifications">
          {(props) => <Donor_Notifications {...props} setNotificationCount={setNotificationCount} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F5',
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.05,
  },
});

export default MainNavigator;
