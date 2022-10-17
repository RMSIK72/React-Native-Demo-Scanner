import React, { useLayoutEffect, useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, Button, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { connect, useSelector } from 'react-redux';
import { AppStyles } from '../AppStyles';
import { Configuration } from '../Configuration';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useIsFocused } from '@react-navigation/native';

export default function ScanScreen({navigation}) {
  const auth = useSelector((state) => state.auth);

  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [text, setText] = useState(null);
  const [barcodeScannerKey, setBarcodeScannerKey] = useState(1);

  const isFocused = useIsFocused();

  const askForCameraPermission = () => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })()
  }

  useEffect(() => {
    askForCameraPermission();
  }, []);

  useEffect(() => {
    setScanned(false);
    setBarcodeScannerKey(new Date().getTime());
  }, [isFocused]);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setText(data);
  }

  if (hasPermission == null) {
    return (
      <View>
        <Text style={styles.title}>Request Camera Permission</Text>
      </View>
    )
  }

  if (hasPermission == false) {
    return (
      <View>
        <Text style={styles.title}>Please enable Camera Permission</Text>
        <Pressable
          style={styles.buttonContainer}
          onPress={() => askForCameraPermission()}>
          <Text style={styles.buttonText}>Allow Camera </Text>
        </Pressable>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View>
      <Text>{scanned}</Text>
      </View>
      <View style={styles.barcodebox}>
        <BarCodeScanner
          key={barcodeScannerKey}
          onBarCodeScanned={scanned ? null : handleBarCodeScanned}
          style={{ height: 400, width: 400, alignContent: 'center' }} />
      </View>
      <Text style={styles.maintext}>{text}</Text>

      {scanned && 
         <Pressable
         style={styles.buttonContainer}
         onPress={() => setScanned(false)}>
         <Text style={styles.buttonText}>Scan Again</Text>
       </Pressable>
      }
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    flexDirection: 'column',
    padding: Configuration.home.listing_item.offset,
    justifyContent: 'center',
    alignItems: 'center'
  },
  maintext: {
    fontSize: 16,
    margin: 20,
  },
  barcodebox: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
    width: 300,
    overflow: 'hidden',
    borderRadius: 30,
    backgroundColor: 'pink'
  },
  buttonContainer: {
    width: AppStyles.buttonWidth.main,
    backgroundColor: AppStyles.color.tint,
    borderRadius: AppStyles.borderRadius.main,
    padding: 10,
    marginTop: 30,
  },
  buttonText: {
    color: AppStyles.color.white,
    textAlign: 'center'
  },
});
