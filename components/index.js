import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import AsyncStorage from '@react-native-community/async-storage';

import { AuthContext } from "./context";
import {
    //SignIn,
    //CreateAccount,
    Search,
    // Home,
    // Details,
    Search2,
    //Profile,
    Splash
} from "./screens";
import {
    AdminHome,
    AdminDetails
} from "./admin/adminHome";
import CustomAdminDrawer from './admin/adminDrawer';
import WorkingHour from './admin/workingHour';
import AdminProfile from './admin/adminProfile';
import Staff from './admin/staff/staff';
import StaffDetails from './admin/staff/staffDetails';
import Services from './admin/services/services';

import { UserHome } from './user/userHome';
import CustomUserDrawer from './user/userDrawer';

import User from "./auth/user";
import SignInPage from "./auth/signin";
import SignUpPage from "./auth/signup";

const AuthStack = createStackNavigator();
const AuthStackScreen = () => (
    <AuthStack.Navigator>
        <AuthStack.Screen
            name="SignIn"
            component={User}
            options={{ title: "Sign In" }}
        />
        <AuthStack.Screen
            name="SignUpPage"
            component={SignUpPage}
            options={{ title: "Create Account" }}
        />
        <AuthStack.Screen
            name="SignInPage"
            component={SignInPage}
            options={{ title: "Sign In" }}
        />
    </AuthStack.Navigator>
);

const Tabs = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const StaffStack = createStackNavigator();
const SearchStack = createStackNavigator();
const AdminWorkingHourStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const ServicesStack = createStackNavigator();

const UserHomeStack = createStackNavigator();

const HomeStackScreen = () => (
    <HomeStack.Navigator>
        <HomeStack.Screen options={({ }) => ({
                title: 'Home'
            })} name="AdminHome" component={AdminHome} />
        <HomeStack.Screen
            name="Details"
            component={AdminDetails}
            options={({ route }) => ({
                title: route.params.name
            })}
        />
    </HomeStack.Navigator>
);

const StaffStackScreen = () => (
    <StaffStack.Navigator>
        <StaffStack.Screen options={({ }) => ({
                title: 'Staff'
            })} name="Staff" component={Staff} />
        <StaffStack.Screen
            name="Staff Details"
            component={StaffDetails}
            options={({ route }) => ({
                title: route.params.data.name
            })}
        />
    </StaffStack.Navigator>
);

const WorkingHourStackScreen = () => (
    <AdminWorkingHourStack.Navigator>
        <AdminWorkingHourStack.Screen name="Working Hour" component={WorkingHour} />
    </AdminWorkingHourStack.Navigator>
);

const SearchStackScreen = () => (
    <SearchStack.Navigator>
        <SearchStack.Screen name="Search" component={Search} />
        <SearchStack.Screen name="Search2" component={Search2} />
    </SearchStack.Navigator>
);

const ProfileStackScreen = () => (
    <ProfileStack.Navigator>
        <ProfileStack.Screen name="Profile" component={AdminProfile} />
    </ProfileStack.Navigator>
);

const ServicesStackScreen = () => (
    <ServicesStack.Navigator>
        <ServicesStack.Screen name="Services" component={Services} />
    </ServicesStack.Navigator>
)

const TabsScreen = () => (
    <Tabs.Navigator>
        <Tabs.Screen name="Home" component={HomeStackScreen} />
        <Tabs.Screen name="Search" component={SearchStackScreen} />
    </Tabs.Navigator>
);

const AdminDrawer = createDrawerNavigator();
const AdminDrawerScreen = () => (
    <AdminDrawer.Navigator initialRouteName="Home" drawerContent={props => <CustomAdminDrawer {...props} />} >
        <AdminDrawer.Screen name="Home" component={TabsScreen} />
        <AdminDrawer.Screen name="Profile" component={ProfileStackScreen} />
        <AdminDrawer.Screen name="WorkingHour" component={WorkingHourStackScreen} />
        <AdminDrawer.Screen name="Staff" component={StaffStackScreen} />
        <AdminDrawer.Screen name="Services" component={ServicesStackScreen} />
    </AdminDrawer.Navigator>
);

const UserHomeStackScreen = () => (
    <UserHomeStack.Navigator>
        <UserHomeStack.Screen options={({ }) => ({
                title: 'Home'
            })} name="userHome" component={UserHome} />
    </UserHomeStack.Navigator>
);

