import React, { useState } from 'react';
import { View, TextInput, Text, ScrollView, Switch, Alert, StyleSheet, TouchableOpacity, Linking, KeyboardAvoidingView, Platform } from 'react-native';
import { generatePlan } from '../../../api/dietApi';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

export default function DietPlan() {
  const [formData, setFormData] = useState({
    gender: '',
    height: '',
    weight: '',
    preference: '',
    allergies: []
  });
  const [plan, setPlan] = useState(null);

  const allergiesList = ['Nuts', 'Milk', 'Gluten', 'None'];

  const navigation = useNavigation();

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSwitchChange = (allergy) => {
    setFormData((prev) => {
      const allergies = prev.allergies.includes(allergy)
        ? prev.allergies.filter((a) => a !== allergy)
        : [...prev.allergies, allergy];
      return { ...prev, allergies };
    });
  };

  const handleSubmit = async () => {
    // Basic validation
    if (!formData.gender || !formData.height || !formData.weight || !formData.preference) {
      return Alert.alert('Missing Information', 'Please fill in all required fields');
    }
    
    try {
      const data = await generatePlan(formData);
      setPlan(data);
    } catch (error) {
      console.error('Error generating diet plan:', error);
      Alert.alert('Error', 'Failed to generate diet plan');
    }
  };

  return (
    <SafeAreaProvider>
      <LinearGradient
        colors={["#4568DC", "#B06AB3"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoid}
        >
          <ScrollView contentContainerStyle={styles.container}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>
            
            <View style={styles.header}>
              <Text style={styles.title}>Personalized Diet Plan</Text>
              <Text style={styles.subtitle}>Tell us about yourself</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Personal Details</Text>
              
              <View style={styles.pickerContainer}>
                <Text style={styles.label}>Gender</Text>
                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={formData.gender}
                    onValueChange={(val) => handleInputChange('gender', val)}
                    style={styles.picker}
                    dropdownIconColor="#4568DC"
                  >
                    <Picker.Item label="Select Gender" value="" />
                    <Picker.Item label="Male" value="Male" />
                    <Picker.Item label="Female" value="Female" />
                    <Picker.Item label="Other" value="Other" />
                  </Picker>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Height (cm)</Text>
                <TextInput 
                  placeholder="Enter your height" 
                  keyboardType="numeric"
                  onChangeText={(val) => handleInputChange('height', val)} 
                  style={styles.input} 
                  placeholderTextColor="#aaa"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Weight (kg)</Text>
                <TextInput 
                  placeholder="Enter your weight" 
                  keyboardType="numeric"
                  onChangeText={(val) => handleInputChange('weight', val)} 
                  style={styles.input} 
                  placeholderTextColor="#aaa"
                />
              </View>

              <View style={styles.pickerContainer}>
                <Text style={styles.label}>Diet Preference</Text>
                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={formData.preference}
                    onValueChange={(val) => handleInputChange('preference', val)}
                    style={styles.picker}
                    dropdownIconColor="#4568DC"
                  >
                    <Picker.Item label="Select Diet Preference" value="" />
                    <Picker.Item label="Vegetarian" value="veg" />
                    <Picker.Item label="Non-Vegetarian" value="non veg" />
                  </Picker>
                </View>
              </View>

              <View style={styles.allergiesSection}>
                <Text style={styles.label}>Food Allergies</Text>
                {allergiesList.map((allergy, index) => (
                  <View key={index} style={styles.switchContainer}>
                    <Switch
                      value={formData.allergies.includes(allergy)}
                      onValueChange={() => handleSwitchChange(allergy)}
                      trackColor={{ true: '#4568DC', false: '#ddd' }}
                      thumbColor={formData.allergies.includes(allergy) ? '#fff' : '#f4f3f4'}
                      ios_backgroundColor="#eee"
                    />
                    <Text style={styles.switchLabel}>{allergy}</Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity 
                style={styles.button}
                onPress={handleSubmit}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={["#4568DC", "#B06AB3"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.buttonText}>Generate Plan</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {plan && (
              <View style={styles.planCard}>
                <Text style={styles.planTitle}>Your Personal Diet Plan</Text>
                <View style={styles.bmiContainer}>
                  <Text style={styles.bmiLabel}>BMI</Text>
                  <Text style={styles.bmiValue}>{plan.bmi}</Text>
                  <Text style={styles.bmiCategory}>{plan.category}</Text>
                </View>
                
                <View style={styles.divider} />
                
                <Text style={styles.scheduleTitle}>Daily Schedule:</Text>
                {plan.schedule.map((item, index) => (
                  <View key={index} style={styles.scheduleItemContainer}>
                    <Ionicons name="time-outline" size={18} color="#4568DC" />
                    <Text style={styles.scheduleItem}>{item}</Text>
                  </View>
                ))}
                
                <View style={styles.divider} />
                
                <View style={styles.pdfLinks}>
                  <TouchableOpacity 
                    style={styles.pdfButton}
                    onPress={() => Linking.openURL(plan.diet_pdf)}
                  >
                    <Ionicons name="document-text" size={20} color="#4568DC" />
                    <Text style={styles.pdfButtonText}>View Diet PDF</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.pdfButton}
                    onPress={() => Linking.openURL(plan.exercise_pdf)}
                  >
                    <Ionicons name="fitness" size={20} color="#4568DC" />
                    <Text style={styles.pdfButtonText}>View Exercise PDF</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  container: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 25,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  backButton: {
    position: "absolute",
    left: 0,
    top: 30,
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    zIndex: 1,
  },
  backText: {
    fontSize: 16,
    color: "#fff",
    marginLeft: 8,
    fontWeight: "500",
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555',
    marginBottom: 6,
  },
  input: {
    height: 50,
    borderColor: '#eee',
    borderWidth: 1,
    borderRadius: 12,
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#333',
  },
  pickerContainer: {
    marginBottom: 16,
  },
  pickerWrapper: {
    borderRadius: 12,
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#eee',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  allergiesSection: {
    marginTop: 10,
    marginBottom: 20,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    marginLeft: 10,
  },
  switchLabel: {
    fontSize: 16,
    color: '#444',
    marginLeft: 12,
  },
  button: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 10,
    shadowColor: '#4568DC',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonGradient: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  planCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  planTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  bmiContainer: {
    alignItems: 'center',
    paddingVertical: 15,
  },
  bmiLabel: {
    fontSize: 14,
    color: '#888',
    marginBottom: 5,
  },
  bmiValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#4568DC',
  },
  bmiCategory: {
    fontSize: 16,
    color: '#B06AB3',
    fontWeight: '500',
    marginTop: 5,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 15,
  },
  scheduleTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#333',
    marginBottom: 12,
  },
  scheduleItemContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingHorizontal: 5,
  },
  scheduleItem: {
    fontSize: 16,
    color: '#444',
    flexShrink: 1,
    marginLeft: 10,
  },
  pdfLinks: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  pdfButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    flex: 0.48,
    justifyContent: 'center',
  },
  pdfButtonText: {
    color: '#4568DC',
    marginLeft: 8,
    fontWeight: '500',
  },
});