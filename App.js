import React from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Dimensions,
  ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native";
import "react-native-gesture-handler";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import "react-native-url-polyfill/auto";
import bgImage from "./assets/bg-2.jpg";
import { globalStyles } from "./styles/GlobalStyles";
import VideoRecorder from "./VideoRecorder";

import Navigator from "./navigation/Navigator";
import authReducer from "./store/reducers/auth";
import feedbackReducer from "./store/reducers/feedback";
import imagesReducer from "./store/reducers/images";
import paymentReducer from "./store/reducers/payment";

import Recommendation from "./screens/InitialReccomendation";

import ApiTrial from "./screens/ApiTrial";

const reducers = combineReducers({
  auth: authReducer,
  feedback: feedbackReducer,
  image: imagesReducer,
  payment: paymentReducer,
});
const store = createStore(reducers, applyMiddleware(thunk));

export default function App() {
  return (
    <Provider store={store}>
      <Navigator></Navigator>
    </Provider>
    // <Recommendation/>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight,
  },
});
