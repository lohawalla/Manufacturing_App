import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useLayoutEffect, useState } from "react";
import RoleIndex from "./RoleIndex";
import Login from "../screens/Login/Login";
import LoadingScreen from "../components/loading/LoadingScreen";
import { Alert, AppState } from "react-native";
import { persistor } from "../redux/store";

export interface RIAuthGuard {
    children: React.ReactNode
}
export namespace PIAuthGuard { }

interface AuthContextValue {
    authData: Auth.LoginData
    actions: {
        logout: () => void;
        login: (data: Auth.LoginData) => void;
    }
}
type CustomAppState = AppState & {
    removeEventListener: any;
};

const AuthContext = createContext<AuthContextValue>({} as AuthContextValue)

export const useAuthContext = () => useContext(AuthContext);

export default function AuthGuard(props: RIAuthGuard) {
    let appStateListener: any;
    const { children } = props;
    const [loading, setLoading] = useState(true);
    const [state, setState] = useState<Auth.LoginData | null>(null);
    const AUTO_LOGOUT_TIME = 6 * 60 * 60 * 1000; 
    useEffect(() => {
        checkLastLogin();
        appStateListener = AppState.addEventListener('change', handleAppStateChange);
        return () => {
            if (appStateListener) {
                appStateListener.remove(); 
            }
        };
    }, []);
    console.log(AsyncStorage.getItem('auth'), AsyncStorage.getItem('lastLoginTimestamp'), AUTO_LOGOUT_TIME)
    const checkLastLogin = async () => {
        try {
            const lastLoginTimestamp = await AsyncStorage.getItem('lastLoginTimestamp');
            if (lastLoginTimestamp) {
                const currentTime = new Date().getTime();
                const difference = currentTime - parseInt(lastLoginTimestamp, 10);
                if (difference >= AUTO_LOGOUT_TIME) {
                    (async () => {
                        await persistor.purge();
                        await AsyncStorage.removeItem('auth');
                        setState(null);
                    })()
                    Alert.alert('Auto Logout', 'You have been logged out due to inactivity.');
                    await AsyncStorage.removeItem('lastLoginTimestamp');
                }
            }
            await AsyncStorage.setItem('lastLoginTimestamp', String(new Date().getTime()));
        } catch (error) {
            console.error('Error checking last login:', error);
        }
    };
    const handleAppStateChange = async (nextAppState: any) => {
        if (nextAppState === 'background' || nextAppState === 'inactive') {
            const lastLoginTimestamp = new Date().getTime(); // Get current time
            try {
                await AsyncStorage.setItem('lastLoginTimestamp', String(lastLoginTimestamp));
            } catch (error) {
                console.error('Error storing last login time:', error);
            }
        }
    }
    useLayoutEffect(() => {
        (async () => {
            try {
                const loginData = await AsyncStorage.getItem('auth');
                if (loginData) {
                    const loginDataParsed = JSON.parse(loginData) as Auth.LoginData;
                    setState(loginDataParsed);
                }
            } catch (error) {
                console.error('Error fetching login data:', error);
            } finally {
                setLoading(false);
            }
        })();
    }, []);
    if (loading) {
        return <LoadingScreen />
    }
    if (state)
        return (
            <AuthContext.Provider value={{
                authData: state,
                actions: {
                    logout: () => {
                        (async () => {
                            console.log('Before purge');
                            await persistor.purge();
                            await AsyncStorage.clear();
                            console.log('After purge');
                            await AsyncStorage.removeItem('auth');
                            setState(null);
                        })();
                    },
                    login: d => {
                        (async () => {
                            await AsyncStorage.setItem('auth', JSON.stringify(d));
                            setState(d);
                        })();
                    }
                },
            }}>
                {children}
            </AuthContext.Provider>
        )

    return (
        <AuthContext.Provider
            value={{
                authData: {
                    loginData: {
                        success: false,
                        userId: '',
                        role: RoleIndex.UNKNOWN,
                        name: '',
                        email: '',
                        phoneNumber: '',
                    }
                },
                actions: {
                    logout: () => {
                        setState(null)
                    },
                    login: d => {
                        (async () => {
                            await AsyncStorage.setItem('auth', JSON.stringify(d))
                            setState(d);
                        })()
                    }
                }
            }}
        >
            <Login />
        </AuthContext.Provider>
    )
}