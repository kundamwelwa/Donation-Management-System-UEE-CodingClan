import * as React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'; // Import Stack Navigator
import { AddDonation, Donor_dashboard, Home, Profile } from './screens/';
import Register from './screens/Register';
import Login_choice from './screens/Login_choice';
import Orphanage_Signup from './screens/Orphanage_Signup';
import Donor_Login from './screens/Donor_Login';
import Orphanage_Login from './screens/Orphanage_Login';
import Donor_Signup from './screens/Donor_Signup';
import Splash from './screens/Splash';
import AddCard from './screens/AddCard';
import Projects from './screens/Projects';
import MyProjects from './screens/MyProjects';
import ViewProject from './screens/ViewProject';
import AddProject from './screens/AddProject';
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
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Orphanage_Dashboard" component={Orphanage_Dashboard} />
        <Stack.Screen name="Donor_dashboard" component={Donor_dashboard} />
        <Stack.Screen name="AddDonation" component={AddDonation} />
        <Stack.Screen name="AddCard" component={AddCard} />
        <Stack.Screen name="Projects" component={Projects} />
        <Stack.Screen name="MyProjects" component={MyProjects} />
        <Stack.Screen name="ViewProject" component={ViewProject} />
        <Stack.Screen name="AddProject" component={AddProject} />
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
