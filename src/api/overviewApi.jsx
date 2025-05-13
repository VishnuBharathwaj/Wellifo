import axios from "axios";
import { OVERVIEW_API } from "./config";

export const fetchTXT = async (disease) => {
    try {
      const response = await fetch(`URL`); // Adjust the URL
      if (!response.ok) {
        throw new Error("Failed to fetch TXT file.");
      }
      const text = await response.text();
      return { content: text }; 
    } catch (error) {
      console.error("Error fetching TXT:", error);
      throw error; 
    }
  };
  
export const fetchSymptoms = async () => {
  const response = await axios.get(`${OVERVIEW_API}/symptoms`);
  return response.data;
};

export const searchDiseases = async (symptom) => {
  const response = await axios.post(`${OVERVIEW_API}/search`, { symptom });
  return response.data;
};

export const fetchPDF = async (disease) => {
  const response = await axios.post(`${OVERVIEW_API}/pdf`, { disease });
  return response.data;
};
