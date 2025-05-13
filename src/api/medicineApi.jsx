import { MEDICINE_API } from "./config";

export const fetchSuggestions = async (query) => {
  try {
    const response = await fetch(`${MEDICINE_API}/search?query=${query}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    return [];
  }
};

export const fetchMedicineDetails = async (name) => {
  try {
    const response = await fetch(`${MEDICINE_API}/medicine/${encodeURIComponent(name)}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching details:', error);
    return { error: 'Failed to fetch medicine details' };
  }
};