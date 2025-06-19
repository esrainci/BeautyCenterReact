// screens/CalisanlarScreen.js

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Platform,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';

const employees = [
  {
    id: '1',
    name: 'Samir Bey',
    services: 'Cilt Bakımı, Masaj',
    description:
      'Samir Bey, yılların verdiği tecrübeyle derinlemesine cilt bakımı sunar. Masaj teknikleriyle vücudunuzu rahatlatır ve stresinizi azaltır.',
  },
  {
    id: '2',
    name: 'Esranur Hanım',
    services: 'Saç & Cilt Bakımı',
    description:
      'Profesyonel saç ve cilt bakımıyla doğal güzelliğinizi ortaya çıkarır, sağlıklı bir görünüm kazandırır.',
  },
  {
    id: '3',
    name: 'İnci Hanım',
    services: 'Masaj, Saç Bakımı',
    description:
      'Rahatlatıcı masaj ve besleyici saç bakımıyla hem fiziksel hem de ruhsal yenilenme sağlar.',
  },
];

export default function CalisanlarScreen() {
  const navigation = useNavigation();

  const renderItem = ({ item, index }) => (
    <Animatable.View
      animation="fadeInUp"
      delay={index * 150}
      style={styles.card}
    >
      {/* Avatar Icon */}
      <Ionicons
        name="person-circle-outline"
        size={48}
        color="#b68677"
        style={styles.avatar}
      />

      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.services}>{item.services}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </Animatable.View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      {/* Gradient Background */}
      <LinearGradient
        colors={[ '#fce8cc', '#f5ebe0' ]}
        style={styles.container}
      >
        {/* Custom back button */}
        <View style={styles.backContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Home')}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={28} color="#4e2c33" />
          </TouchableOpacity>
        </View>

        {/* List of Employees */}
        <FlatList
          data={employees}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f5ebe0',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
  },
  backContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  backButton: {
    padding: 6,
    alignSelf: 'flex-start',
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#b68677',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4,
    alignItems: 'center',
  },
  avatar: {
    marginBottom: 12,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4e2c33',
    marginBottom: 6,
    textAlign: 'center',
  },
  services: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6d4c41',
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: '#7e5a4e',
    lineHeight: 22,
    textAlign: 'justify',
  },
});
