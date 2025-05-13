import React, { useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Card, Title } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons"; // For the show more/show less icon
import { macroNutrients, microNutrients } from "../../../data/nutrients";

const NutroScreen = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState<"macro" | "micro">(
    "macro"
  );
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSearching, setIsSearching] = useState(true);
  const [details, setDetails] = useState(null);

  const toggleExpanded = (id: string) => {
    setExpanded((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const handleBackPress = () => {
    if (!isSearching) {
      setIsSearching(true);
      setDetails(null);
    } else {
      navigation.goBack();
    }
  };

  // Filter nutrients based on the search query
  const nutrientsData =
    selectedCategory === "macro" ? macroNutrients : microNutrients;
  const filteredData = nutrientsData.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sources.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#6200ea" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        {/* Category Buttons */}
        <View style={styles.categoryButtons}>
          <TouchableOpacity
            style={[
              styles.categoryButton,
              selectedCategory === "macro" && styles.selectedButton,
            ]}
            onPress={() => setSelectedCategory("macro")}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === "macro" && styles.selectedText,
              ]}
            >
              Macro Nutrients
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.categoryButton,
              selectedCategory === "micro" && styles.selectedButton,
            ]}
            onPress={() => setSelectedCategory("micro")}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === "micro" && styles.selectedText,
              ]}
            >
              Micro Nutrients
            </Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <TextInput
          style={styles.searchBar}
          placeholder="Search for a nutrient..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        {/* Nutrient List */}
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <Card.Content>
                <View style={styles.cardHeader}>
                  <Title style={styles.cardTitle}>{item.name}</Title>
                  <Text style={styles.dailyRequirement}>
                    {item.dailyRequirement}
                  </Text>
                </View>

                {/* Type Section */}
                <Text style={styles.nutrientType}>{item.type}</Text>

                {/* Description Section */}
                <Text style={styles.description}>{item.description}</Text>

                {/* Sources Section */}
                <View style={styles.sourcesContainer}>
                  <Text style={styles.chipTitle}>Sources:</Text>
                  <Text style={styles.sourcesText}>{item.sources}</Text>
                </View>

                {/* Show More Button */}
                <TouchableOpacity
                  style={styles.showMoreButton}
                  onPress={() => toggleExpanded(item.id)}
                >
                  <Text style={styles.showMoreText}>
                    {expanded[item.id] ? "Show Less" : "Show More"}
                  </Text>
                  <Ionicons
                    name={expanded[item.id] ? "chevron-up" : "chevron-down"}
                    size={18}
                    color="white"
                    style={styles.showMoreIcon}
                  />
                </TouchableOpacity>

                {/* Deficiency Effects Section, shown only if expanded */}
                {expanded[item.id] && (
                  <View style={styles.defieciencyContainer}>
                    <Text style={styles.chipTitle}>Deficiency Effects:</Text>
                    <Text style={styles.sourcesText}>{item.deficiency}</Text>
                    <Text style={styles.chipTitle}>Toxicity Warning:</Text>
                    <Text style={styles.sourcesText}>{item.toxicity}</Text>
                    <Text style={styles.chipTitle}>Benefits:</Text>
                    <Text style={styles.sourcesText}>{item.benefits}</Text>
                  </View>
                )}
              </Card.Content>
            </Card>
          )}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
    marginTop: 20,
  },
  searchBar: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  categoryButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  categoryButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: "#ddd",
  },
  selectedButton: {
    backgroundColor: "#6200ea",
  },
  categoryText: {
    fontSize: 16,
    color: "#333",
  },
  selectedText: {
    color: "#fff",
  },
  card: {
    marginBottom: 15,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    elevation: 5,
    padding: 15,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  backText: {
    fontSize: 16,
    color: "#6200ea",
    marginLeft: 8,
    fontWeight: "500",
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  dailyRequirement: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#6200ea",
  },
  nutrientType: {
    fontSize: 14,
    color: "#6200ea",
    fontStyle: "italic",
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: "#555",
    marginBottom: 15,
    fontStyle: "italic",
  },
  sourcesContainer: {
    marginBottom: 15,
  },
  chipTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#6200ea",
  },
  sourcesText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
  },
  defieciencyContainer: {
    marginTop: 20,
    marginBottom: 15,
  },
  showMoreButton: {
    marginTop: 10,
    backgroundColor: "#6200ea",
    paddingVertical: 5,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  showMoreText: {
    color: "white",
    fontSize: 16,
  },
  showMoreIcon: {
    marginLeft: 8,
  },
});

export default NutroScreen;
