import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import login from './fetch/services/login';
import { useAuthContext } from '../../auth/AuthGuard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showMessage } from "react-native-flash-message";
import Feather from 'react-native-vector-icons/Feather';
import Modal from 'react-native-modal';
import NetInfo from '@react-native-community/netinfo';
import Spinner from 'react-native-loading-spinner-overlay';
import { useAuth } from '../../context/AuthProvider';
import axios from 'axios';
import UserAgent from 'react-native-user-agent';
import DeviceInfo from 'react-native-device-info';
import Sound from 'react-native-sound';
import { getAllWorkOrderAsync } from '../../redux/Slice/workOrderSlice';
import { useDispatch } from 'react-redux';

const Login = ({ navigation }: any) => {
  Sound.setCategory('Playback');
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isOffline, setOfflineStatus] = useState(false);
  const auth = useAuthContext();
  console.log(auth);
  const { userAgent, ipAddress, platform } = useAuth();
  const playInSound = () => {
    const sound = new Sound('welcome.mp3', Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.error('Failed to load the sound', error);
        return;
      }
      sound.play((success) => {
        if (success) {
          console.log('Sound played successfully');
        } else {
          console.error('Sound did not play');
        }
      });
    });
  }
  const playNewSound = () => {
    const sound = new Sound('newYear.mp3', Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.error('Failed to load the sound', error);
        return;
      }
      sound.play((success) => {
        if (success) {
          console.log('Sound played successfully');
        } else {
          console.error('Sound did not play');
        }
      });
    });
  }
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  (async () => {
    try {
      const response = await axios.get('https://api.ipify.org?format=json');
      const ipAddress = response.data.ip;
      const _j: any = UserAgent.getUserAgent();
      const platform = DeviceInfo.getSystemName();
      console.log(ipAddress, _j, platform);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  })();
  console.log(userAgent, ipAddress, platform);
  const handleLogin = async () => {
    const isEmail = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
      email
    );
    const data = isEmail ? { email, password, userAgent: `daily-log${userAgent}`, ipAddress: `daily-log${ipAddress}`, platform } : { phone: +email, password, userAgent: `daily-log${userAgent}`, ipAddress: `daily-log${ipAddress}`, platform };
    console.log("I am data", auth);
    try {
      setLoading(true);
      const res = await login(data);
      auth.actions.login(res.data.user)
      console.log("78941796525", res.data.user);
      console.log("Calling Auth", auth.actions.login(res.data.user));
      showMessage({
        message: "Login Success",
        type: "success",
        duration: 5000,
        floating: true
      });
      playInSound()
    } catch (error: any) {
      console.error("Login error:", error?.response.data.success);
      if (error?.response.data.success == false) {
        showMessage({
          message: "Login failed",
          type: "danger",
          duration: 5000,
          floating: true
        });
      }
    }
    setLoading(false);
  };
  const Button = ({ children, ...props }: any) => (
    <TouchableOpacity style={styles.button1} {...props}>
      <Text style={styles.buttonText1}>{children}</Text>
    </TouchableOpacity>
  );
  const NoInternetModal = ({ show, onRetry, isRetrying }: any) => (
    <Modal isVisible={show} style={styles.modal} animationInTiming={600}>
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Connection Error</Text>
        <Text >
          Oops! Looks like your device is not connected to the Internet. ( उफ़! ऐसा लगता है कि आपका उपकरण इंटरनेट से कनेक्ट नहीं है. )
        </Text>
        <Button onPress={onRetry} disabled={isRetrying}>
          Check your Connectivity
        </Button>
      </View>
    </Modal>
  );
  useLayoutEffect(() => {
    const removeNetInfoSubscription = NetInfo.addEventListener((state) => {
      const offline = !(state.isConnected && state.isInternetReachable);
      setOfflineStatus(offline);
    });
    return () => removeNetInfoSubscription();
  }, [navigation]);
  return (
    <View style={styles.container}>{isLoading ? ( // Conditionally render the loading spinner
      <Spinner
        visible={isLoading}
        textContent={'Loading...'}
        textStyle={styles.spinnerText}
        animation="fade"
      />
    ) : (
      <View style={styles.wrapper}>
        <View style={styles.loginForm}>
          <Text style={styles.heading}>Employee Login</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email or Phone Number</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={text => setEmail(text)}
              placeholder='Email or Phone Number....'
              placeholderTextColor={'#B0B0B0'}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordInputWrapper}>
              <TextInput
                style={styles.passwordInput}
                value={password}
                onChangeText={text => setPassword(text)}
                secureTextEntry={!showPassword}
                placeholder='Password'
                placeholderTextColor={'#B0B0B0'}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={togglePasswordVisibility}
              ><Feather
                  name={showPassword ? "eye" : "eye-off"}
                  size={18}
                  color={'black'}
                /></TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Feather
              name={'log-in'}
              size={28}
              color={'white'}
            />
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    )}
      <NoInternetModal
        show={isOffline}
        isRetrying={isLoading}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrapper: {
    width: '90%',
  },
  loginForm: {
    justifyContent: 'center',
  },
  heading: {
    color: 'black',
    fontFamily: 'Inter',
    fontWeight: '700',
    paddingVertical: 30,
    fontSize: 25,
  },
  inputContainer: {
    paddingBottom: 15,
  },
  label: {
    color: 'black',
    fontWeight: '400',
    fontFamily: 'Inter',
    paddingBottom: 10,
    marginRight: 12,
    paddingTop: 12,
  },
  input: {
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#666666',
    borderRadius: 5,
    paddingHorizontal: 14,
  },
  passwordInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#666666',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 8,
    color: 'black',
  },
  eyeButton: {
    padding: 8,
  },
  loginButton: {
    backgroundColor: '#283093',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 55,
    borderRadius: 5,
    marginTop: 10,
    width: '38%',
    paddingHorizontal: 5,
    paddingVertical: 3,
    flexDirection: 'row'
  },
  buttonText: {
    color: 'white',
    paddingLeft: 10,
    fontSize: 18,
    marginRight: 10
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '600',
  },
  button1: {
    backgroundColor: "#283093",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText1: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  spinnerText: {
    color: '#FFF', // Customize text color
    fontSize: 16, // Customize text size
  },
});
export default Login;
