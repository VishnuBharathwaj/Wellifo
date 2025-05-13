import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  Alert,
  Modal,
  StyleSheet,
} from "react-native";
import XLSX from "xlsx";
import * as FileSystem from "expo-file-system";
import * as Location from "expo-location";
import MapView, { Circle, Marker } from "react-native-maps";
import haversine from "haversine-distance";
import { encode } from "base64-arraybuffer";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const EmergencyHandling = () => {
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [location, setLocation] = useState(null);
  const [nearestHospital, setNearestHospital] = useState(null);
  const [region, setRegion] = useState(null);

  const navigation = useNavigation();

  useEffect(() => {
    if (location && hospitals.length > 0) {
      findNearestHospital();
    }
  }, [location, hospitals]);

  useEffect(() => {
    loadHospitalData();
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Location access is required.");
      return;
    }
    getUserLocation();
  };

  const getUserLocation = async () => {
    let loc = await Location.getCurrentPositionAsync({});
    const latitude = loc.coords.latitude;
    const longitude = loc.coords.longitude;
    setLocation({ latitude, longitude });
    setRegion({
      latitude,
      longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
    const message = `🚨 Emergency! My current location is:\nLatitude: ${latitude}\nLongitude: ${longitude}\nGoogle Maps: https://www.google.com/maps?q=${latitude},${longitude}`;
    sendSMS(message);

  };

  const sendWhatsAppMessage = (message) => {
    const phoneNumber = "Num";
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;

    Linking.openURL(whatsappURL).catch(() =>
      Alert.alert("Error", "Unable to open WhatsApp")
    );
  };

  const sendSMS = async (message) => {
    const recipients = ["Num", "Num"]; // ✅ Both verified numbers
  
    try {
      const responses = await Promise.all(
        recipients.map((number) =>
          fetch("http://IP:3000/send-sms", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              to: number,
              body: message,
            }),
          }).then((res) => res.json())
        )
      );
  
      const failed = responses.find((res) => !res.success);
  
      if (failed) {
        throw new Error("One or more messages failed to send.");
      } else {
        Alert.alert("Success", "SMS sent to all emergency contacts!");
      }
    } catch (err) {
      Alert.alert("Error", err.message || "Failed to send all messages.");
    }
  };  
  

  const findNearestHospital = () => {
    let minDistance = Infinity;
    let closest = null;

    hospitals.forEach((hospital) => {
      const userCoords = {
        latitude: location.latitude,
        longitude: location.longitude,
      };
      const hospitalCoords = {
        latitude: hospital.Latitude,
        longitude: hospital.Longitude,
      };
      const distance = haversine(userCoords, hospitalCoords);

      if (distance < minDistance) {
        minDistance = distance;
        closest = hospital;
      }
    });
    setNearestHospital(closest);
  };

  const GITHUB_FILE_URL = "https://raw.githubusercontent.com/VishnuBharathwaj/HospitalLocator/main/Hospitals.xlsx";
  const LOCAL_FILE_URI = `${FileSystem.documentDirectory}Hospitals.xlsx`;

  const loadHospitalData = async () => {
    try {
      const response = await fetch(GITHUB_FILE_URL);
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

      const fileData = await response.arrayBuffer();
      const base64Data = encode(fileData); // Convert to Base64
      await FileSystem.writeAsStringAsync(LOCAL_FILE_URI, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const fileContent = await FileSystem.readAsStringAsync(LOCAL_FILE_URI, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const workbook = XLSX.read(fileContent, { type: "base64" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const hospitalData = XLSX.utils.sheet_to_json(sheet);
      setHospitals(hospitalData);
    } catch (error) {
      console.error("Error loading hospital data:", error);
      setHospitals([]);
    }
  };

  const triggerEmergencyCall = () => {
    Linking.openURL("tel:108");
  };

  const openHospitalModal = (hospital) => {
    setSelectedHospital(hospital);
    setModalVisible(true);
  };

  const callHospital = () => {
    if (selectedHospital?.Phone) {
      Linking.openURL(`tel:${selectedHospital.Phone}`);
      setModalVisible(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#6200ea" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Emergency Assistance</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={triggerEmergencyCall}>
          <Text style={styles.buttonText}>Emergency Call</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={sendSMS} style={styles.button}>
          <Text style={styles.buttonText}>Send via WhatsApp</Text>
        </TouchableOpacity>
      </View>
      {location && (
        <MapView
          style={styles.map}
          region={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Circle
            center={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            radius={20}
            strokeWidth={2}
            strokeColor="rgba(0, 0, 255, 0.8)"
            fillColor="rgba(0, 0, 255, 0.3)"
          />
          {hospitals.map((hospital, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: hospital.Latitude,
                longitude: hospital.Longitude,
              }}
              title={hospital.Name}
              description={hospital.Address}
              pinColor={hospital === nearestHospital ? "green" : "red"}
              onPress={() => openHospitalModal(hospital)}
            />
          ))}
        </MapView>
      )}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedHospital?.Name}</Text>
            <Text>{selectedHospital?.Address}</Text>
            <Text style={styles.modalPhone}>📞 {selectedHospital?.Phone}</Text>
            <TouchableOpacity style={styles.button} onPress={callHospital}>
              <Text style={styles.buttonText}>Call Hospital</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.closeButton]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: "#f8f9fa",
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginHorizontal: 5,
    elevation: 3,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  map: {
    width: "100%",
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 25,
    borderRadius: 12,
    width: "85%",
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    left: 16,
    top: -5,
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    zIndex: 1,
  },
  backText: {
    fontSize: 16,
    color: "#6200ea",
    marginLeft: 8,
    fontWeight: "500",
  },
  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 30,
    paddingBottom: 10,
    backgroundColor: "#f8f9fa",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "#222",
  },
});

export default EmergencyHandling;