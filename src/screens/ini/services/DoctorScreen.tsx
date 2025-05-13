import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  Platform,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  FlatList,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import {
  Card,
  Title,
  Paragraph,
  Button as PaperButton,
  Chip,
  Avatar,
} from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

type Doctor = {
  id: string;
  name: string;
  specialty: string;
};

type Appointment = {
  patientName: string;
  patientAge: string;
  date: Date;
  time: string;
  doctor: Doctor;
};

const doctors: Doctor[] = [
  { id: "1", name: "Dr. Smith", specialty: "Cardiologist" },
  { id: "2", name: "Dr. Johnson", specialty: "Dermatologist" },
  { id: "3", name: "Dr. Lee", specialty: "Pediatrician" },
  { id: "4", name: "Dr. Clark", specialty: "Cardiologist" },
  { id: "5" , name: "Dr. Lewis", specialty: "Dermatologist" },
  { id: "6", name: "Dr. Walker", specialty: "Pediatrician" },
  { id: "7", name: "Dr. Hall", specialty: "Cardiologist" },
  { id: "8", name: "Dr. Allen", specialty: "Dermatologist" },
  { id: "9", name: "Dr. Young", specialty: "Pediatrician" },
  { id: "10", name: "Dr. King", specialty: "Cardiologist" },
  { id: "11", name: "Dr. Wright", specialty: "Acupuncturist" },
  { id: "12", name: "Dr. Scott", specialty: "Orthopedic" },
  { id: "13", name: "Dr. Torres", specialty: "Neurologist" },
  { id: "14", name: "Dr. Nguyen", specialty: "Psychiatrist" },
  { id: "15", name: "Dr. Hill", specialty: "Dentist" },
  { id: "16", name: "Dr. Flores", specialty: "Ophthalmologist" },
  { id: "17", name: "Dr. Green", specialty: "Gynecologist" },
  { id: "18", name: "Dr. Adams", specialty: "Cardiologist" },
  { id: "19", name: "Dr. Baker", specialty: "Dermatologist" },
  { id: "20", name: "Dr. Gonzalez", specialty: "Pediatrician" },
  { id: "21", name: "Dr. Nelson", specialty: "Cardiologist" },
  { id: "22", name: "Dr. Carter", specialty: "Dermatologist" },
  { id: "23", name: "Dr. Mitchell", specialty: "Pediatrician" },
  { id: "24", name: "Dr. Perez", specialty: "Ophthalmologist" },
  { id: "25", name: "Dr. Roberts", specialty: "Psychiatrist" },
  { id: "26", name: "Dr. Turner", specialty: "Dentist" },
  { id: "27", name: "Dr. Phillips", specialty: "Dentist" },
  { id: "28", name: "Dr. Campbell", specialty: "Neurologist" },
  { id: "29", name: "Dr. Parker", specialty: "Gynecologist" },
  { id: "30", name: "Dr. Evans", specialty: "Psychiatrist" },
  { id: "31", name: "Dr. Edwards", specialty: "Neurologist" },
  { id: "32", name: "Dr. Collins", specialty: "Psychiatrist" },
  { id: "33", name: "Dr. Stewart", specialty: "Ophthalmologist" },
  { id: "34", name: "Dr. Sanchez", specialty: "Gynecologist" },
  { id: "35", name: "Dr. Morris", specialty: "Acupuncturist" },
  { id: "36", name: "Dr. Rogers", specialty: "Orthopedic" },
  { id: "37", name: "Dr. Reed", specialty: "Acupuncturist" },
  { id: "38", name: "Dr. Cook", specialty: "Orthopedic" },
  { id: "39", name: "Dr. Morgan", specialty: "Neurologist" },
  { id: "40", name: "Dr. Bell", specialty: "Psychiatrist" },
  { id: "41", name: "Dr. Murphy", specialty: "Dentist" },
];

const specialities = [
  "Cardiologist",
  "Dermatologist",
  "Pediatrician",
  "Acupuncturist",
  "Orthopedic",
  "Neurologist",
  "Psychiatrist",
  "Dentist",
  "Ophthalmologist",
  "Gynecologist",
];

