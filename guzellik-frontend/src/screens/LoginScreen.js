// screens/LoginScreen.js

import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  Dimensions,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';                      // ← ekledik
import { loginUser } from '../services/authService';

const { width } = Dimensions.get('window');
const API_BASE = 'http://192.168.1.197:5000/api'; // kendi IP’nizi ayarlayın

export default function LoginScreen() {
  const navigation = useNavigation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [focusedField, setFocusedField] = useState(null);

  const handleChange = (key, value) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const handleLogin = async () => {
    try {
      // 1. authService ile login olup token al
      const { token } = await loginUser(form);
      console.log('Giriş Başarılı, token:', token);

      // 2. Token'ı SecureStore'a kaydet
      await SecureStore.setItemAsync('userToken', token);

      // 3. Profil çağrısı, içinde role olacak
      const profileRes = await axios.get(
        `${API_BASE}/auth/profile`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const { role } = profileRes.data;

      // 4. role’a göre yönlendir
      if (role === 'employee') {
        navigation.replace('CalisanHome');  // çalışan ekranı
      } else {
        navigation.replace('Home');         // normal user
      }
    } catch (error) {
      console.error(
        'Giriş Hatası:',
        error.response?.data?.message || error.message
      );
      // dilerseniz bir Alert ekleyebilirsiniz
    }
  };

  const handleGoToRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          {/* ÜST BEYAZ BLOK */}
          <View style={styles.topContainer}>
            <Image
              source={{ uri: 'https://i.imgur.com/EmL5SvO.png' }}
              style={styles.logo}
            />
          </View>

          {/* DALGA GEÇİŞ */}
          <Svg
            height={60}
            width={width}
            viewBox={`0 0 ${width} 60`}
            style={styles.wave}
          >
            <Path
              d={`M0,0 C${width / 2},60 ${width / 2},60 ${width},0 L${width},60 L0,60 Z`}
              fill="#b68677"
            />
          </Svg>

          {/* FORM BLOĞU */}
          <View style={styles.formContainer}>
            <Text style={styles.title}>Giriş Yap</Text>

            <TextInput
              value={form.email}
              onChangeText={t => handleChange('email', t)}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
              placeholder={focusedField === 'email' ? '' : 'E-mail'}
              placeholderTextColor="#fce8cc"
              style={styles.input}
              keyboardType="email-address"
            />
            <TextInput
              value={form.password}
              onChangeText={t => handleChange('password', t)}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
              placeholder={focusedField === 'password' ? '' : 'Şifre'}
              placeholderTextColor="#fce8cc"
              style={styles.input}
              secureTextEntry
            />

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Giriş Yap</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleGoToRegister}>
              <Text style={styles.switchText}>
                Hesabın yok mu? Kayıt Ol
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// (stil kodunuz aynen kalabilir)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  topContainer: {
    backgroundColor: '#ffffff',
    alignItems: 'center',
    paddingTop: 40,
    zIndex: 1,
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: -25,
  },
  wave: { marginTop: -1 },
  formContainer: {
    flex: 1,
    backgroundColor: '#b68677',
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    color: '#fce8cc',
    fontWeight: 'bold',
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#4e2c33',
    width: '100%',
    padding: 14,
    borderRadius: 30,
    marginBottom: 15,
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#4e2c33',
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 30,
    marginTop: 10,
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  switchText: {
    color: '#fff',
    marginTop: 20,
    textDecorationLine: 'underline',
    fontSize: 14,
  },
});
