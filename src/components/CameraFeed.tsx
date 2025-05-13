import React, { useEffect, useRef, useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator, 
  Alert,
  Dimensions,
  StatusBar,
  SafeAreaView
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { CAMERA_API } from '../api/config';

interface DetectionDetail {
  item: string;
  confidence: number;
}

interface DetectionResponse {
  [key: string]: {
    detected: boolean;
    details: DetectionDetail[];
  };
}

interface Props {
  updateProgress: (data: DetectionResponse) => void;
}

const CameraFeed: React.FC<Props> = ({ updateProgress }) => {
  const cameraRef = useRef(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraOn, setCameraOn] = useState(false);
  const [facing, setFacing] = useState<string>('back'); // Changed to string type
  const [loading, setLoading] = useState(false);
  const [lastCapture, setLastCapture] = useState<string | null>(null);
  const [detectionCount, setDetectionCount] = useState(0);

  useEffect(() => {
    if (!permission?.granted) requestPermission();
  }, [permission, requestPermission]);

  const toggleCamera = () => {
    setFacing(prev => prev === 'back' ? 'front' : 'back'); // Using string values
  };

  const startCamera = () => setCameraOn(true);
  const stopCamera = () => setCameraOn(false);

  const captureAndDetect = useCallback(async () => {
    if (!cameraRef.current) return;
    
    try {
      setLoading(true);
      const photo = await cameraRef.current.takePictureAsync({ base64: false });
      const fileUri = photo.uri;
      setLastCapture(fileUri);
      
      const formData = new FormData();
      formData.append('image', {
        uri: fileUri,
        type: 'image/jpeg',
        name: 'photo.jpg',
      } as any);
      
      const response = await fetch(`${CAMERA_API}/detect`, {
        method: 'POST',
        body: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      const result: DetectionResponse = await response.json();
      updateProgress(result);
      setDetectionCount(prev => prev + 1);
    } catch (error) {
      console.error('Error detecting objects:', error);
      Alert.alert('Error', 'Failed to detect food.');
    } finally {
      setLoading(false);
    }
  }, [cameraRef, updateProgress]);

  useEffect(() => {
    if (cameraOn) {
      const interval = setInterval(captureAndDetect, 3000);
      return () => clearInterval(interval);
    }
  }, [cameraOn, captureAndDetect]);

  if (!permission?.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Camera permission is required</Text>
        <TouchableOpacity 
          style={styles.permissionButton}
          onPress={requestPermission}
        >
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {cameraOn ? (
        <View style={styles.cameraContainer}>
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            type={facing} // Using string value ('back' or 'front')
            ratio="16:9"
          />
          
          {loading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#ffffff" />
              <Text style={styles.loadingText}>Analyzing...</Text>
            </View>
          )}
          
          <View style={styles.captureInfo}>
            <Text style={styles.captureText}>
              {detectionCount > 0 ? `Captured: ${detectionCount}` : 'Ready to detect'}
            </Text>
          </View>
          
          <View style={styles.controls}>
            <TouchableOpacity 
              style={styles.circleButton}
              onPress={toggleCamera}
            >
              <Ionicons name="camera-reverse" size={24} color="#fff" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.captureButton, loading && styles.captureButtonDisabled]}
              onPress={captureAndDetect}
              disabled={loading}
            >
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.circleButton}
              onPress={stopCamera}
            >
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.startContainer}>
          <Text style={styles.startText}>Camera is off</Text>
          <TouchableOpacity 
            style={styles.startButton}
            onPress={startCamera}
          >
            <Ionicons name="camera" size={28} color="#fff" />
            <Text style={styles.startButtonText}>Start Camera</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  cameraContainer: {
    flex: 1,
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  },
  captureInfo: {
    position: 'absolute',
    top: 16,
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 8,
  },
  captureText: {
    color: '#fff',
    fontSize: 14,
  },
  controls: {
    position: 'absolute',
    bottom: 30,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  circleButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fff',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'transparent',
    borderWidth: 4,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#fff',
  },
  captureButtonDisabled: {
    borderColor: 'rgba(255,255,255,0.5)',
  },
  startContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  startText: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 20,
  },
  startButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
    fontWeight: 'bold',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
    padding: 20,
  },
  permissionText: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  permissionButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CameraFeed;