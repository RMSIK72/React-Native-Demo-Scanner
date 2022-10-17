import React, { useLayoutEffect, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import NetInfo from "@react-native-community/netinfo";

export default function MapScreen({ navigation }) {

  const [isConnected, setIsConnected] = useState(null);

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      console.log('Connection type', state.type);
      console.log('Is connected?', state.isConnected);
      setIsConnected(state.isConnected);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    (async () => {
      
      if(isConnected == null) {
        return;
      }
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      const subscribe = async () => {
        return await Location.watchPositionAsync(
          { accuracy: Location.LocationAccuracy.Highest },
          (newLocation) => {
            if(isConnected) {
              setLocation(newLocation)
              setErrorMsg(null)
            } else {
              setErrorMsg('No internet. Saving somehwere in DB probably idk')
            }
          }
        )
      }
  
      // return subscription promise
      subscribe()
        .then(result => subscription = result)
        .catch(err => console.warn(err))
  
      // return remove function for cleanup
      return () => {
          // To unsubscribe to these update, just use:
          unsubscribe();
          subscription.remove();
      }
    })();
  }, [isConnected]);

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.boldText}>{text}</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
    padding: 16,
  },
  boldText: {
    fontSize: 15,
    color: 'red',
  },
});
