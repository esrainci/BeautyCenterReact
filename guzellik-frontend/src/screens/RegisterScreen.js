// screens/RegisterScreen.js

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
import { useNavigation } from '@react-navigation/native';  // <-- kullan
import { registerUser } from '../services/authService';

const { width } = Dimensions.get('window');

export default function RegisterScreen() {
  const navigation = useNavigation();  // <-- navigation objesi

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
  });
  const [focusedField, setFocusedField] = useState(null);

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleRegister = async () => {
    try {
      const response = await registerUser(form);
      console.log('Kayıt Başarılı:', response);

      // Kayıt başarılıysa Login ekranına dön
      navigation.replace('Login');  
      // eğer kullanıcı geri gelmek isterse: navigation.navigate('Login');
    } catch (error) {
      console.error(
        'Kayıt Hatası:',
        error.response?.data?.message || error.message
      );
    }
  };

  const handleGoToLogin = () => {
    navigation.navigate('Login');
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
            height="60"
            width={width}
            viewBox={`0 0 ${width} 60`}
            style={styles.wave}
          >
            <Path
              d={`M0,0 C${width / 2},60 ${width / 2},60 ${width},0 L${width},60 L0,60 Z`}
              fill="#b68677"
            />
          </Svg>

          {/* ALT FORM BLOK */}
          <View style={styles.formContainer}>
            <Text style={styles.title}>Kayıt Ol</Text>

            <TextInput
              value={form.name}
              onChangeText={text => handleChange('name', text)}
              onFocus={() => setFocusedField('name')}
              onBlur={() => setFocusedField(null)}
              placeholder={focusedField === 'name' ? '' : 'İsim-Soyisim'}
              placeholderTextColor="#fce8cc"
              style={styles.input}
            />
            <TextInput
              value={form.phone}
              onChangeText={text => handleChange('phone', text)}
              onFocus={() => setFocusedField('phone')}
              onBlur={() => setFocusedField(null)}
              placeholder={focusedField === 'phone' ? '' : 'Telefon'}
              placeholderTextColor="#fce8cc"
              style={styles.input}
              keyboardType="phone-pad"
            />
            <TextInput
              value={form.email}
              onChangeText={text => handleChange('email', text)}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
              placeholder={focusedField === 'email' ? '' : 'E-mail'}
              placeholderTextColor="#fce8cc"
              style={styles.input}
              keyboardType="email-address"
            />
            <TextInput
              value={form.password}
              onChangeText={text => handleChange('password', text)}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
              placeholder={focusedField === 'password' ? '' : 'Şifre'}
              placeholderTextColor="#fce8cc"
              style={styles.input}
              secureTextEntry
            />

            <TouchableOpacity style={styles.button} onPress={handleRegister}>
              <Text style={styles.buttonText}>Kayıt Ol</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleGoToLogin}>
              <Text style={styles.switchText}>
                Zaten hesabın var mı? Giriş Yap
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
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
  wave: {
    marginTop: -1,
  },
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
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  switchText: {
    color: '#fff',
    marginTop: 20,
    textDecorationLine: 'underline',
    fontSize: 14,
  },
});
