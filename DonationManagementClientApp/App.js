import * as React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'; // Import Stack Navigator
import { Donation, Donor_dashboard, Home, Profile } from './screens/';
import Register from './screens/Register';
import Login_choice from './screens/Login_choice';
import Orphanage_Signup from './screens/Orphanage_Signup';
import Donor_Login from './screens/Donor_Login';
import Orphanage_Login from './screens/Orphanage_Login';
import Orphanage_profile from './screens/Orphanage_profile';
import Orphanage_Feed from './screens/Orphanage_Feed';
import Donor_Profile from './screens/Donor_Profile';
import Add_Donation from './screens/Add_Donation';
import Statistics_Screen from './screens/Statistics_Screen';
import Project_Listing from './screens/Project_Listing';
import Donor_Signup from './screens/Donor_Signup';
import Project_Details from './screens/Project_Details';
import Splash from './screens/Splash';
import AddCard from './screens/AddCard';
import Projects from './screens/Projects';
import MyProjects from './screens/MyProjects';
import ViewProject from './screens/ViewProject';
import EditProject from './screens/EditProject';
import EventDashboard from './screens/EventDashboard';
import CompleteEvent from './screens/CompleteEvent';
import Event from './screens/Event';
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
        <Stack.Screen name="Orphanage_Login" component={Orphanage_Login} />
        <Stack.Screen name="Orphanage_Signup" component={Orphanage_Signup} />
        <Stack.Screen name="Donation" component={Donation} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Statistics_Screen" component={Statistics_Screen} />
        <Stack.Screen name="Orphanage_Dashboard" component={Orphanage_Dashboard} />
        <Stack.Screen name="Orphanage_profile" component={Orphanage_profile} />
        <Stack.Screen name="Donor_dashboard" component={Donor_dashboard} />
        <Stack.Screen name="Project_Listing" component={Project_Listing} />
        <Stack.Screen name="Orphanage_Feed" component={Orphanage_Feed} />
        <Stack.Screen name="Donor_Profile" component={Donor_Profile} />
        <Stack.Screen name="Add_Donation" component={Add_Donation} />
        <Stack.Screen name="Project_Details" component={Project_Details} />
        <Stack.Screen name="AddCard" component={AddCard} />
        <Stack.Screen name="Projects" component={Projects} />
        <Stack.Screen name="MyProjects" component={MyProjects} />
        <Stack.Screen name="ViewProject" component={ViewProject} />
        <Stack.Screen name="EditProject" component={EditProject} />
        <Stack.Screen name="EventDashboard" component={EventDashboard} />
        <Stack.Screen name="CompleteEvent" component={CompleteEvent} />
        <Stack.Screen name="Event" component={Event} />
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
