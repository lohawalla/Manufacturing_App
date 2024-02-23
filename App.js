import { StyleSheet } from 'react-native'
import React, { useEffect } from 'react'
import { useColorScheme } from 'react-native';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import AuthGuard from './src/auth/AuthGuard'
import Dashboard from './src/screens/Dashboard/Dashboard'
import FlashMessage from 'react-native-flash-message'
import { AlertNotificationRoot } from 'react-native-alert-notification'
import Home from './Routes'
import { Work, Programs } from './Routes'
import { AuthProvider } from './src/context/AuthProvider';
import axios from 'axios'
import UserAgent from 'react-native-user-agent';
import DeviceInfo from 'react-native-device-info';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Feather from 'react-native-vector-icons/FontAwesome5';
import UserAccount from './src/screens/UserAccount/UserAccount'
import ErrorBoundary from 'react-native-error-boundary';
import CustomFallback from './src/components/ErrorBoundary/ErrorBoundary'
import { QueryClient, QueryClientProvider } from 'react-query';
import Tts from 'react-native-tts';
const Tab = createBottomTabNavigator();
const App = () => {
  const voice = Tts.voices().then((voices) => voices.filter((el) => el.id == "hi-IN-language"));
  voice.then(async (voices) => {
    console.log(voices);
    if (voices) {
      await Tts.setDefaultLanguage(voices[0].language);
      await Tts.setDefaultVoice(voices[0].id);
    } else {
      console.error('Error setting default language or voice. Voices array is empty or does not have enough elements.');
    }
  })
  const queryClient = new QueryClient();
  const scheme = useColorScheme();
  (async () => {
    try {
      const response = await axios.get('https://api.ipify.org?format=json');
      const ipAddress = response.data.ip;
      const _j = UserAgent.getUserAgent();
      const platform = DeviceInfo.getSystemName();
      console.log(ipAddress, _j, platform);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  })();
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary FallbackComponent={CustomFallback} onError={() => {
        <Dashboard />
        return null;
      }}>
        <AuthProvider>
          <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
            <AlertNotificationRoot>
              <FlashMessage position="top" />
              <AuthGuard>
                <Tab.Navigator
                  initialRouteName="Home"
                  shifting={true}
                >
                  <Tab.Screen
                    name="Home"
                    component={Home}
                    options={{
                      headerShown: false,
                      tabBarLabel: 'Home',
                      tabBarLabelStyle: { color: '#283093' },
                      tabBarIcon: ({ focused, color, size }) => (
                        <Feather name="home" size={focused ? 30 : 25} color={focused ? '#283093' : color} />
                      ),
                    }}
                  />
                  <Tab.Screen
                    name="Work"
                    component={Work}
                    options={{
                      headerShown: false,
                      tabBarLabel: 'Work',
                      tabBarLabelStyle: { color: '#283093' },
                      tabBarIcon: ({ focused, color, size }) => (
                        <Feather name="atlas" size={focused ? 30 : 25} color={focused ? '#283093' : color} />
                      ),
                    }}
                  />
                  <Tab.Screen
                    name="Programs"
                    component={Programs}
                    options={{
                      headerShown: false,
                      tabBarLabel: 'Program',
                      tabBarLabelStyle: { color: '#283093' },
                      tabBarIcon: ({ focused, color, size }) => (
                        <Feather name="cogs" size={focused ? 30 : 25} color={focused ? '#283093' : color} />
                      ),
                    }}
                  />
                  <Tab.Screen
                    name="User"
                    component={UserAccount}
                    options={{
                      headerShown: false,
                      tabBarLabel: 'Account',
                      tabBarLabelStyle: { color: '#283093' },
                      tabBarIcon: ({ focused, color, size }) => (
                        <Feather name="street-view" size={focused ? 30 : 25} color={focused ? '#283093' : color} />
                      ),
                    }}
                  />
                </Tab.Navigator>
              </AuthGuard>
            </AlertNotificationRoot>
          </NavigationContainer>
        </AuthProvider>
      </ErrorBoundary>
    </QueryClientProvider>
  )
}

export default App

const styles = StyleSheet.create({})