const UserDrawer = createDrawerNavigator();
const UserDrawerScreen = () => (
    <UserDrawer.Navigator initialRouteName="Home" drawerContent={props => <CustomUserDrawer {...props} />} >
        <UserDrawer.Screen name="Home" component={UserHomeStackScreen} />
    </UserDrawer.Navigator>
);

const RootStack = createStackNavigator();
const RootStackScreen = ({ userToken, userType }) => (
    <RootStack.Navigator headerMode="none">
        {userToken && userType == 'admin' ? (
            <RootStack.Screen
                name="App"
                component={AdminDrawerScreen}
                options={{
                    animationEnabled: false
                }}
            />
        ) : userToken && userType == 'user' ? (
            <RootStack.Screen
                name="App"
                component={UserDrawerScreen}
                options={{
                    animationEnabled: false
                }}
            />
        ) : (
                <RootStack.Screen
                    name="Auth"
                    component={AuthStackScreen}
                    options={{
                        animationEnabled: false
                    }}
                />
            )}
    </RootStack.Navigator>
);

export default () => {
    //   const [isLoading, setIsLoading] = React.useState(true);
    //   const [userToken, setUserToken] = React.useState(null);

    const initialLoginState = {
        isLoading: true,
        userName: null,
        userToken: null,
        userType: null
    }

    const loginReducer = (prevState, action) => {
        switch (action.type) {
            case 'RETRIVE_TOKEN':
                return {
                    ...prevState,
                    userToken: action.token,
                    userType: action.loginType,
                    isLoading: false
                };
            case 'LOGIN':
                return {
                    ...prevState,
                    userName: action.id,
                    userToken: action.token,
                    userType: action.loginType,
                    isLoading: false
                };
            case 'LOGOUT':
                return {
                    ...prevState,
                    userName: null,
                    userToken: null,
                    isLoading: false
                };
            case 'REGISTER':
                return {
                    ...prevState,
                    userName: action.id,
                    userToken: action.token,
                    userType: action.loginType,
                    isLoading: false
                };
        }
    };

    const [loginState, dispatch] = React.useReducer(loginReducer, initialLoginState);

    const authContext = React.useMemo(() => {
        return {
            signIn: async (foundUser) => {
                // setIsLoading(false);
                // setUserToken("asdf");
                const userToken = String(foundUser[0].userToken);
                const userName = foundUser[0].username;
                const loginType = foundUser[0].type;
                try {
                    await AsyncStorage.setItem('userToken', userToken)
                    await AsyncStorage.setItem('loginType', loginType)
                } catch (e) {
                    console.log(e);
                }
                dispatch({ type: 'LOGIN', id: userName, token: userToken, loginType: loginType });
            },
            signOut: async () => {
                // setIsLoading(false);
                // setUserToken(null);
                try {
                    await AsyncStorage.removeItem('userToken')
                } catch (e) {
                    console.log(e);
                }
                dispatch({ type: 'LOGOUT' });
            },
            signUp: async (createdUser) => {
                // setIsLoading(false);
                // setUserToken("asdf");
                const userToken = String(createdUser[0].userToken);
                const userName = createdUser[0].username;
                const loginType = createdUser[0].type;
                try {
                    await AsyncStorage.setItem('userToken', userToken)
                    await AsyncStorage.setItem('loginType', loginType)
                } catch (e) {
                    console.log(e);
                }
                dispatch({ type: 'REGISTER', id: userName, token: userToken, loginType: loginType });
            }
        };
    }, []);

    React.useEffect(() => {
        setTimeout(async () => {
            //setIsLoading(false);
            let userToken;
            let loginType;
            userToken = null;
            loginType = null;
            try {
                userToken = await AsyncStorage.getItem('userToken');
                loginType = await AsyncStorage.getItem('loginType');
            } catch (e) {
                console.log(e);
            }
            dispatch({ type: 'RETRIVE_TOKEN', token: userToken, loginType: loginType });
        }, 1000);
    }, []);

    if (loginState.isLoading) {
        return <Splash />;
    }

    return (
        <AuthContext.Provider value={authContext}>
            <NavigationContainer>
                <RootStackScreen userToken={loginState.userToken} userType={loginState.userType} />
            </NavigationContainer>
        </AuthContext.Provider>
    );
};
