import React, { useState } from 'react';
import { View, Button, StyleSheet, Image, ActivityIndicator, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, ReceiptData } from '../App';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;
type HomeScreenRouteProp = RouteProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
  route: HomeScreenRouteProp;
}

const API_URL = 'http://10.41.164.100:8000'; // replace with your machine's IP and port

export default function HomeScreen({ navigation }: Props) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const pickImage = async () => {
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!pickerResult.canceled && pickerResult.assets && pickerResult.assets.length > 0) {
      setSelectedImage(pickerResult.assets[0].uri);
    }
  };

  const submitImage = async () => {
    if (!selectedImage) {
      Alert.alert('No image selected', 'Please select an image first.');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: selectedImage,
        type: 'image/jpeg',
        name: 'receipt.jpg'
      } as any);

      const response = await fetch(`${API_URL}/process-image`, {
        method: 'POST',
        body: formData as BodyInit,
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const jsonResponse = (await response.json()) as ReceiptData;
      console.log(jsonResponse)

      navigation.navigate('ReceiptEditor', { receiptData: jsonResponse });
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Something went wrong while processing the image.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Pick an Image of Receipt" onPress={pickImage} />
      {selectedImage && <Image source={{ uri: selectedImage }} style={{ width: 200, height: 200, marginVertical: 10 }} />}
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <Button title="Submit to API" onPress={submitImage} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding:20,
    alignItems: 'center',
    justifyContent: 'center'
  },
});
