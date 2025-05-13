const IP_ADDRESS = 'IP';

export const MEDICINE_API = `http://${IP_ADDRESS}:5000`;
export const DIET_API = `http://${IP_ADDRESS}:5000`;
export const OVERVIEW_API = `http://${IP_ADDRESS}:5000`;
export const CAMERA_API = `http://${IP_ADDRESS}:5001`;

// If you need full custom endpoints
export const getOverviewUrl = (endpoint) => `${OVERVIEW_API}/${endpoint}`;
export const getMedicineUrl = (endpoint) => `${MEDICINE_API}/${endpoint}`;
export const getDietUrl = (endpoint) => `${DIET_API}/${endpoint}`;
export const getCameraUrl = (endpoint) => `${CAMERA_API}/${endpoint}`;