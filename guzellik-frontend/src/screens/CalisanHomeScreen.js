// src/screens/CalisanHomeScreen.js
import React, { useEffect, useState } from 'react'
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Platform,
  StatusBar,
} from 'react-native'
import { Calendar } from 'react-native-calendars'
import axios from 'axios'
import * as SecureStore from 'expo-secure-store'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'

const API_BASE = 'http://192.168.1.197:5000/api'

export default function CalisanHomeScreen() {
  const nav = useNavigation()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState(null)

  // Tek sabit randevu
  const appointments = [
    {
      id: '1',
      date: '30-05-2025T14:00:00.000Z',
      service: 'Cilt Bakımı',
      client_name: 'İnci Hanım',
    },
  ]

  useEffect(() => {
    ;(async () => {
      try {
        const token = await SecureStore.getItemAsync('userToken')
        if (!token) throw new Error('Token bulunamadı')

        // Profil bilgisi
        const profRes = await axios.get(
          `${API_BASE}/auth/profile`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        setProfile(profRes.data)
      } catch (err) {
        console.error('Profil yükleme hatası:', err)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#4e2c33" />
      </SafeAreaView>
    )
  }

  if (!profile) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.errorText}>Profil bilgisi yüklenemedi.</Text>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => nav.replace('Login')}>
          <Ionicons name="exit-outline" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Çalışan Paneli</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Profil */}
      <View style={styles.profileCard}>
        <Text style={styles.profileName}>{profile.name}</Text>
        <Text style={styles.profileInfo}>{profile.email}</Text>
        <Text style={styles.profileInfo}>{profile.phone || '—'}</Text>
      </View>

      {/* Takvim */}
      <Text style={styles.sectionTitle}>Randevularım</Text>
      <Calendar
        style={styles.calendar}
        theme={{
          selectedDayBackgroundColor: '#4e2c33',
          todayTextColor: '#4e2c33',
          arrowColor: '#4e2c33',
        }}
        markedDates={{
          '2025-05-30': {
            selected: true,
            marked: true,
            selectedColor: '#4e2c33',
          },
        }}
      />

      {/* Randevular */}
      <Text style={styles.sectionTitle}>Randevularım</Text>
      <FlatList
        data={appointments}
        keyExtractor={(i) => i.id}
        contentContainerStyle={
          appointments.length === 0 && styles.emptyContainer
        }
        renderItem={({ item }) => (
          <View style={styles.apptItem}>
            <Text style={styles.apptDate}>
              {item.date.split('T')[0]} @ {item.date.split('T')[1].slice(0,5)}
            </Text>
            <Text style={styles.apptService}>
              {item.service} — Müşteri: {item.client_name}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Hiç randevunuz yok.</Text>
        }
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  header: {
    height: 56,
    backgroundColor: '#4e2c33',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },

  profileCard: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 8,
    padding: 16,
    elevation: 2,
  },
  profileName: { fontSize: 20, fontWeight: 'bold', color: '#4e2c33' },
  profileInfo: { fontSize: 14, color: '#333', marginTop: 4 },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4e2c33',
    marginHorizontal: 16,
    marginTop: 12,
  },

  calendar: {
    marginHorizontal: 16,
    borderRadius: 8,
    elevation: 2,
  },

  apptItem: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 6,
    padding: 12,
    elevation: 1,
  },
  apptDate: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  apptService: { fontSize: 14, color: '#555', marginTop: 4 },

  emptyContainer: { flexGrow: 1, justifyContent: 'center' },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
    marginTop: 20,
  },
  errorText: { color: '#e91e63', fontSize: 16 },
})
