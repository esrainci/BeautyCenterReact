// screens/HomeScreen.js

import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Pressable,
  ImageBackground,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
0
const services = [
  {
    id: '1',
    title: 'Cilt Bakımı',
    img: 'https://www.dermafix.co.za/wp-content/uploads/2016/05/Best-skin-care-advice-from-the-professionals.jpg',
    desc:
      'Özel cilt bakımı seçeneklerimizle cildinizi tazeleyin ve yenileyin. En son teknolojileri ve doğal ürünleri kullanarak cildinizin gençleşmesine yardımcı oluyoruz.',
  },
  {
    id: '2',
    title: 'Masaj Terapisi',
    img: 'https://www.drnilgunestetik.com/images/tum-vucut-masaj.jpg',
    desc:
      'Masaj terapisi, vücudunuzu rahatlatır ve stresinizi azaltır. Kaslarınızı gevşetmek ve ruhsal rahatlama sağlamak için uzman masörlerimizle çalışın.',
  },
  {
    id: '3',
    title: 'Saç Bakımı',
    img: 'https://cdn.shopify.com/s/files/1/0520/4983/8237/files/monthly_hair_care_maintenance.webp?v=1706626977',
    desc:
      'Saçlarınızın sağlığını koruyun ve güzel görünmesini sağlayın. Saç bakımı, saç tipinize özel tedaviler ve ürünler sunar.',
  },
];

const faqs = [
  {
    q: "1. Cilt bakımı için hangi yaşta başlamalıyım?",
    a:
      "Genellikle 20'li yaşlarda başlamak önerilir, ancak cilt tipinize göre erken yaşlarda da bakım yapılabilir.",
  },
  {
    q: "2. Randevumu nasıl alabilirim?",
    a:
      "Randevu almak için web sitemiz üzerinden online olarak ya da telefonla bizimle iletişime geçerek kolayca randevu oluşturabilirsiniz.",
  },
  {
    q: "3. Cilt bakımım için en uygun tedavi hangi hizmetinizle yapılır?",
    a:
      "Cilt tipinize göre en uygun tedaviye karar vermek için uzmanlarımızla yapılan ücretsiz danışmanlık seansından yararlanabilirsiniz.",
  },
  {
    q: "4. Hizmetlerinizin fiyatları hakkında bilgi alabilir miyim?",
    a:
      "Her hizmetin fiyatı, ihtiyacınıza göre değişmektedir. Detaylı bilgi almak için bizimle iletişime geçebilir veya fiyat listemize göz atabilirsiniz.",
  },
  {
    q: "5. Hizmetlerden önce nasıl hazırlık yapmalıyım?",
    a:
      "Cilt bakımı veya masaj gibi hizmetlerden önce genellikle rahat bir kıyafet tercih etmeniz önerilir. Ayrıca, cilt bakımı için önceden makyaj yapmamaya özen gösterin.",
  },
  {
    q: "6. Güzellik merkezinizde kullanılan ürünler hakkında bilgi alabilir miyim?",
    a:
      "Güzellik merkezimizde, cilt ve saç sağlığınızı ön planda tutarak doğal ve kaliteli ürünler kullanılmaktadır. Uzmanlarımız, ihtiyaçlarınıza göre en uygun ürünleri seçer.",
  },
];

