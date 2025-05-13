import axios from 'axios';
import { DIET_API } from './config'; 

export const generatePlan = async (formData) => {
  try {
    const response = await axios.post(`${DIET_API}/generate-plan`, formData, {
      timeout: 10000, 
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
