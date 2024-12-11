import React, { useState } from 'react';
import { View, TextInput, Text, Button, StyleSheet, ScrollView } from 'react-native';
import CheckBox from 'expo-checkbox';
import { Product } from '../App';

interface EditableTableProps {
  products: Product[];
  onChange: (updatedProducts: Product[]) => void;
}

interface Row extends Product {
  buyers: { [buyerName: string]: boolean };
}

export default function EditableTable({ products, onChange }: EditableTableProps) {
  const [rows, setRows] = useState<Row[]>(
    products.map(p => ({
      ...p,
      buyers: {}
    }))
  );
  const [buyers, setBuyers] = useState<string[]>([]);

  const handleFieldChange = (index: number, field: keyof Product, value: string) => {
    const updatedRows = [...rows];
    if (field === 'price' || field === 'quantity') {
      const numericVal = parseFloat(value) || 0;
      updatedRows[index][field] = numericVal;
    } else {
      updatedRows[index][field] = value as any;
    }
    setRows(updatedRows);
    onChange(updatedRows);
  };

  const addBuyer = () => {
    const newBuyer = `Buyer ${buyers.length + 1}`;
    setBuyers([...buyers, newBuyer]);
    // Initialize their checkbox states
    const updatedRows = rows.map(row => {
      row.buyers[newBuyer] = false;
      return row;
    });
    setRows(updatedRows);
  };

  const toggleBuyer = (rowIndex: number, buyer: string) => {
    const updatedRows = [...rows];
    updatedRows[rowIndex].buyers[buyer] = !updatedRows[rowIndex].buyers[buyer];
    setRows(updatedRows);
  };

  const calculateBuyerTotals = () => {
    const buyerTotals: { [buyer: string]: number } = {};
    buyers.forEach(b => { buyerTotals[b] = 0; });

    rows.forEach(row => {
      const itemBuyers = buyers.filter(b => row.buyers[b]);
      if (itemBuyers.length > 0) {
        const perBuyerCost = (row.price * row.quantity) / itemBuyers.length;
        itemBuyers.forEach(b => {
          buyerTotals[b] += perBuyerCost;
        });
      }
    });

    return buyerTotals;
  };

  const buyerTotals = calculateBuyerTotals();

  return (
    <View style={styles.container}>
      <ScrollView horizontal>
        <View>
          <View style={[styles.row, styles.headerRow]}>
            <Text style={styles.headerCell}>Name</Text>
            <Text style={styles.headerCell}>Price</Text>
            <Text style={styles.headerCell}>Qty</Text>
            {buyers.map(buyer => (
              <Text key={buyer} style={styles.headerCell}>{buyer}</Text>
            ))}
          </View>
          {rows.map((row, idx) => (
            <View key={idx} style={styles.row}>
              <TextInput
                style={styles.cellInput}
                value={row.name}
                onChangeText={val => handleFieldChange(idx, 'name', val)}
              />
              <TextInput
                style={styles.cellInput}
                value={row.price.toString()}
                keyboardType="numeric"
                onChangeText={val => handleFieldChange(idx, 'price', val)}
              />
              <TextInput
                style={styles.cellInput}
                value={row.quantity.toString()}
                keyboardType="numeric"
                onChangeText={val => handleFieldChange(idx, 'quantity', val)}
              />
              {buyers.map(buyer => (
                <View key={buyer} style={styles.checkboxCell}>
                  <CheckBox
                    value={row.buyers[buyer] || false}
                    onValueChange={() => toggleBuyer(idx, buyer)}
                  />
                </View>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <Button title="Add Buyer Column" onPress={addBuyer} />
      </View>
      {buyers.length > 0 && (
        <View style={styles.buyerTotalsContainer}>
          <Text style={styles.totalsTitle}>Buyer Totals:</Text>
          {buyers.map(b => (
            <Text key={b} style={styles.totalLine}>{b}: {buyerTotals[b].toFixed(2)}</Text>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    marginVertical:20,
    borderWidth:1,
    borderColor:'#ccc',
    borderRadius:8,
    padding:10
  },
  row:{
    flexDirection:'row',
    alignItems:'center',
    borderBottomWidth:1,
    borderColor:'#ddd'
  },
  headerRow:{
    backgroundColor:'#f0f0f0'
  },
  headerCell:{
    padding:5,
    width:80,
    textAlign:'center',
    fontWeight:'bold'
  },
  cellInput:{
    padding:5,
    width:80,
    borderWidth:1,
    borderColor:'#ccc',
    margin:2
  },
  checkboxCell:{
    width:80,
    alignItems:'center',
    justifyContent:'center',
    flexDirection:'row'
  },
  buttonContainer:{
    marginTop:10
  },
  buyerTotalsContainer:{
    marginTop:20
  },
  totalsTitle:{
    fontWeight:'bold',
    fontSize:16,
    marginBottom:5
  },
  totalLine:{
    fontSize:14
  }
});
