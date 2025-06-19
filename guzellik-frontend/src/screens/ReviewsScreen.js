// src/screens/ReviewsScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  Platform,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const API_BASE = 'http://192.168.1.197:5000/api';

export default function ReviewsScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);       // ⚠️ generics kaldırıldı
  const [service, setService] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadReviews = async () => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      const response = await axios.get(
        `${API_BASE}/reviews`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReviews(response.data);
    } catch (err) {
      console.error('Yorum yükleme hatası:', err);
      Alert.alert('Hata', 'Yorumlar yüklenemedi.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleSubmit = async () => {
    if (!service.trim() || !comment.trim()) {
      return Alert.alert('Hata', 'Hizmet ve yorum girin.');
    }
    setSubmitting(true);
    try {
      const token = await SecureStore.getItemAsync('userToken');
      await axios.post(
        `${API_BASE}/reviews`,
        { service, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setService('');
      setComment('');
      await loadReviews();
    } catch (err) {
      console.error('Yorum ekleme hatası:', err);
      Alert.alert('Hata', 'Yorum eklenemedi.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#4e2c33" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient colors={['#fce8cc', '#f5ebe0']} style={styles.container}>
        {/* Geri Butonu */}
        <View style={styles.backContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={28} color="#4e2c33" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>Yorumlarım</Text>

          {/* Mevcut Yorumlar */}
          {reviews.map((r) => (
            <View key={r.id} style={styles.card}>
              <Text style={styles.cardService}>{r.service}</Text>
              <Text style={styles.cardComment}>{r.comment}</Text>
              <Text style={styles.cardDate}>
                {new Date(r.created_at).toLocaleDateString()}
              </Text>
            </View>
          ))}

          {/* Yorum Ekleme Formu */}
          <Text style={styles.sectionTitle}>Yeni Yorum Ekle</Text>
          <TextInput
            style={styles.input}
            placeholder="Hizmet (örn. Cilt Bakımı)"
            value={service}
            onChangeText={setService}
          />
          <TextInput
            style={[styles.input, { height: 100 }]}
            placeholder="Yorumunuz..."
            multiline
            value={comment}
            onChangeText={setComment}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit}
            disabled={submitting}
          >
            {submitting
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.buttonText}>Gönder</Text>}
          </TouchableOpacity>
        </ScrollView>
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
  container: { flex: 1 },
  backContainer: {
    padding: 20,
    paddingTop: Platform.OS === 'android'
      ? StatusBar.currentHeight + 10
      : 10,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4e2c33',
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
  },
  cardService: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4e2c33',
  },
  cardComment: {
    marginTop: 6,
    fontSize: 14,
    color: '#333',
  },
  cardDate: {
    marginTop: 8,
    fontSize: 12,
    color: '#888',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4e2c33',
    marginTop: 24,
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#4e2c33',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#e91e63',
    textAlign: 'center',
    marginTop: 20,
  },
});
