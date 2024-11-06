import * as React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { 
  Donor_dashboard,
  Splash,
  Login_choice,
  Donor_Login,
  Donor_Signup,
  Donation,
  Campaigns,
  Orphanage_Login,
  Orphanage_Signup,
  Donor_Notifications,
  Orphanage_Dashboard,
  Orphanage_profile,
  ProjectListing,
  Orphanage_Feed,
  Donor_Profile,
  Project_Details, 
} from './screens';  // Import all screens from index.js

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName="Splash"
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
        <Stack.Screen name="Campaigns" component={Campaigns} />
        <Stack.Screen name="Orphanage_profile" component={Orphanage_profile} />
        <Stack.Screen name="Donor_dashboard" component={Donor_dashboard} />
        <Stack.Screen name="ProjectListing" component={ProjectListing} />
        <Stack.Screen name="Orphanage_Feed" component={Orphanage_Feed} />
        <Stack.Screen name="Donor_Profile" component={Donor_Profile} />
        <Stack.Screen name="Project_Details" component={Project_Details} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    padding: 50,
    backgroundColor: '#3A74CB',
  },
});
