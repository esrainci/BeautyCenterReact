// components/TopMenu.js

import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
  StyleSheet,
} from 'react-native';

const { width } = Dimensions.get('window');
const MENU_ITEMS = ['Anasayfa', 'Randevu', 'Çalışanlar', 'Yorumlar', 'Profilim'];

export default function TopMenu({ onSelect }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const indicatorX = useRef(new Animated.Value(0)).current;
  const itemWidth = width / 4; // ekranda 4'e yakın öğe gösterir

  const handlePress = (i) => {
    setActiveIndex(i);
    Animated.spring(indicatorX, {
      toValue: i * itemWidth,
      useNativeDriver: true,
    }).start();
    if (onSelect) onSelect(MENU_ITEMS[i]);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {MENU_ITEMS.map((label, i) => (
          <TouchableOpacity
            key={label}
            style={[styles.menuItem, { width: itemWidth }]}
            onPress={() => handlePress(i)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.menuText,
                i === activeIndex && styles.menuTextActive,
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        ))}
        <Animated.View
          style={[
            styles.indicator,
            {
              width: itemWidth,
              transform: [{ translateX: indicatorX }],
            },
          ]}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    elevation: 4,
  },
  scrollContent: {
    position: 'relative',
  },
  menuItem: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  menuText: {
    fontSize: 16,
    color: '#4e2c33',
    fontWeight: '500',
  },
  menuTextActive: {
    fontWeight: 'bold',
    color: '#b68677',
  },
  indicator: {
    position: 'absolute',
    height: 3,
    bottom: 0,
    backgroundColor: '#b68677',
  },
});
