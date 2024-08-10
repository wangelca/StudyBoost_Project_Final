import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CalendarScreen from './pages/CalendarScreen';
import ClassesScreen from './pages/ClassesScreen';
import SettingsScreen from './pages/SettingsScreen';

const Tab = createBottomTabNavigator();

const HomeScreen: React.FC = () => (
  <View style={styles.screenContainer}>
    <Text style={styles.title}>STUDY BOOST</Text>
    <Image source={require('./assets/homeimage.png')} style={styles.homeImage} />
    <Text style={styles.motivationalText}>The mind is not a vessel to be filled but a fire to be ignited.</Text>
    <Text style={styles.motivationalText}>-Plutarch</Text>
  </View>
);

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarLabel: route.name,
          headerShown: false,
          tabBarLabelStyle: {
            fontSize: 20,
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: 5,
            paddingBottom: 5,
          },
          tabBarStyle: {
            backgroundColor: '#003366',
            paddingBottom: 5,
            elevation: 0,
            borderTopWidth: 0,
            height: 60,
            borderRadius: 0,
            overflow: 'visible',
            marginBottom: 0,
          },
          tabBarActiveTintColor: 'white',
          tabBarInactiveTintColor: 'grey',
          tabBarIcon: () => null,
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Calendar" component={CalendarScreen} />
        <Tab.Screen name="Classes" component={ClassesScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#305d8f',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',
    textAlign: 'center',
  },
  motivationalText: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
    paddingHorizontal: 20,
    marginTop: 10,
    fontStyle: 'italic',
  },
  screenContainer: {
    flex: 1,
    backgroundColor: '#305d8f',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  screenText: {
    fontSize: 24,
    color: 'white',
  },
  homeImage: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * 0.4,
    resizeMode: 'cover',
    marginVertical: 20,
  },
});

export default App;
























