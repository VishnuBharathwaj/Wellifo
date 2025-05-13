import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Modal,
  ImageBackground,
  Dimensions,
  Platform,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getAuth } from "firebase/auth";

const { width } = Dimensions.get("window");

export default function HomeTab({ navigation }) {
  const insets = useSafeAreaInsets();
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);

  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUserEmail(currentUser.email);
    }
  }, []);

  const [healthData, setHealthData] = useState({
    weight: "-- kg",
    height: "--- cm",
    bloodPressure: "---/--",
    heartRate: "-- bpm",
  });
  const [tempData, setTempData] = useState({ ...healthData });

  const updateHealthData = () => {
    setHealthData(tempData);
    setEditModalVisible(false);
  };

  const serviceButtons = [
    {
      title: "Nutrition Tips",
      icon: "nutrition",
      color: "#FF6B6B",
      onPress: () => navigation.navigate("NutroScreen"),
    },
    {
      title: "Medicine Finder",
      icon: "pill",
      color: "#4ECDC4",
      onPress: () => navigation.navigate("MedicineSearch"),
    },
    {
      title: "Disease Overview",
      icon: "file-search",
      color: "#FFD166",
      onPress: () => navigation.navigate("DiseaseOverview"),
    },
    {
      title: "Doctor Appointment",
      icon: "doctor",
      color: "#6A0572",
      onPress: () => navigation.navigate("DoctorScreen"),
    },
    {
      title: "Diet Plan",
      icon: "food-apple",
      color: "#1A535C",
      onPress: () => navigation.navigate("DietPlan"),
    },
    {
      title: "Health News",
      icon: "newspaper",
      color: "#3D5A80",
      onPress: () => navigation.navigate("HealthNews"),
    },
  ];

  const renderHealthMetric = (label, value, iconName) => (
    <View style={styles.healthMetric}>
      <View style={styles.metricIconContainer}>
        <MaterialCommunityIcons name={iconName} size={24} color="#fff" />
      </View>
      <View style={styles.metricDetails}>
        <Text style={styles.metricLabel}>{label}</Text>
        <Text style={styles.metricValue}>{value}</Text>
      </View>
    </View>
  );

  const renderServiceButtons = () => {
    return (
      <View style={styles.servicesGrid}>
        {serviceButtons.map((button, index) => (
          <TouchableOpacity
            key={index}
            style={styles.serviceButton}
            onPress={button.onPress}
          >
            <LinearGradient
              colors={["#4568DC", "#B06AB3"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.serviceButtonGradient}
            >
              <MaterialCommunityIcons
                name={button.icon}
                size={32}
                color="#fff"
              />
              <Text style={styles.serviceButtonText}>{button.title}</Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("currentUser");
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent={true}
      />
      <LinearGradient
        colors={["#4568DC", "#B06AB3"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.headerGradient,
          { paddingTop: insets.top || StatusBar.currentHeight || 40 },
        ]}
      >
        <View style={styles.header}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.welcomeText}>Hello, {userEmail}</Text>
            <Text style={styles.welcomeSubtext}>
              Stay healthy and motivated!
            </Text>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation.navigate("EmergencyHandling")}
            >
              <MaterialCommunityIcons name="phone" size={24} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => setModalVisible(true)}
            >
              <MaterialCommunityIcons name="bell" size={24} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconButton} onPress={handleLogout}>
              <MaterialCommunityIcons name="logout" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Health Record Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitle}>My Health Record</Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setEditModalVisible(true)}
            >
              <Text style={styles.editButtonText}>Edit</Text>
              <MaterialCommunityIcons name="pencil" size={16} color="#4568DC" />
            </TouchableOpacity>
          </View>
          <View style={styles.healthRecordContainer}>
            {renderHealthMetric("Weight", healthData.weight, "weight")}
            {renderHealthMetric(
              "Height",
              healthData.height,
              "human-male-height"
            )}
            {renderHealthMetric(
              "Blood Pressure",
              healthData.bloodPressure,
              "heart-pulse"
            )}
            {renderHealthMetric("Heart Rate", healthData.heartRate, "heart")}
          </View>
        </View>

        {/* Services */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Our Services</Text>
          {renderServiceButtons()}
        </View>

        {/* Extra padding at bottom for better scroll experience */}
        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Notification Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Notifications</Text>
              <TouchableOpacity
                style={styles.closeIcon}
                onPress={() => setModalVisible(false)}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={24}
                  color="#4568DC"
                />
              </TouchableOpacity>
            </View>
            <View style={styles.notificationList}>
              <View style={styles.notificationItem}>
                <MaterialCommunityIcons name="pill" size={24} color="#4568DC" />
                <View style={styles.notificationContent}>
                  <Text style={styles.notificationTitle}>
                    Medicine Reminder
                  </Text>
                  <Text style={styles.notificationText}>
                    Time to take your evening medication
                  </Text>
                  <Text style={styles.notificationTime}>2 hours ago</Text>
                </View>
              </View>
              <View style={styles.notificationItem}>
                <MaterialCommunityIcons
                  name="calendar-check"
                  size={24}
                  color="#4568DC"
                />
                <View style={styles.notificationContent}>
                  <Text style={styles.notificationTitle}>Appointment</Text>
                  <Text style={styles.notificationText}>
                    Doctor appointment tomorrow at 10:00 AM
                  </Text>
                  <Text style={styles.notificationTime}>5 hours ago</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Update Health Data</Text>
              <TouchableOpacity
                style={styles.closeIcon}
                onPress={() => setEditModalVisible(false)}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={24}
                  color="#4568DC"
                />
              </TouchableOpacity>
            </View>
            <View style={styles.inputsContainer}>
              {Object.entries(tempData).map(([key, value], index) => (
                <View style={styles.inputWrapper} key={index}>
                  <Text style={styles.inputLabel}>
                    {key
                      .replace(/([A-Z])/g, " $1")
                      .charAt(0)
                      .toUpperCase() + key.replace(/([A-Z])/g, " $1").slice(1)}
                  </Text>
                  <TextInput
                    style={styles.input}
                    value={value}
                    onChangeText={(text) =>
                      setTempData({ ...tempData, [key]: text })
                    }
                    placeholder={key.replace(/([A-Z])/g, " $1")}
                    placeholderTextColor="#aaa"
                  />
                </View>
              ))}
            </View>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={updateHealthData}
              >
                <LinearGradient
                  colors={["#4568DC", "#B06AB3"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.saveButtonGradient}
                >
                  <Text style={styles.saveButtonText}>Save</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  headerGradient: {
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  headerTextContainer: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  welcomeSubtext: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 4,
  },
  headerIcons: {
    flexDirection: "row",
  },
  iconButton: {
    marginLeft: 15,
    padding: 5,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: -20,
  },
  sectionContainer: {
    marginBottom: 25,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  editButtonText: {
    color: "#4568DC",
    marginRight: 5,
    fontWeight: "600",
  },
  healthRecordContainer: {
    borderRadius: 12,
  },
  healthMetric: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  metricIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#4568DC",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  metricDetails: {
    flex: 1,
  },
  metricLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  servicesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  serviceButton: {
    width: (width - 90) / 2,
    marginBottom: 15,
    height: 120,
    borderRadius: 15,
    overflow: "hidden",
  },
  serviceButtonGradient: {
    flex: 1,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  serviceButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
    marginTop: 10,
    textAlign: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 25,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  closeIcon: {
    padding: 5,
  },
  notificationList: {
    marginTop: 10,
  },
  notificationItem: {
    flexDirection: "row",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  notificationContent: {
    marginLeft: 15,
    flex: 1,
  },
  notificationTitle: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#333",
  },
  notificationText: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  notificationTime: {
    fontSize: 12,
    color: "#999",
    marginTop: 5,
  },
  inputsContainer: {
    marginBottom: 20,
  },
  inputWrapper: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#f8f9fa",
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  cancelButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
  },
  saveButton: {
    flex: 1,
    borderRadius: 10,
    overflow: "hidden",
  },
  saveButtonGradient: {
    padding: 15,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
