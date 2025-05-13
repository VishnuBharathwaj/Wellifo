import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Dimensions,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { auth } from "../api/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";

const { width, height } = Dimensions.get("window");

export default function SignupPage({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert("Success", "Account created successfully!");
    } catch (error) {
      Alert.alert("Signup Failed", error.message);
    }
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#4568DC" />
      <LinearGradient
        colors={["#4568DC", "#B06AB3"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {/* Decorative Elements */}
        <View style={[styles.decorCircle, styles.decorCircle1]} />
        <View style={[styles.decorCircle, styles.decorCircle2]} />
        
        <SafeAreaView style={styles.safeArea}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyboardAvoid}
          >
            <ScrollView 
              contentContainerStyle={styles.scrollView}
              showsVerticalScrollIndicator={false}
            >
              
              <View style={styles.container}>
                <View style={styles.header}>
                  <Text style={styles.title}>Join WELLIFO</Text>
                  <Text style={styles.subtitle}>Create your account to begin your health journey</Text>
                </View>

                {/* Input fields with animated placeholder effect */}
                <View style={styles.inputContainer}>

                  <View style={styles.inputWrapper}>
                    <MaterialCommunityIcons
                      name="email-outline"
                      size={22}
                      color="#6B6B6B"
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Email"
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      placeholderTextColor="#9E9E9E"
                    />
                  </View>

                  <View style={styles.inputWrapper}>
                    <MaterialCommunityIcons
                      name="lock-outline"
                      size={22}
                      color="#6B6B6B"
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Password"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                      placeholderTextColor="#9E9E9E"
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      style={styles.eyeIcon}
                    >
                      <MaterialCommunityIcons
                        name={showPassword ? "eye-off" : "eye"}
                        size={22}
                        color="#6B6B6B"
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Privacy policy */}
                <View style={styles.privacyContainer}>
                  <Text style={styles.privacyText}>
                    By signing up, you agree to our{" "}
                    <Text style={styles.privacyLink}>Terms of Service</Text> and{" "}
                    <Text style={styles.privacyLink}>Privacy Policy</Text>
                  </Text>
                </View>

                {/* Signup button */}
                <TouchableOpacity
                  style={styles.signupButton}
                  onPress={handleSignup}
                >
                  <LinearGradient
                    colors={["#6C63FF", "#4568DC"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.signupButtonGradient}
                  >
                    <Text style={styles.signupButtonText}>Create Account</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <View style={styles.loginContainer}>
                  <Text style={styles.loginText}>Already have an account?</Text>
                  <TouchableOpacity onPress={() => navigation.replace("Login")}>
                    <Text style={styles.loginButtonText}>Log in</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  safeArea: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  backButton: {
    padding: 16,
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 10,
  },
  container: {
    flex: 1,
    paddingHorizontal: 25,
    paddingTop: 60,
    paddingBottom: 30,
    justifyContent: "space-between",
  },
  header: {
    marginBottom: 40,
    alignItems: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
    maxWidth: '80%',
  },
  inputContainer: {
    marginBottom: 25,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 15,
    marginBottom: 16,
    paddingHorizontal: 15,
    height: 60,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  eyeIcon: {
    padding: 8,
  },
  privacyContainer: {
    marginBottom: 30,
  },
  privacyText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  privacyLink: {
    color: "#fff",
    fontWeight: "500",
    textDecorationLine: "underline",
  },
  signupButton: {
    borderRadius: 15,
    height: 60,
    marginBottom: 30,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
  signupButtonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: "center",
    alignItems: "center",
  },
  signupButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  dividerText: {
    paddingHorizontal: 15,
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
  },
  socialIconsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 30,
  },
  socialIconButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "rgba(255,255,255,0.2)",
    marginHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    gap: 8,
  },
  loginText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 16,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  decorCircle: {
    position: 'absolute',
    borderRadius: 150,
    backgroundColor: 'rgba(255,255,255,0.1)',
    zIndex: 0,
  },
  decorCircle1: {
    width: 250,
    height: 250,
    top: -100,
    right: -50,
  },
  decorCircle2: {
    width: 180,
    height: 180,
    bottom: -40,
    left: -70,
  },
});