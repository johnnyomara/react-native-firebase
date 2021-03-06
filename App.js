import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react'
import { firebase } from './src/firebase/config'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { LoginScreen, HomeScreen, RegistrationScreen, PokedexScreen } from './src/screens'
import {decode, encode} from 'base-64'
import store from './src/store'
import {Provider} from 'react-redux'
import * as Font from 'expo-font';
import { AppLoading } from 'expo';
if (!global.btoa) {  global.btoa = encode }
if (!global.atob) { global.atob = decode }

const Stack = createStackNavigator();

const fetchFonts = () => {
  return Font.loadAsync(
  {PokemonGB: require('./assets/fonts/PokemonGB.ttf') }
)};

export default function App() {

  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  // const [dataLoaded, setDataLoaded] = useState(false)

  // if (!dataLoaded) {
  //   return (
  //     <AppLoading
  //     startAsync = {fetchFonts}
  //     onFinish={()=> setDataLoaded(true)}
  //     />
  //   );
  // }


  useEffect(() => {
    const usersRef = firebase.firestore().collection('users');
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        usersRef
          .doc(user.uid)
          .get()
          .then((document) => {
            const userData = document.data()
            setLoading(false)
            setUser(userData)
          })
          .catch((error) => {
            setLoading(false)
          });
      } else {
        setLoading(false)
      }
    });
  }, []);

  if (loading) {
    return (
      <AppLoading
      startAsync = {fetchFonts}
      onFinish={()=> setLoading(false)}
      />
    )
  }

  return (
    <Provider store={store}>
    <NavigationContainer>
      <Stack.Navigator>
        { user ? (
          <Stack.Screen name="Pokedex">
            {props => <PokedexScreen {...props} extraData={user} />}
          </Stack.Screen>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Registration" component={RegistrationScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
    </Provider>
  );
}


