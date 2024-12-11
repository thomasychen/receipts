import React, { useState } from 'react';
import { View, Button, ScrollView, StyleSheet, Text } from 'react-native';
import EditableTable from '../components/EditableTable';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, Product } from '../App';

type ReceiptEditorScreenRouteProp = RouteProp<RootStackParamList, 'ReceiptEditor'>;
type ReceiptEditorScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ReceiptEditor'>;

interface Props {
  route: ReceiptEditorScreenRouteProp;
  navigation: ReceiptEditorScreenNavigationProp;
}

export default function ReceiptEditorScreen({ route, navigation }: Props) {
  const { receiptData } = route.params;
  console.log(receiptData.products);
  
  const [products, setProducts] = useState<Product[]>(receiptData.products || []);
  const [tax, setTax] = useState<number>(receiptData.taxes || 0);
  const [total, setTotal] = useState<number>(receiptData.total || 0);

  const handleProductsChange = (updatedProducts: Product[]) => {
    setProducts(updatedProducts);
    console.log(products)
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Edit Your Receipt</Text>
      <EditableTable products={products} onChange={handleProductsChange} />
      <View style={styles.footer}>
        <Text>Tax: {tax.toFixed(2)}</Text>
        <Text>Total: {total.toFixed(2)}</Text>
      </View>
      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    padding:20
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom:10
  },
  footer: {
    marginTop:20,
    marginBottom:40
  }
});
