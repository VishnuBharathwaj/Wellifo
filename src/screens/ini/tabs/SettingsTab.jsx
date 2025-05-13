import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Switch,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getAuth, signOut } from "firebase/auth";

const SettingsTab = () => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [biometrics, setBiometrics] = useState(true);
  const [dataSync, setDataSync] = useState(true);

  const [email, setEmail] = useState("");

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      setEmail(user.email);
    }
  }, []);

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        console.log("User signed out");
        navigation.reset({
          index: 0,
          routes: [{ name: "Login" }],
        });
      })
      .catch(error => {
        console.error("Logout error:", error);
      });
  }  

  return (
    <View style={[styles.container, darkMode && styles.darkContainer]}>
      <StatusBar barStyle={darkMode ? "light-content" : "dark-content"} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, darkMode && styles.darkText]}>
          Settings
        </Text>
      </View>

      {/* Profile Section */}
      <View style={[styles.profileSection, darkMode && styles.darkSection]}>
        <Image
          source={require('../../../../assets/profile.jpg')}
          style={styles.profileImage}
        />
        <View style={styles.profileInfo}>
          <Text style={[styles.profileName, darkMode && styles.darkText]}>
            {email}
          </Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Account Settings */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, darkMode && styles.darkText]}>
            Account
          </Text>

          <TouchableOpacity
            style={[styles.settingItem, darkMode && styles.darkSettingItem]}
          >
            <View style={styles.settingItemLeft}>
              <View
                style={[styles.iconContainer, { backgroundColor: "#E8F3FF" }]}
              >
                <Ionicons name="person-outline" size={22} color="#2E7DFF" />
              </View>
              <Text style={[styles.settingText, darkMode && styles.darkText]}>
                Personal Information
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={22}
              color={darkMode ? "#8A8A8E" : "#BDBDBD"}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.settingItem, darkMode && styles.darkSettingItem]}
          >
            <View style={styles.settingItemLeft}>
              <View
                style={[styles.iconContainer, { backgroundColor: "#FFF0E6" }]}
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={22}
                  color="#FF9F5A"
                />
              </View>
              <Text style={[styles.settingText, darkMode && styles.darkText]}>
                Security
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={22}
              color={darkMode ? "#8A8A8E" : "#BDBDBD"}
            />
          </TouchableOpacity>

          <View
            style={[styles.settingItem, darkMode && styles.darkSettingItem]}
          >
            <View style={styles.settingItemLeft}>
              <View
                style={[styles.iconContainer, { backgroundColor: "#E6FFF4" }]}
              >
                <Ionicons
                  name="finger-print-outline"
                  size={22}
                  color="#33D69F"
                />
              </View>
              <Text style={[styles.settingText, darkMode && styles.darkText]}>
                Biometric Login
              </Text>
            </View>
            <Switch
              trackColor={{ false: "#E0E0E0", true: "#2E7DFF" }}
              thumbColor={biometrics ? "#FFFFFF" : "#F4F4F4"}
              ios_backgroundColor="#E0E0E0"
              onValueChange={() => setBiometrics(!biometrics)}
              value={biometrics}
            />
          </View>
        </View>

        {/* Preferences Settings */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, darkMode && styles.darkText]}>
            Preferences
          </Text>

          <View
            style={[styles.settingItem, darkMode && styles.darkSettingItem]}
          >
            <View style={styles.settingItemLeft}>
              <View
                style={[styles.iconContainer, { backgroundColor: "#F0E6FF" }]}
              >
                <Ionicons name="moon-outline" size={22} color="#9966FF" />
              </View>
              <Text style={[styles.settingText, darkMode && styles.darkText]}>
                Dark Mode
              </Text>
            </View>
            <Switch
              trackColor={{ false: "#E0E0E0", true: "#2E7DFF" }}
              thumbColor={darkMode ? "#FFFFFF" : "#F4F4F4"}
              ios_backgroundColor="#E0E0E0"
              onValueChange={() => setDarkMode(!darkMode)}
              value={darkMode}
            />
          </View>

          <View
            style={[styles.settingItem, darkMode && styles.darkSettingItem]}
          >
            <View style={styles.settingItemLeft}>
              <View
                style={[styles.iconContainer, { backgroundColor: "#FFE6E6" }]}
              >
                <Ionicons
                  name="notifications-outline"
                  size={22}
                  color="#FF5A5A"
                />
              </View>
              <Text style={[styles.settingText, darkMode && styles.darkText]}>
                Notifications
              </Text>
            </View>
            <Switch
              trackColor={{ false: "#E0E0E0", true: "#2E7DFF" }}
              thumbColor={notifications ? "#FFFFFF" : "#F4F4F4"}
              ios_backgroundColor="#E0E0E0"
              onValueChange={() => setNotifications(!notifications)}
              value={notifications}
            />
          </View>

          <View
            style={[styles.settingItem, darkMode && styles.darkSettingItem]}
          >
            <View style={styles.settingItemLeft}>
              <View
                style={[styles.iconContainer, { backgroundColor: "#E6FAFF" }]}
              >
                <Ionicons name="sync-outline" size={22} color="#33B5D6" />
              </View>
              <Text style={[styles.settingText, darkMode && styles.darkText]}>
                Data Synchronization
              </Text>
            </View>
            <Switch
              trackColor={{ false: "#E0E0E0", true: "#2E7DFF" }}
              thumbColor={dataSync ? "#FFFFFF" : "#F4F4F4"}
              ios_backgroundColor="#E0E0E0"
              onValueChange={() => setDataSync(!dataSync)}
              value={dataSync}
            />
          </View>
        </View>

        {/* Support Settings */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, darkMode && styles.darkText]}>
            Support
          </Text>

          <TouchableOpacity
            style={[styles.settingItem, darkMode && styles.darkSettingItem]}
          >
            <View style={styles.settingItemLeft}>
              <View
                style={[styles.iconContainer, { backgroundColor: "#FFF6E6" }]}
              >
                <Ionicons
                  name="help-circle-outline"
                  size={22}
                  color="#FFB44D"
                />
              </View>
              <Text style={[styles.settingText, darkMode && styles.darkText]}>
                Help Center
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={22}
              color={darkMode ? "#8A8A8E" : "#BDBDBD"}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.settingItem, darkMode && styles.darkSettingItem]}
          >
            <View style={styles.settingItemLeft}>
              <View
                style={[styles.iconContainer, { backgroundColor: "#E6FAFF" }]}
              >
                <Ionicons
                  name="document-text-outline"
                  size={22}
                  color="#33B5D6"
                />
              </View>
              <Text style={[styles.settingText, darkMode && styles.darkText]}>
                Terms & Privacy Policy
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={22}
              color={darkMode ? "#8A8A8E" : "#BDBDBD"}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.settingItem, darkMode && styles.darkSettingItem]}
          >
            <View style={styles.settingItemLeft}>
              <View
                style={[styles.iconContainer, { backgroundColor: "#F0FFE6" }]}
              >
                <Ionicons name="star-outline" size={22} color="#8FD633" />
              </View>
              <Text style={[styles.settingText, darkMode && styles.darkText]}>
                Rate Our App
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={22}
              color={darkMode ? "#8A8A8E" : "#BDBDBD"}
            />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <View style={styles.versionContainer}>
          <Text
            style={[styles.versionText, darkMode && styles.darkVersionText]}
          >
            Version 1.0.2
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  darkContainer: {
    backgroundColor: "#1A1C2E",
  },
  header: {
    paddingTop: 60,
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1A1C2E",
  },
  darkText: {
    color: "#FFFFFF",
  },
  profileSection: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    padding: 20,
    marginHorizontal: 16,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 5,
  },
  darkSection: {
    backgroundColor: "#2A2C3E",
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  profileInfo: {
    marginLeft: 16,
    justifyContent: "center",
  },
  profileName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A1C2E",
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: "#64748B",
    marginBottom: 10,
  },
  editProfileButton: {
    backgroundColor: "#E8F3FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  editProfileText: {
    color: "#2E7DFF",
    fontWeight: "500",
    fontSize: 12,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A1C2E",
    marginBottom: 16,
    marginLeft: 4,
  },
  settingItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  darkSettingItem: {
    backgroundColor: "#2A2C3E",
  },
  settingItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  settingText: {
    fontSize: 16,
    color: "#1A1C2E",
    fontWeight: "500",
  },
  logoutButton: {
    backgroundColor: "#FF5A5A",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 24,
  },
  logoutText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  versionContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  versionText: {
    fontSize: 14,
    color: "#94A3B8",
  },
  darkVersionText: {
    color: "#64748B",
  },
});

export default SettingsTab;
