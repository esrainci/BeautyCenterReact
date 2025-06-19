// src/screens/ProfileScreen.js

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
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
import { Calendar } from 'react-native-calendars';
import DateTimePicker from '@react-native-community/datetimepicker';

const API_BASE = 'http://192.168.1.197:5000/api';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  // Local-only favorites (no API)
  const services = ['Cilt Bakımı', 'Masaj Terapisi', 'Saç Bakımı'];
  const [favorites, setFavorites] = useState([]);
  const toggleFavorite = svc => {
    setFavorites(f =>
      f.includes(svc) ? f.filter(x => x !== svc) : [...f, svc]
    );
  };

  // Appointment state
  const [appointment, setAppointment] = useState({ date: '2025-05-28T13:00:00', service: 'Cilt Bakımı' });
  const [editing, setEditing] = useState(false);
  const [tempDate, setTempDate] = useState(new Date(appointment.date));
  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState('date');

  const onChangeDateTime = (event, selectedDate) => {
    setShowPicker(false);
    if (selectedDate) {
      setTempDate(selectedDate);
    }
  };

  const showDatePicker = () => {
    setPickerMode('date');
    setShowPicker(true);
  };

  const showTimePicker = () => {
    setPickerMode('time');
    setShowPicker(true);
  };

  const saveAppointment = () => {
    setAppointment({ ...appointment, date: tempDate.toISOString() });
    setEditing(false);
  };

  const cancelEditing = () => {
    setTempDate(new Date(appointment.date));
    setEditing(false);
  };

  useEffect(() => {
    (async () => {
      try {
        const token = await SecureStore.getItemAsync('userToken');
        const { data } = await axios.get(
          `${API_BASE}/auth/profile`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProfile(data);
      } catch (err) {
        console.error('Profil yükleme hatası:', err);
        Alert.alert('Hata', 'Profil bilgisi yüklenemedi.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('userToken');
    navigation.replace('Login');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#4e2c33" />
      </SafeAreaView>
    );
  }
  if (!profile) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.errorText}>Profil bilgisi yüklenemedi.</Text>
      </SafeAreaView>
    );
  }

  // Format date for non-edit view as DD-MM-YYYY
  const dateObj = new Date(appointment.date);
  const formattedDate = `${('0' + dateObj.getDate()).slice(-2)}-${('0' + (dateObj.getMonth() + 1)).slice(-2)}-${dateObj.getFullYear()}`;

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
          <Text style={styles.title}>Profilim</Text>

          {/* Kişisel Bilgiler */}
          <View style={styles.card}>
            <Text style={styles.label}>Ad Soyad</Text>
            <Text style={styles.value}>{profile.name}</Text>
            <Text style={styles.label}>E-Mail</Text>
            <Text style={styles.value}>{profile.email}</Text>
            <Text style={styles.label}>Telefon</Text>
            <Text style={styles.value}>{profile.phone || '—'}</Text>
            <Text style={styles.label}>Puan</Text>
            <Text style={styles.value}>{profile.points}</Text>
          </View>

          {/* Takvim – Randevu */}
          <Text style={styles.sectionTitle}>Randevularım Takvimde</Text>
          <Calendar
            markedDates={{
              [appointment.date.split('T')[0]]: { selected: true, selectedColor: '#4e2c33' }
            }}
            style={styles.calendar}
          />

          {/* Randevu Detayları */}
          <Text style={styles.sectionTitle}>Randevu Detayları</Text>
          <View style={styles.apptCard}>
            {editing ? (
              <>
                <TouchableOpacity onPress={showDatePicker}>
                  <Text style={styles.apptText}>Tarih: {tempDate.toLocaleDateString()}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={showTimePicker}>
                  <Text style={styles.apptText}>Saat: {tempDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                </TouchableOpacity>
                {showPicker && (
                  <DateTimePicker
                    value={tempDate}
                    mode={pickerMode}
                    display="default"
                    onChange={onChangeDateTime}
                    minimumDate={new Date()}
                  />
                )}
                <View style={styles.editActions}>
                  <TouchableOpacity style={styles.saveButton} onPress={saveAppointment}>
                    <Text style={styles.saveText}>Kaydet</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.cancelButton} onPress={cancelEditing}>
                    <Text style={styles.cancelText}>İptal</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <Text style={styles.apptText}>
                  {formattedDate} @ {new Date(appointment.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} — {appointment.service}
                </Text>
                <TouchableOpacity style={styles.editButton} onPress={() => setEditing(true)}>
                  <Text style={styles.editText}>Düzenle</Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          {/* Fake Favorites */}
          <Text style={styles.sectionTitle}>Favori Hizmetler</Text>
          <View style={styles.favContainer}>
            {services.map(svc => {
              const active = favorites.includes(svc);
              return (
                <TouchableOpacity
                  key={svc}
                  style={[styles.favBtn, active && styles.favBtnActive]}
                  onPress={() => toggleFavorite(svc)}
                >
                  <Text style={[styles.favText, active && styles.favTextActive]}> {svc} </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Çıkış Yap */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Çıkış Yap</Text>
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
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 10,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4e2c33',
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    marginBottom: 20,
  },
  label: { fontSize: 14, color: '#6d4c41', marginTop: 12 },
  value: { fontSize: 18, color: '#333333', marginTop: 4 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4e2c33',
    marginTop: 20,
    marginBottom: 10,
  },
  calendar: { borderRadius: 8, elevation: 2 },
  apptCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    elevation: 1,
    marginBottom: 20,
  },
  apptText: { fontSize: 16, color: '#333', marginVertical: 4 },
  editButton: {
    marginTop: 10,
    alignSelf: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#4e2c33',
    borderRadius: 20,
  },
  editText: { color: '#fff' },
  editActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  saveButton: {
    flex: 1,
    marginRight: 5,
    backgroundColor: '#4e2c33',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveText: { color: '#fff', fontWeight: 'bold' },
  cancelButton: {
    flex: 1,
    marginLeft: 5,
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelText: { color: '#333', fontWeight: 'bold' },
  favContainer: { flexDirection: 'row', flexWrap: 'wrap' },
  favBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#4e2c33',
    margin: 4,
  },
  favBtnActive: { backgroundColor: '#4e2c33' },
  favText: { color: '#4e2c33', fontSize: 14 },
  favTextActive: { color: '#fff' },
  logoutButton: {
    backgroundColor: '#4e2c33',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 30,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: 16, color: '#e91e63' },
});