const timeSlots = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
];

const specialtyIcons: Record<string, string> = {
  "Cardiologist": "heart-outline",
  "Dermatologist": "body-outline",
  "Pediatrician": "people-outline",
  "Acupuncturist": "fitness-outline",
  "Orthopedic": "person-outline",
  "Neurologist": "git-branch-outline",
  "Psychiatrist": "man-outline",
  "Dentist": "medical-outline",
  "Ophthalmologist": "eye-outline",
  "Gynecologist": "female-outline",
};

const getSpecialtyIcon = (specialty: string) => {
  return specialtyIcons[specialty] || "medkit-outline";
};

const DoctorScreen = () => {
  const [selectedSpeciality, setSelectedSpeciality] = useState<string | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(false);
    if (date) setSelectedDate(date);
  };

  const handleBookAppointment = () => {
    if (!selectedDoctor || !name || !age || !selectedDate || !selectedTime) {
      alert("Please fill all the fields.");
      return;
    }

    const newAppointment: Appointment = {
      patientName: name,
      patientAge: age,
      date: selectedDate,
      time: selectedTime,
      doctor: selectedDoctor,
    };

    setAppointments([...appointments, newAppointment]);
    resetForm();
  };

  const resetForm = () => {
    setName("");
    setAge("");
    setSelectedDate(undefined);
    setSelectedTime(undefined);
    setSelectedDoctor(null);
    setSelectedSpeciality(null);
  };

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {selectedDoctor 
            ? "Book Appointment" 
            : selectedSpeciality 
              ? `Choose ${selectedSpeciality}`
              : "MediBook"}
        </Text>
        {(selectedDoctor || selectedSpeciality) && (
          <TouchableOpacity 
            onPress={() => selectedDoctor ? setSelectedDoctor(null) : setSelectedSpeciality(null)}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={["#4568DC", "#B06AB3"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {renderHeader()}
        
        <View style={styles.contentContainer}>
          {/* Speciality selection */}
          {!selectedSpeciality && !selectedDoctor && (
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
              <View style={styles.welcomeSection}>
                <Text style={styles.welcomeText}>Welcome to MediBook</Text>
                <Text style={styles.subText}>Find and book appointments with top specialists</Text>
              </View>
              
              <Text style={styles.sectionTitle}>Select Specialty</Text>
              <FlatList
                data={specialities}
                keyExtractor={(item) => item}
                numColumns={2}
                renderItem={({ item }) => (
                  <TouchableOpacity 
                    onPress={() => setSelectedSpeciality(item)}
                    style={styles.specialtyCard}
                  >
                    <View style={styles.specialtyIconContainer}>
                      <Ionicons name={getSpecialtyIcon(item)} size={28} color="#4568DC" />
                    </View>
                    <Text style={styles.specialtyText}>{item}</Text>
                  </TouchableOpacity>
                )}
                contentContainerStyle={styles.specialtyGrid}
                scrollEnabled={false} // Disable nested scrolling
              />
              
              {appointments.length > 0 && (
                <>
                  <View style={styles.sectionHeader}>
                    <Ionicons name="calendar" size={22} color="#4568DC" />
                    <Text style={styles.sectionTitle}>
                      Your Appointments
                    </Text>
                  </View>
                  <FlatList
                    data={appointments}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={({ item }) => (
                      <Card style={styles.appointmentCard}>
                        <Card.Content>
                          <View style={styles.appointmentHeader}>
                            <View style={styles.appointmentPatient}>
                              <Ionicons name="person" size={20} color="#4568DC" />
                              <Text style={styles.patientName}>
                                {item.patientName}, {item.patientAge} years
                              </Text>
                            </View>
                            <Chip style={styles.specialtyChipSmall}>{item.doctor.specialty}</Chip>
                          </View>
                          
                          <View style={styles.appointmentDoctorContainer}>
                            <Avatar.Icon 
                              size={40} 
                              icon="doctor" 
                              style={styles.smallAvatar}
                              color="#fff"
                            />
                            <Text style={styles.appointmentDoctor}>{item.doctor.name}</Text>
                          </View>
                          
                          <View style={styles.appointmentDetails}>
                            <View style={styles.appointmentDetailItem}>
                              <Ionicons name="calendar" size={18} color="#4568DC" />
                              <Text style={styles.appointmentDetailText}>{item.date.toDateString()}</Text>
                            </View>
                            <View style={styles.appointmentDetailItem}>
                              <Ionicons name="time" size={18} color="#4568DC" />
                              <Text style={styles.appointmentDetailText}>{item.time}</Text>
                            </View>
                          </View>
                        </Card.Content>
                      </Card>
                    )}
                    scrollEnabled={false} // Disable nested scrolling
                  />
                </>
              )}
            </ScrollView>
          )}

          {/* Doctor selection */}
          {selectedSpeciality && !selectedDoctor && (
            <View style={styles.container}>
              <View style={styles.sectionHeader}>
                <Ionicons name={getSpecialtyIcon(selectedSpeciality)} size={22} color="#4568DC" />
                <Text style={styles.sectionTitle}>
                  Top {selectedSpeciality}s
                </Text>
              </View>
              <FlatList
                data={doctors.filter((doc) => doc.specialty === selectedSpeciality)}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => setSelectedDoctor(item)}>
                    <Card style={styles.card}>
                      <Card.Content style={styles.cardContent}>
                        <View style={styles.cardHeader}>
                          <Avatar.Icon 
                            size={60} 
                            icon="doctor" 
                            style={styles.doctorAvatar}
                            color="#fff"
                          />
                          <View style={styles.cardText}>
                            <Title style={styles.doctorName}>{item.name}</Title>
                            <Chip style={styles.specialtyChip}>{item.specialty}</Chip>
                            <View style={styles.ratingContainer}>
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Ionicons 
                                  key={star} 
                                  name="star" 
                                  size={16} 
                                  color={star <= 4 ? "#FFC107" : "#E0E0E0"} 
                                  style={{ marginRight: 2 }}
                                />
                              ))}
                              <Text style={styles.ratingText}>4.0</Text>
                            </View>
                          </View>
                        </View>
                        <PaperButton
                          mode="contained"
                          onPress={() => setSelectedDoctor(item)}
                          style={styles.bookButton}
                          labelStyle={styles.buttonLabel}
                        >
                          Book Now
                        </PaperButton>
                      </Card.Content>
                    </Card>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}

          {/* Appointment Form */}
          {selectedDoctor && (
            <ScrollView 
              style={styles.scrollView} 
              contentContainerStyle={styles.scrollViewContent}
            >
              <Card style={styles.formCard}>
                <Card.Content>
                  <View style={styles.doctorProfileContainer}>
                    <Avatar.Icon 
                      size={80} 
                      icon="doctor" 
                      style={styles.doctorAvatarLarge}
                      color="#fff"
                    />
                    <View style={styles.doctorInfo}>
                      <Title style={styles.doctorNameLarge}>{selectedDoctor.name}</Title>
                      <Chip style={styles.specialtyChip}>{selectedDoctor.specialty}</Chip>
                    </View>
                  </View>

                  <Text style={styles.formLabel}>Patient Information</Text>
                  <TextInput
                    placeholder="Full Name"
                    value={name}
                    onChangeText={setName}
                    style={styles.input}
                  />
                  <TextInput
                    placeholder="Age"
                    value={age}
                    onChangeText={setAge}
                    keyboardType="numeric"
                    style={styles.input}
                  />

                  <Text style={styles.formLabel}>Appointment Details</Text>
                  <TouchableOpacity 
                    onPress={() => setShowDatePicker(true)}
                    style={styles.dateSelector}
                  >
                    <Ionicons name="calendar-outline" size={24} color="#4568DC" style={styles.inputIcon} />
                    <Text style={selectedDate ? styles.dateText : styles.datePlaceholder}>
                      {selectedDate ? selectedDate.toDateString() : "Select Date"}
                    </Text>
                  </TouchableOpacity>

                  {showDatePicker && (
                    <DateTimePicker
                      value={selectedDate || new Date()}
                      mode="date"
                      display={Platform.OS === "ios" ? "spinner" : "default"}
                      onChange={handleDateChange}
                      minimumDate={new Date()}
                    />
                  )}

                  <Text style={styles.timeLabel}>Available Time Slots:</Text>
                  <View style={styles.timeSlotContainer}>
                    {timeSlots.map((slot) => (
                      <TouchableOpacity
                        key={slot}
                        style={[
                          styles.timeSlot,
                          selectedTime === slot && styles.selectedTimeSlot
                        ]}
                        onPress={() => setSelectedTime(slot)}
                      >
                        <Text style={[
                          styles.timeSlotText,
                          selectedTime === slot && styles.selectedTimeSlotText
                        ]}>
                          {slot}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <PaperButton 
                    mode="contained" 
                    onPress={handleBookAppointment} 
                    style={styles.confirmButton}
                    labelStyle={styles.buttonLabel}
                  >
                    Confirm Appointment
                  </PaperButton>
                </Card.Content>
              </Card>
            </ScrollView>
          )}
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: 20,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 20,
    paddingBottom: 40, // Extra padding at the bottom to ensure scrollability
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 50 : 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  backButton: {
    position: "absolute",
    left: 20,
    top: Platform.OS === "ios" ? 50 : 25,
  },
  welcomeSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  subText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 15,
    color: "#333",
  },
  specialtyGrid: {
    paddingBottom: 20,
  },
  specialtyCard: {
    flex: 1,
    margin: 8,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 120,
  },
  specialtyIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#f0f4ff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  specialtyText: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    color: "#333",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  card: {
    marginBottom: 15,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardText: {
    flex: 1,
    marginLeft: 15,
  },
  cardContent: {
    padding: 16,
  },
  doctorAvatar: {
    backgroundColor: "#4568DC",
  },
  doctorAvatarLarge: {
    backgroundColor: "#4568DC",
  },
  smallAvatar: {
    backgroundColor: "#4568DC",
    marginRight: 10,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#333",
  },
  doctorNameLarge: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  specialtyChip: {
    backgroundColor: "#f0f4ff",
    marginVertical: 5,
    height: 30,
  },
  specialtyChipSmall: {
    backgroundColor: "#f0f4ff",
    height: 24,
    fontSize: 12,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  ratingText: {
    marginLeft: 5,
    color: "#666",
    fontSize: 14,
  },
  bookButton: {
    marginTop: 15,
    backgroundColor: "#4568DC",
    borderRadius: 10,
    paddingVertical: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  formCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  doctorProfileContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  doctorInfo: {
    marginLeft: 20,
    flex: 1,
  },
  formLabel: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  input: {
    height: 56,
    borderColor: "#e0e0e0",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    marginBottom: 15,
    fontSize: 16,
  },
  dateSelector: {
    height: 56,
    borderColor: "#e0e0e0",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  inputIcon: {
    marginRight: 12,
  },
  dateText: {
    fontSize: 16,
    color: "#333",
  },
  datePlaceholder: {
    fontSize: 16,
    color: "#aaa",
  },
  timeLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 12,
    color: "#333",
  },
  timeSlotContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
  },
  timeSlot: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#f0f4ff",
    margin: 5,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  selectedTimeSlot: {
    backgroundColor: "#4568DC",
    borderColor: "#4568DC",
  },
  timeSlotText: {
    color: "#4568DC",
    fontWeight: "500",
  },
  selectedTimeSlotText: {
    color: "#fff",
  },
  confirmButton: {
    backgroundColor: "#4568DC",
    borderRadius: 12,
    marginTop: 10,
    paddingVertical: 8,
  },
  appointmentCard: {
    marginBottom: 12,
    backgroundColor: "#fff",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  appointmentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  appointmentPatient: {
    flexDirection: "row",
    alignItems: "center",
  },
  patientName: {
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 8,
    color: "#333",
  },
  appointmentDoctorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  appointmentDoctor: {
    fontSize: 17,
    fontWeight: "600",
    color: "#333",
  },
  appointmentDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  appointmentDetailItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  appointmentDetailText: {
    marginLeft: 8,
    color: "#666",
    fontSize: 14,
  },
});

export default DoctorScreen;