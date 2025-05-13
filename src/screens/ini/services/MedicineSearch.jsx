import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  Text, 
  TouchableOpacity, 
  FlatList, 
  StyleSheet, 
  StatusBar, 
  Platform,
  Dimensions
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { fetchSuggestions, fetchMedicineDetails } from '../../../api/medicineApi';

const { width } = Dimensions.get('window');

export default function MedicineSearch({ navigation }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [details, setDetails] = useState(null);
  const [isSearching, setIsSearching] = useState(true);

  const handleBackPress = () => {
    if (!isSearching) {
      setIsSearching(true);
      setDetails(null);
    } else {
      navigation.goBack();
    }
  };

  const handleSearch = async (input) => {
    setQuery(input);
    if (input.trim().length === 0) {
      setSuggestions([]);
      return;
    }
    const data = await fetchSuggestions(input);
    setSuggestions(data || []);
  };

  const handleMedicineClick = async (name) => {
    const data = await fetchMedicineDetails(name);
    setDetails(data);
    setQuery('');
    setSuggestions([]);
    setIsSearching(false);
  };

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor="#4568DC" />
      <LinearGradient
        colors={["#4568DC", "#B06AB3"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.backgroundGradient}
      >
        <SafeAreaView edges={['top']} style={{ backgroundColor: 'transparent' }}>
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={handleBackPress}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Medicine Finder</Text>
          </View>
        </SafeAreaView>

        <SafeAreaView edges={['bottom', 'left', 'right']} style={styles.contentContainer}>
          <View style={styles.container}>
            {isSearching ? (
              <Animated.View entering={FadeIn} exiting={FadeOut} style={{ flex: 1 }}>
                <View style={styles.searchContainer}>
                  <TextInput
                    style={styles.input}
                    value={query}
                    onChangeText={handleSearch}
                    placeholder="Search for medicine..."
                    placeholderTextColor="#aaa"
                  />
                  <MaterialCommunityIcons 
                    name="magnify" 
                    size={24} 
                    color="#B06AB3" 
                    style={styles.searchIcon}
                  />
                </View>
                
                {suggestions.length > 0 ? (
                  <FlatList
                    data={suggestions}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                      <TouchableOpacity 
                        style={styles.suggestion} 
                        onPress={() => handleMedicineClick(item.name)}
                      >
                        <Text style={styles.suggestionText}>{item.name}</Text>
                        <Ionicons name="chevron-forward" size={20} color="#B06AB3" />
                      </TouchableOpacity>
                    )}
                    showsVerticalScrollIndicator={false}
                  />
                ) : query.length > 0 ? (
                  <View style={styles.noResults}>
                    <MaterialCommunityIcons name="alert-circle-outline" size={48} color="#fff" />
                    <Text style={styles.noResultsText}>No medicines found</Text>
                  </View>
                ) : null}
              </Animated.View>
            ) : (
              <Animated.ScrollView
                entering={FadeIn}
                exiting={FadeOut}
                style={styles.detailsContainer}
                showsVerticalScrollIndicator={false}
              >
                {details?.error ? (
                  <View style={styles.errorContainer}>
                    <MaterialCommunityIcons name="alert-circle" size={48} color="#ff6b6b" />
                    <Text style={styles.error}>{details.error}</Text>
                  </View>
                ) : (
                  <View style={styles.details}>
                    <Text style={styles.detailTitle}>{details?.name}</Text>
                    
                    <View style={styles.detailRow}>
                      <View style={styles.detailIcon}>
                        <MaterialCommunityIcons name="cash" size={24} color="#4568DC" />
                      </View>
                      <View style={styles.detailContent}>
                        <Text style={styles.detailLabel}>Price</Text>
                        <Text style={styles.detailText}>{details?.price}</Text>
                      </View>
                    </View>
                    
                    <View style={styles.detailRow}>
                      <View style={styles.detailIcon}>
                        <MaterialCommunityIcons name="factory" size={24} color="#4568DC" />
                      </View>
                      <View style={styles.detailContent}>
                        <Text style={styles.detailLabel}>Manufacturer</Text>
                        <Text style={styles.detailText}>{details?.manufacturer_name}</Text>
                      </View>
                    </View>
                    
                    <View style={styles.detailRow}>
                      <View style={styles.detailIcon}>
                        <MaterialCommunityIcons name="pill" size={24} color="#4568DC" />
                      </View>
                      <View style={styles.detailContent}>
                        <Text style={styles.detailLabel}>Type</Text>
                        <Text style={styles.detailText}>{details?.type}</Text>
                      </View>
                    </View>
                    
                    <View style={styles.detailRow}>
                      <View style={styles.detailIcon}>
                        <MaterialCommunityIcons name="flask-outline" size={24} color="#4568DC" />
                      </View>
                      <View style={styles.detailContent}>
                        <Text style={styles.detailLabel}>Composition</Text>
                        <Text style={styles.detailText}>{details?.salt_composition}</Text>
                      </View>
                    </View>
                    
                    <View style={styles.sectionDivider} />
                    
                    <Text style={styles.sectionTitle}>Description</Text>
                    <Text style={styles.descriptionText}>{details?.medicine_desc}</Text>
                    
                    <View style={styles.sectionDivider} />
                    
                    <Text style={styles.sectionTitle}>Side Effects</Text>
                    <View style={styles.sideEffectsContainer}>
                      <MaterialCommunityIcons name="alert" size={20} color="#ff9800" />
                      <Text style={styles.sideEffectsText}>{details?.side_effects}</Text>
                    </View>
                  </View>
                )}
              </Animated.ScrollView>
            )}
          </View>
        </SafeAreaView>
      </LinearGradient>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  backgroundGradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center', 
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 10,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 5,
    fontWeight: '500',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  searchContainer: {
    position: 'relative',
    marginBottom: 20,
    marginTop: 10,
  },
  searchIcon: {
    position: 'absolute',
    right: 15,
    top: 12,
  },
  input: {
    height: 50,
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingRight: 50,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    fontSize: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  suggestion: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 16,
    borderRadius: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  suggestionText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  noResults: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  noResultsText: {
    fontSize: 18,
    color: '#fff',
    marginTop: 10,
  },
  detailsContainer: {
    flex: 1,
  },
  details: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  detailTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'flex-start',
  },
  detailIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#f0f4f8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  detailText: {
    fontSize: 16,
    color: '#333',
  },
  sectionDivider: {
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
  },
  sideEffectsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff9ed',
    borderRadius: 12,
    padding: 15,
    alignItems: 'flex-start',
  },
  sideEffectsText: {
    fontSize: 16,
    color: '#444',
    marginLeft: 10,
    flex: 1,
    lineHeight: 22,
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    margin: 20,
  },
  error: {
    color: '#ff6b6b',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 10,
  },
});