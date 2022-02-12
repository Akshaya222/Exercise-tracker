import React from "react";
import { createAppContainer } from "react-navigation";
import { createDrawerNavigator } from "react-navigation-drawer";
import { createStackNavigator } from "react-navigation-stack";
import { createSwitchNavigator } from "react-navigation";
import { Dimensions } from "react-native";
import { Feather } from "@expo/vector-icons";
import colors from "../constants/colors";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import SideBar from "../components/SideBar";

import StartScreen from "../screens/StartScreen";
import SignInScreen from "../screens/SignInScreen";
import SignUpScreen from "../screens/SignUpScreen";
import HomeScreen from "../screens/HomeScreen";
import CalorieScreen from "../screens/CalorieScreen";
import FeedbackScreen from "../screens/FeedbackScreen";
import FbFormScreen from "../screens/FbFormScreen";
import PaymentScreen from "../screens/PaymentScreen";
import UserProfile from "../screens/UserProfile";
import FavoritesScreen from "../screens/FavoritesScreen";
import RecentMealsScreen from "../screens/RecentMealsScreen";
import InitialReccomendation from "../screens/InitialReccomendation";
import AdminHomeScreen from "../adminScreens/HomeScreen";
import AdminPricingScreen from "../adminScreens/PricingPlans";
import AdminUsersScreen from "../adminScreens/UsersScreen";
import PlanForm from "../adminScreens/PlanForm";
import UserScreen from "../adminScreens/UserScreen";

const authStackNavigator = createStackNavigator(
  {
    startScreen: StartScreen,
    signInScreen: SignInScreen,
    signUpScreen: SignUpScreen,
    iniRecScr: InitialReccomendation,
  },
  {
    defaultNavigationOptions: {
      headerShown: false,
    },
  }
);

const uploadStackNavigator = createStackNavigator(
  {
    uploadScreen: HomeScreen,
    calorieScreen: CalorieScreen,
    recentMealsScreen: RecentMealsScreen,
  },
  {
    defaultNavigationOptions: {
      headerShown: false,
    },
  }
);

const FbStackNavigator = createStackNavigator(
  {
    fbScreen: FeedbackScreen,
    formScreen: FbFormScreen,
  },
  {
    defaultNavigationOptions: {
      headerShown: false,
    },
  }
);

const userStackNavigator = createStackNavigator(
  {
    user: UserProfile,
    adminScreen: AdminHomeScreen,
    usersScreen: AdminUsersScreen,
    adminPriScreen: AdminPricingScreen,
    planForm: PlanForm,
    userScreen: UserScreen,
  },
  {
    defaultNavigationOptions: {
      headerShown: false,
    },
  }
);

const DrawerNavigator = createDrawerNavigator(
  {
    homeScreen: {
      screen: uploadStackNavigator,
      navigationOptions: {
        title: "Home",
        drawerIcon: ({ tintColor }) => (
          <Feather name="home" size={16} color={tintColor} />
        ),
      },
    },
    feedbackScreen: {
      screen: FbStackNavigator,
      navigationOptions: {
        title: "Feedback",
        drawerIcon: ({ tintColor }) => (
          <Feather name="message-square" size={16} color={tintColor} />
        ),
      },
    },
    userScreen: {
      screen: userStackNavigator,
      navigationOptions: {
        title: "Profile",
        drawerIcon: ({ tintColor }) => (
          <Feather name="user" size={16} color={tintColor} />
        ),
      },
    },
    paymentScreen: {
      screen: PaymentScreen,
      navigationOptions: {
        title: "Pricing",
        drawerIcon: ({ tintColor }) => (
          <MaterialIcons name="payments" color={tintColor} size={20} />
        ),
      },
    },
    favoriteScreen: {
      screen: FavoritesScreen,
      navigationOptions: {
        title: "Favorites",
        drawerIcon: ({ tintColor }) => (
          <Feather name="heart" color={tintColor} size={20} />
        ),
      },
    },
  },
  {
    contentComponent: (props) => <SideBar {...props} />,
    drawerWidth: Dimensions.get("window").width * 0.85,
    hideStatusBar: true,

    contentOptions: {
      activeBackgroundColor: colors.buttonColor,
      activeTintColor: "white",
      itemsContainerStyle: {
        marginTop: 16,
        marginHorizontal: 8,
      },
      itemStyle: {
        borderRadius: 16,
      },
    },
  }
);

const switchNavigator = createSwitchNavigator({
  start: authStackNavigator,
  product: DrawerNavigator,
});

export default createAppContainer(switchNavigator);
