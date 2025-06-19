import jwtDecode from 'jwt-decode';
import * as SecureStore from 'expo-secure-store';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Platform,
  ActivityIndicator,
  Alert,
  Modal,
  FlatList,
  StatusBar,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Çalışan ve hizmet eşlemeleri
const servicesByEmployee = {
  'Samir Bey': ['Cilt Bakımı', 'Masaj Terapisi'],
  'Esranur Hanım': ['Saç Bakımı', 'Cilt Bakımı'],
  'İnci Hanım': ['Masaj Terapisi', 'Saç Bakımı'],
};
const employeeList = Object.keys(servicesByEmployee);
const timeSlots = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
const BASE_URL = 'http://192.168.1.197:5000/api/appointments';

export default function AppointmentScreen() {
  const navigation = useNavigation();
  const [employee, setEmployee] = useState(null);
  const [service, setService] = useState(null);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showEmpModal, setShowEmpModal] = useState(false);
  const [showSrvModal, setShowSrvModal] = useState(false);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({ name: '', phone: '', email: '' });

  useEffect(() => {
    // Token’dan kullanıcı bilgilerini çek
    const loadUserInfo = async () => {
      const token = await SecureStore.getItemAsync('userToken');
      if (token) {
        const decoded = jwtDecode(token);
        setUserInfo({
          name: decoded.name,
          phone: decoded.phone,
          email: decoded.email,
        });
      }
    };
    loadUserInfo();
  }, []);

  useEffect(() => {
    if (employee) {
      setService(servicesByEmployee[employee][0]);
    }
  }, [employee]);

  const formattedDate = date
    ? `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`
    : 'Tarih Seçiniz';

  const handleConfirmDate = (selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) setDate(selectedDate);
  };

const handleSubmit = async () => {
  if (!employee || !service || !date || !time) {
    Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
    return;
  }
  setLoading(true);
  try {
    const token = await SecureStore.getItemAsync('userToken');
  const payload = {
    employee,
    service,
    date: date?.toISOString(),
    time,
    name: userInfo.name,
    phone: userInfo.phone,
    email: userInfo.email,
  };

console.log('Payload:', payload);


    await axios.post(BASE_URL, payload, { headers: { Authorization: `Bearer ${token}` } });
    Alert.alert('Başarılı', 'Randevunuz başarıyla alındı!');
    navigation.navigate('Home');
  } catch (error) {
    console.error(error);
    Alert.alert('Hata', 'Randevu alınırken bir sorun oluştu.');
  } finally {
    setLoading(false);
  }
};


  const renderDropdown = (data, onSelect) => (
    <View style={styles.modalCard}>
      <FlatList
        data={data}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.dropdownItem}
            onPress={() => { onSelect(item); }}
          >
            <Text style={styles.dropdownText}>{item}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient colors={['#fce8cc', '#f5ebe0']} style={styles.container}>
        <View style={styles.backContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Ionicons name="arrow-back" size={28} color="#4e2c33" />
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Randevu Al</Text>

          {/* Çalışan Seç */}
          <Text style={styles.label}>Çalışan</Text>
          <TouchableOpacity style={styles.dropdown} onPress={() => setShowEmpModal(true)}>
            <Text style={styles.dropdownLabel}>{employee || 'Çalışan Seçiniz'}</Text>
          </TouchableOpacity>
          <Modal transparent visible={showEmpModal} animationType="slide">
            <TouchableOpacity style={styles.modalBg} onPress={() => setShowEmpModal(false)} />
            {renderDropdown(employeeList, (val) => { setEmployee(val); setShowEmpModal(false); })}
          </Modal>

          {/* Hizmet Seç */}
          <Text style={styles.label}>Hizmet</Text>
          <TouchableOpacity style={styles.dropdown} onPress={() => setShowSrvModal(true)}>
            <Text style={styles.dropdownLabel}>{service || 'Hizmet Seçiniz'}</Text>
          </TouchableOpacity>
          <Modal transparent visible={showSrvModal} animationType="slide">
            <TouchableOpacity style={styles.modalBg} onPress={() => setShowSrvModal(false)} />
            {employee && renderDropdown(servicesByEmployee[employee], (val) => { setService(val); setShowSrvModal(false); })}
          </Modal>

          {/* Tarih Seç */}
          <Text style={styles.label}>Tarih</Text>
          <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
            <Text>{formattedDate}</Text>
          </TouchableOpacity>
          <DateTimePickerModal
            mode="date"
            isVisible={showDatePicker}
            onConfirm={handleConfirmDate}
            onCancel={() => setShowDatePicker(false)}
          />

          {/* Saat Seç */}
          <Text style={styles.label}>Saat</Text>
          <TouchableOpacity style={styles.dropdown} onPress={() => setShowTimeModal(true)}>
            <Text style={styles.dropdownLabel}>{time || 'Saat Seçiniz'}</Text>
          </TouchableOpacity>
          <Modal transparent visible={showTimeModal} animationType="slide">
            <TouchableOpacity style={styles.modalBg} onPress={() => setShowTimeModal(false)} />
            {renderDropdown(timeSlots, (val) => { setTime(val); setShowTimeModal(false); })}
          </Modal>

          <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Gönder</Text>}
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f5ebe0', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  container: { flex: 1 },
  backContainer: { padding: 20, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 10 },
  content: { paddingHorizontal: 20, paddingBottom: 40 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#4e2c33', textAlign: 'center', marginBottom: 20 },
  label: { fontSize: 16, color: '#6d4c41', marginTop: 12, marginBottom: 6 },
  dropdown: { backgroundColor: '#fff', padding: 12, borderRadius: 8 },
  dropdownLabel: { fontSize: 16, color: '#333' },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  modalCard: { position: 'absolute', top: '30%', left: '10%', right: '10%', backgroundColor: '#fff', borderRadius: 8, maxHeight: '40%' },
  dropdownItem: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee' },
  dropdownText: { fontSize: 16, color: '#4e2c33' },
  input: { backgroundColor: '#fff', borderRadius: 8, padding: 12, fontSize: 16 },
  button: { backgroundColor: '#4e2c33', paddingVertical: 14, borderRadius: 30, marginTop: 24, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
