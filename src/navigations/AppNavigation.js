import React from 'react';
import { Image, Pressable, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import ScanScreen from '../screens/ScanScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import { AppIcon, AppStyles } from '../AppStyles';
import { Configuration } from '../Configuration';
import DrawerContainer from '../components/DrawerContainer';
import MapScreen from '../screens/MapScreen';

const Stack = createStackNavigator();

// login stack
const LoginStack = () => (
  <Stack.Navigator
    initialRouteName="Welcome"
    screenOptions={{
      headerMode: 'screen',
      cardStyle: { backgroundColor: 'white' },
      headerStyle: { backgroundColor: 'transparent', elevation: 0, shadowOpacity: 0 },
      headerTitle: ''
    }}>
    <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Signup" component={SignupScreen} />

  </Stack.Navigator>
);

const TabStack = (props) => {
  return (
    <Stack.Navigator
        screenOptions={{
          headerTintColor: 'red',
          headerTitleStyle: styles.headerTitleStyle,
          headerMode: 'float',
        }}>
        <Stack.Screen
          name={props.name}
          component={props.component}
          options={({ navigation }) => ({
            headerLeft: () => (
              <Pressable onPress={() => navigation.openDrawer()}>
                <Image style={styles.iconStyle} source={AppIcon.images.menu} />
              </Pressable>
            ),
            headerLeftContainerStyle: { paddingLeft: 10 },
          })}
        />
      </Stack.Navigator>
    )
};

const BottomTab = createBottomTabNavigator();

const TabNavigator = () => (
  <BottomTab.Navigator
    initialRouteName="Home"
    screenOptions={{
      tabBarInactiveTintColor: 'grey',
      tabBarActiveTintColor: AppStyles.color.tint,
      headerShown: false,
    }}>
    <BottomTab.Screen
      options={{
        tabBarLabel: 'Scan',
        tabBarIcon: ({ focused }) => {
          return (
            <Image
              style={{
                tintColor: focused ? AppStyles.color.tint : AppStyles.color.grey,
                width: 30, height: 30
              }}
              source={AppIcon.images.scan}
            />
          );
        }
      }}
      name="ScanStack"
      children={() => <TabStack name='Scan' component={ScanScreen} />}

    />
    <BottomTab.Screen
      options={{
        tabBarLabel: 'Map',
        tabBarIcon: ({ focused }) => {
          return (
            <Image
              style={{
                tintColor: focused ? AppStyles.color.tint : AppStyles.color.grey,
                width: 30, height: 30
              }}
              source={AppIcon.images.map}
            />
          );
        }
      }}
      name="MapStack"
      children={() => <TabStack name='Map' component={MapScreen} />}
    />
  </BottomTab.Navigator>
);

// drawer stack
const Drawer = createDrawerNavigator();
const DrawerStack = () => (
  <Drawer.Navigator
    screenOptions={{
      drawerStyle: { outerWidth: 200 },
      drawerPosition: 'left',
      headerShown: false,
    }}
    drawerContent={({ navigation }) => (
      <DrawerContainer navigation={navigation} />
    )}>
    <Drawer.Screen name="Tab" component={TabNavigator} />
  </Drawer.Navigator>
);

// Manifest of possible screens
const RootNavigator = () => (
  <Stack.Navigator
    initialRouteName="LoginStack"
    screenOptions={{ headerShown: false }}>
    <Stack.Screen name="LoginStack" component={LoginStack} />
    <Stack.Screen name="DrawerStack" component={DrawerStack} />
  </Stack.Navigator>
);

const AppNavigator = () => (
  <NavigationContainer>
    <RootNavigator />
  </NavigationContainer>
);

const styles = StyleSheet.create({
  headerTitleStyle: {
    fontWeight: 'bold',
    textAlign: 'center',
    alignSelf: 'center',
    color: 'black',
  },
  iconStyle: { tintColor: AppStyles.color.tint, width: 30, height: 30 },
});

export default AppNavigator;