export default function HomeScreen() {
  const nav = useNavigation();
  const [menuVisible, setMenuVisible] = useState(false);
  const [openFaqs, setOpenFaqs] = useState([]);

  const menuItems = [
    { label: 'Randevu',      icon: 'calendar-outline',      screen: 'Appointment' },
    { label: 'Çalışanlar',   icon: 'people-outline',        screen: 'Calisanlar'   },
    { label: 'Yorumlar',     icon: 'chatbubble-ellipses-outline', screen: 'Reviews'      },
    { label: 'Profilim',     icon: 'person-circle-outline', screen: 'Profile'      },
  ];

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);
  const handleNavigate = screen => {
    closeMenu();
    nav.navigate(screen);            
  }
  const toggleFaq = (i) =>
    setOpenFaqs((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]
    );
    const [avocadoExpanded, setAvocadoExpanded] = useState(false);

    const avocadoText = `Avokado, içerdiği sağlıklı yağlar ve vitaminler sayesinde saçlarınızı besler ve nemlendirir. 
    Saç maskesi olarak kullanmak için bir avokadoyu ezip, içerisine birkaç damla zeytinyağı ve bal ekleyin. 
    Karışımı saç uçlarınıza uygulayıp 20-30 dakika beklettikten sonra ılık suyla durulayın. 
    Bu maske, kuru ve mat saçlara parlaklık kazandırır ve sağlıklı bir görünüm sağlar. 
    Haftada bir kez uygulayarak saçınızın doğal ışıltısını geri kazandırabilirsiniz.`;
    
  
  return (
    <View style={styles.flex}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={openMenu} style={styles.hamburger}>
          <Ionicons name="menu" size={28} color="#4e2c33" />
        </TouchableOpacity>
        <Image
          source={{ uri: 'https://i.imgur.com/eZ6Mr1u.jpeg' }}
          style={styles.logo}
        />
        <View style={styles.placeholder} />
      </View>

      <Modal visible={menuVisible} transparent animationType="fade">
        {/* CHANGED: Dark semi-transparent backdrop */}
        <Pressable style={styles.modalBackdrop} onPress={closeMenu} />
        {/* CHANGED: Card-style menu */}
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>Menü</Text>
          {menuItems.map((item) => (
            // aynı dosyada, menü render kısmı
<TouchableOpacity
  key={item.screen}
  style={styles.modalRow}
  onPress={() => {
    closeMenu();
    nav.navigate(item.screen);    // buradaki item.screen 'Reviews' olacak
  }}
>
  <Ionicons name={item.icon} size={22} color="#4e2c33" style={styles.modalIcon} />
  <Text style={styles.modalText}>{item.label}</Text>
</TouchableOpacity>

          ))}
        </View>
      </Modal>

      <ScrollView style={styles.container}>
        {/* Hero with background image */}
        <ImageBackground
          source={{
            uri:
              'https://media.istockphoto.com/id/1856117770/photo/modern-beauty-salon.jpg?s=612x612&w=0&k=20&c=dVZtsePk2pgbqDXwVkMm-yIw5imnZ2rnkAruR7zf8EA=',
          }}
          style={styles.hero}
          imageStyle={styles.heroImage}
        >
          <View style={styles.heroOverlay}>
            <Text style={styles.heroTitle}>
              EN İYİ{' '}
              <Text style={{ color: '#fce8cc' }}>
                Güzellik
              </Text>
              {'\n'}HİZMETLERİ BURADA
            </Text>
            <Text style={styles.heroText}>
              Sağlıklı cilt, güzel saçlar ve rahatlatıcı masajlar için
              {'\n'}doğru adrestesiniz.
            </Text>
          </View>
        </ImageBackground>

        {/* Services */}
        <View style={styles.services}>
          {services.map((s) => (
            <View key={s.id} style={styles.serviceCard}>
              <Text style={styles.serviceTitle}>★ {s.title}</Text>
              <Image source={{ uri: s.img }} style={styles.serviceImage} />
              <Text style={styles.serviceDesc}>{s.desc}</Text>
              <TouchableOpacity
                style={styles.button}
                onPress={() => nav.navigate('Appointment')}
              >
                <Text style={styles.buttonText}>Randevu Al</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Campaign */}
        <View style={styles.campaigns}>
          <Text style={styles.campaignTitle}>İlk Randevuya Özel Kampanya!</Text>
          <Text style={styles.campaignText}>
            İlk randevunuza özel{' '}
            <Text style={styles.highlight}>%10 İNDİRİM</Text>{' '}
            fırsatını kaçırmayın!
          </Text>
        </View>

        <View style={styles.avocadoMask}>
        <Image
            source={{ uri: 'https://cdn.dsmcdn.com/mrktng/seo/tyblog/1/avokado-sac-maskesi-3.jpg' }}
            style={styles.avocadoImage}
        />
        <View style={styles.avocadoContent}>
            <Text style={styles.avocadoTitle}>             Saçlarınız İçin Avokado Maskesi</Text>
            <Text
            style={styles.avocadoText}
            numberOfLines={avocadoExpanded ? undefined : 3}
            >
            {avocadoText}
            </Text>
            <TouchableOpacity
            onPress={() => setAvocadoExpanded((prev) => !prev)}
            >
            <Text style={styles.readMore}>
                {avocadoExpanded ? 'Daha Az Göster' : 'Devamını Oku'}
            </Text>
            </TouchableOpacity>
        </View>
        </View>

        {/* FAQ Accordion */}
        <View style={styles.blogFaqSection}>
          {faqs.map((item, i) => (
            <View key={i} style={styles.faqItem}>
              <TouchableOpacity
                style={styles.faqHeader}
                onPress={() => toggleFaq(i)}
              >
                <Text style={styles.faqQ}>{item.q}</Text>
                <Ionicons
                  name={openFaqs.includes(i) ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color="#4e2c33"
                />
              </TouchableOpacity>
              {openFaqs.includes(i) && (
                <Text style={styles.faqA}>{item.a}</Text>
              )}
            </View>
          ))}
        </View>
        {/* FOOTER */}
        <View style={styles.footer}>
        {/* Logo / Başlık */}
        <Text style={styles.footerLogo}>İnci Güzellik Merkezi</Text>

        {/* İletişim Satırları */}
        <View style={styles.contactRow}>
            <Ionicons name="location-outline" size={20} color="#fce8cc" />
            <Text style={styles.contactText}>123 Bahçelievler, Ankara</Text>
        </View>
        <View style={styles.contactRow}>
            <Ionicons name="call-outline" size={20} color="#fce8cc" />
            <Text style={styles.contactText}>+90 555 555 55 55</Text>
        </View>
        <View style={styles.contactRow}>
            <Ionicons name="mail-outline" size={20} color="#fce8cc" />
            <Text style={styles.contactText}>info@inciguzellik.com</Text>
        </View>

        {/* Alt Yazı */}
        <Text style={styles.footerCopy}>© 2025 İnci Güzellik Merkezi. Tüm hakları saklıdır.</Text>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: '#f5ebe0',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5ebe0',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#f5ebe0',
    elevation: 4,
  },
  hamburger: {
    padding: 5,
  },
  logo: {
    width: 150,      // istediğin genişlik
    height: 60,      // istediğin yükseklik
    borderRadius: 8,
    marginTop: 35,
  },
  
  placeholder: {
    width: 28,
  },

  hero: {
    width: '100%',
    height: 250,
    justifyContent: 'flex-end',
  },
  heroImage: {
    resizeMode: 'cover',
  },
  heroOverlay: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    lineHeight: 36,
    textAlign: 'center',
  },
  heroText: {
    fontSize: 18,
    color: '#fce8cc',
    marginTop: 10,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 24,
  },

  services: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 10,
  },
  serviceCard: {
    width: '45%',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    marginVertical: 10,
    padding: 10,
    alignItems: 'center',
    elevation: 2,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4e2c33',
  },
  serviceImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    marginVertical: 10,
  },
  serviceDesc: {
    fontSize: 14,
    color: '#4e2c33',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#4e2c33',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  campaigns: {
    backgroundColor: '#b68677',
    padding: 20,
    alignItems: 'center',
  },
  campaignTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fce8cc',
  },
  campaignText: {
    fontSize: 16,
    color: '#fce8cc',
    marginTop: 8,
    textAlign: 'center'
  },
  highlight: {
    fontWeight: 'bold',
    color: '#ffffff',
  },

  avocadoMask: {
    padding: 20,
    flexDirection: 'column',
    alignItems: 'center',      
    backgroundColor: '#ffffff',
  },
  avocadoImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 15,         
  },
  avocadoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4e2c33',
    marginBottom: 8,
  },
  avocadoText: {
    fontSize: 14,
    color: '#4e2c33',
    lineHeight: 20,
    textAlign: 'center',
  },
  readMore: {
    marginTop: 8,
    fontSize: 14,
    color: '#b68677',
    textDecorationLine: 'underline',
  },

  blogFaqSection: {
    padding: 20,
  },
  faqItem: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  faqQ: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4e2c33',
    flex: 1,
  },
  faqA: {
    fontSize: 14,
    color: '#4e2c33',
    paddingVertical: 8,
    lineHeight: 20,
  },

  footer: {
    backgroundColor: '#4e2c33',
    paddingVertical: 20,
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  footerLogo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fce8cc',
    marginBottom: 12,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  contactText: {
    color: '#fce8cc',
    fontSize: 14,
    marginLeft: 8,
  },
  footerCopy: {
    color: '#fce8cc',
    fontSize: 12,
    marginTop: 16,
    textAlign: 'center',
  },
  contactInfo: {
    marginTop: 10,
  },
  contact: {
    fontSize: 13,
    color: '#4e2c33',
    marginVertical: 2,
  },

  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,  // CHANGED: fill entire screen
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalCard: {
    position: 'absolute',
    top: 110,
    right: 170,
    width: 200,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 8,
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12, color: '#4e2c33' },
  modalRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  modalIcon: { marginRight: 1 },
  modalText: { fontSize: 16, color: '#4e2c33' },
});
