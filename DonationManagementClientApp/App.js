import * as React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'; // Import Stack Navigator
import { Donor_dashboard, Home, Profile } from './screens/';
import Login_choice from './screens/Login_choice';
import Orphanage_Signup from './screens/Orphanage_Signup';
import Donor_Login from './screens/Donor_Login';
import Orphanage_Login from './screens/Orphanage_Login';
import Orphanage_profile from './screens/Orphanage_profile';
import Donation from './screens/Donation';
import Orphanage_Feed from './screens/Orphanage_Feed';
import Donor_Profile from './screens/Donor_Profile';
import Donor_Notifications from './screens/Donor_Notifications';
import Add_Donation from './screens/Add_Donation';
import Project_Listing from './screens/Project_Listing';
import Donor_Signup from './screens/Donor_Signup';
import Project_Details from './screens/Project_Details';
import Splash from './screens/Splash';
import Orphanage_Dashboard from './screens/Orphanage_Dashboard';

const Stack = createStackNavigator(); // Create Stack instance

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false
        }}
        initialRouteName={'Splash'}
      >
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="Login_choice" component={Login_choice} />
        <Stack.Screen name="Donor_Login" component={Donor_Login} />
        <Stack.Screen name="Donor_Signup" component={Donor_Signup} />
        <Stack.Screen name="Donation" component={Donation} />
        <Stack.Screen name="Orphanage_Login" component={Orphanage_Login} />
        <Stack.Screen name="Orphanage_Signup" component={Orphanage_Signup} />
        <Stack.Screen name="Donor_Notifications" component={Donor_Notifications} />
        <Stack.Screen name="Orphanage_Dashboard" component={Orphanage_Dashboard} />
        <Stack.Screen name="Orphanage_profile" component={Orphanage_profile} />
        <Stack.Screen name="Donor_dashboard" component={Donor_dashboard} />
        <Stack.Screen name="Project_Listing" component={Project_Listing} />
        <Stack.Screen name="Orphanage_Feed" component={Orphanage_Feed} />
        <Stack.Screen name="Donor_Profile" component={Donor_Profile} />
        <Stack.Screen name="Add_Donation" component={Add_Donation} />
        <Stack.Screen name="Project_Details" component={Project_Details} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    padding: 50,
    backgroundColor: '#3A74CB'
  }
});
