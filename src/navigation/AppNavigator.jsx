import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//screens
import StartPage from '../screens/StartPage';
import SignupPage from '../screens/SignupPage';
import LoginPage from '../screens/LoginPage';
import DashBoard from '../screens/ini/DashBoard';
import MedicineSearch from '../screens/ini/services/MedicineSearch';
import DiseaseOverview from '../screens/ini/services/DiseaseOverview';
import DietPlan from '../screens/ini/services/DietPlan';
import EmergencyHandling from '../screens/ini/services/EmergencyHandling';
import NutroScreen from '../screens/ini/services/NutroScreen';
import DoctorScreen from '../screens/ini/services/DoctorScreen';
import HealthNews from '../screens/ini/services/HealthNews';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Start"
        screenOptions={{
          headerShown: false, // hides the top header bar
        }}
      >
        <Stack.Screen name="Start" component={StartPage} />
        <Stack.Screen name="Login" component={LoginPage} />
        <Stack.Screen name="Signup" component={SignupPage} />
        <Stack.Screen name="DashBoard" component={DashBoard} />
        <Stack.Screen name="MedicineSearch" component={MedicineSearch} />
        <Stack.Screen name="DiseaseOverview" component={DiseaseOverview} />
        <Stack.Screen name="DietPlan" component={DietPlan} />
        <Stack.Screen name="EmergencyHandling" component={EmergencyHandling} />
        <Stack.Screen name="NutroScreen" component={NutroScreen} />
        <Stack.Screen name="DoctorScreen" component={DoctorScreen} />
        <Stack.Screen name="HealthNews" component={HealthNews} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}