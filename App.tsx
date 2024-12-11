import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './screens/HomeScreen';
import ReceiptEditorScreen from './screens/ReceiptEditorScreen';

export type RootStackParamList = {
  Home: undefined;
  ReceiptEditor: { receiptData: ReceiptData };
};

export interface Product {
  name: string;
  price: number;
  quantity: number;
}

export interface ReceiptData {
  date: string;
  store: string;
  products: Product[];
  taxes: number;
  total: number;
}

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="ReceiptEditor" component={ReceiptEditorScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
