import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import {
  fetchSymptoms,
  searchDiseases,
  fetchPDF,
} from "../../../api/overviewApi";

import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const DiseaseOverview = () => {
  const [symptoms, setSymptoms] = useState([]);
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [diseases, setDiseases] = useState([]);
  const [pdfContent, setPdfContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchDone, setSearchDone] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    fetchSymptoms()
      .then(setSymptoms)
      .catch((error) => console.error("Error fetching symptoms:", error));
  }, []);

  const handleInputChange = (text) => {
    setInput(text);
    setSuggestions(
      symptoms.filter((s) => s.toLowerCase().includes(text.toLowerCase()))
    );
  };

  const handleSearch = async () => {
    if (!input.trim()) {
      Alert.alert("Error", "Please enter a symptom to search.");
      return;
    }

    setLoading(true);
    try {
      const result = await searchDiseases(input);
      setDiseases(result.diseases);
      setSearchDone(true);
    } catch (error) {
      console.error("Error fetching diseases:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPDFContent = async (disease) => {
    setLoading(true);
    try {
      const result = await fetchPDF(disease);
      let rawText = result.content || "No readable text found in PDF.";

      // Normalize line endings
      let formatted = rawText.replace(/\r/g, "");

      // Merge lines that got broken mid-word or mid-sentence
      formatted = formatted.replace(/([^\n])\n(?=[^\n])/g, "$1 ");

      // Ensure headings start on a new line
      formatted = formatted.replace(
        /(Definition:|Symptoms:|Risk Factors:|Home Remedies:|Medical Remedies:|Prevention:|Consult a Doctor if:|Fun Facts:)/g,
        "\n\n$1"
      );

      // Ensure bullet points start on a new line
      formatted = formatted.replace(/●/g, "\n●");

      // Collapse excessive blank lines
      formatted = formatted.replace(/\n{3,}/g, "\n\n").trim();

      setPdfContent(formatted);
    } catch (error) {
      console.error("Error fetching PDF content:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setInput("");
    setSuggestions([]);
    setDiseases([]);
    setPdfContent("");
    setSearchDone(false);
  };

  return (
    <LinearGradient
      colors={["#4568DC", "#B06AB3"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.container}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Health Conditions</Text>

          {!searchDone && (
            <View style={styles.section}>
              <Text style={styles.label}>Search by symptom</Text>
              <TextInput
                value={input}
                onChangeText={handleInputChange}
                placeholder="E.g. headache, fever..."
                style={styles.input}
                placeholderTextColor="#aaa"
              />
              <TouchableOpacity onPress={handleSearch} style={styles.button}>
                <Text style={styles.buttonText}>Find Conditions</Text>
              </TouchableOpacity>
            </View>
          )}

          {suggestions.length > 0 && !searchDone && (
            <View style={styles.section}>
              <Text style={styles.subheading}>Common Symptoms</Text>
              <ScrollView style={{ maxHeight: 150 }}>
                {suggestions.map((s, index) => (
                  <TouchableOpacity key={index} onPress={() => setInput(s)}>
                    <Text style={styles.suggestion}>{s}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {loading && (
            <ActivityIndicator
              size="large"
              color="#fff"
              style={{ marginVertical: 20 }}
            />
          )}

          {diseases.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.subheading}>Possible Conditions</Text>
              {diseases.map((d, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => fetchPDFContent(d)}
                  style={styles.card}
                >
                  <Text style={styles.diseaseName}>{d}</Text>
                  <Ionicons name="chevron-forward" size={20} color="#4568DC" />
                </TouchableOpacity>
              ))}
            </View>
          )}

          {pdfContent !== "" && (
            <View style={styles.section}>
              <Text style={styles.subheading}>Condition Information</Text>
              <View style={styles.infoCard}>
                {pdfContent.split(/\n+/).map((line, index) => {
                  const trimmed = line.trim();
                  const isHeading = /^[A-Z][a-z\s]+:$/g.test(trimmed);
                  const isBullet = trimmed.startsWith("●");

                  return (
                    <Text
                      key={index}
                      style={[
                        styles.details,
                        isHeading && styles.sectionHeading,
                        isBullet && styles.bulletPoint,
                      ]}
                    >
                      {trimmed}
                    </Text>
                  );
                })}
              </View>
            </View>
          )}

          {searchDone && (
            <TouchableOpacity
              onPress={handleReset}
              style={[
                styles.button,
                { backgroundColor: "#ff3b30", marginTop: 20, marginBottom: 30 },
              ]}
            >
              <Text style={styles.buttonText}>New Search</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 24,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  section: {
    marginBottom: 20,
    paddingHorizontal: 5,
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    color: "#fff",
    fontWeight: "500",
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 1,
  },
  subheading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#fff",
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 1,
  },
  input: {
    height: 50,
    borderWidth: 0,
    borderRadius: 12,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    color: "#333",
    marginBottom: 12,
    fontSize: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  button: {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.4)",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 1,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
  },
  suggestion: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    color: "#333",
  },
  diseaseName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4568DC",
  },
  details: {
    fontSize: 16,
    color: "#444",
    lineHeight: 24,
    textAlign: "left",
    marginBottom: 6,
  },
  sectionHeading: {
    fontWeight: "bold",
    marginTop: 16,
    color: "#4568DC",
    fontSize: 18,
  },
  bulletPoint: {
    paddingLeft: 15,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 16,
  },
  backText: {
    fontSize: 16,
    color: "#fff",
    marginLeft: 8,
    fontWeight: "500",
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 1,
  },
});

export default DiseaseOverview;