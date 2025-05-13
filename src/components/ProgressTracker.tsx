import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  StatusBar,
  Alert,
  Dimensions
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import CameraFeed from './CameraFeed';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface DetectionDetail {
  item: string;
  confidence: number;
}

interface ProgressState {
  [key: string]: {
    completed: boolean;
    details: DetectionDetail[];
  };
}

const ProgressTracker: React.FC = () => {
  const [progress, setProgress] = useState<ProgressState>({
    vitamin_a: { completed: false, details: [] },
    vitamin_b: { completed: false, details: [] },
    vitamin_c: { completed: false, details: [] },
    minerals: { completed: false, details: [] },
    macronutrients: { completed: false, details: [] },
  });

  const [showCamera, setShowCamera] = useState(false);

  const updateProgress = (newData: any) => {
    setProgress((prev) => {
      const updatedProgress = { ...prev };
      Object.entries(newData).forEach(([key, value]: [string, any]) => {
        if (value.detected) {
          updatedProgress[key].completed = true;
          updatedProgress[key].details = value.details;
        }
      });
      return updatedProgress;
    });
  };

  const resetProgress = () => {
    Alert.alert(
      "Reset Progress",
      "Are you sure you want to reset all your progress?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Reset", 
          style: "destructive",
          onPress: () => {
            setProgress({
              vitamin_a: { completed: false, details: [] },
              vitamin_b: { completed: false, details: [] },
              vitamin_c: { completed: false, details: [] },
              minerals: { completed: false, details: [] },
              macronutrients: { completed: false, details: [] },
            });
          }
        }
      ]
    );
  };

  const showRewards = () => {
    const completedCount = Object.values(progress).filter(item => item.completed).length;
    const totalCount = Object.keys(progress).length;
    
    if (completedCount === 0) {
      Alert.alert(
        "No Rewards Yet",
        "Complete nutrition categories to earn rewards!",
        [{ text: "OK" }]
      );
    } else {
      Alert.alert(
        "Your Rewards",
        `You've completed ${completedCount}/${totalCount} categories!\n\n` +
        `${calculateRewards(completedCount, totalCount)}`,
        [{ text: "Great!" }]
      );
    }
  };

  const calculateRewards = (completed: number, total: number) => {
    const percentage = (completed / total) * 100;
    
    if (percentage >= 100) {
      return "🏆 Achievement Unlocked: Nutrition Master!\nYou've earned 500 health points!";
    } else if (percentage >= 80) {
      return "🥇 Achievement Unlocked: Nutrition Expert!\nYou've earned 300 health points!";
    } else if (percentage >= 60) {
      return "🥈 Achievement Unlocked: Nutrition Enthusiast!\nYou've earned 200 health points!";
    } else if (percentage >= 40) {
      return "🥉 Achievement Unlocked: Nutrition Beginner!\nYou've earned 100 health points!";
    } else {
      return "Keep going! You're on your way to your first achievement!";
    }
  };

  const getTotalProgress = () => {
    const completed = Object.values(progress).filter(item => item.completed).length;
    return (completed / Object.keys(progress).length) * 100;
  };

  const formatTitle = (key: string) => {
    return key.replace('_', ' ').replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    // <SafeAreaView style={styles.safeArea}>
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor="#4568DC" />
      
      {showCamera ? (
        <View style={styles.cameraContainer}>
          <CameraFeed updateProgress={updateProgress} />
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => setShowCamera(false)}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <LinearGradient
            colors={["#4568DC", "#B06AB3"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerGradient}
          >
            <View style={styles.header}>
              <View style={styles.headerTextContainer}>
                <Text style={styles.title}>Nutrition Tracker</Text>
                <Text style={styles.subtitle}>Track your nutritional intake</Text>
              </View>
              <View style={styles.headerIcons}>
                <TouchableOpacity 
                  style={styles.iconButton}
                  onPress={resetProgress}
                >
                  <MaterialCommunityIcons name="refresh" size={24} color="#fff" />
                </TouchableOpacity>
                
                {/* <TouchableOpacity 
                  style={styles.iconButton}
                  onPress={showRewards}
                >
                  <MaterialCommunityIcons name="trophy" size={24} color="#fff" />
                </TouchableOpacity> */}
                
                <TouchableOpacity 
                  style={styles.iconButton}
                  onPress={() => setShowCamera(true)}
                >
                  <MaterialCommunityIcons name="camera" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>

          <ScrollView 
            style={styles.container}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.progressContainer}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressTitle}>Your Progress</Text>
                <View style={styles.progressPercentageContainer}>
                  <Text style={styles.progressPercentage}>{getTotalProgress().toFixed(0)}%</Text>
                  <Text style={styles.progressStatus}>
                    {getTotalProgress() === 100 ? 'Completed' : 'In Progress'}
                  </Text>
                </View>
              </View>
              
              <View style={styles.progressBarContainer}>
                <LinearGradient
                  colors={["#4568DC", "#B06AB3"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.progressBar, { width: `${getTotalProgress()}%` }]}
                />
              </View>
              
              <View style={styles.progressBoxesContainer}>
                {Object.entries(progress).map(([key, data], index) => (
                  <View 
                    key={key} 
                    style={[
                      styles.progressBox, 
                      data.completed ? styles.completedBox : styles.incompleteBox
                    ]}
                  >
                    {data.completed && (
                      <MaterialCommunityIcons name="check" size={16} color="#fff" />
                    )}
                  </View>
                ))}
              </View>
            </View>

            <Text style={styles.sectionTitle}>Nutrition Categories</Text>
            
            <View style={styles.taskList}>
              {Object.entries(progress).map(([key, data]) => (
                <View 
                  key={key}
                  style={[
                    styles.task,
                    data.completed && styles.completedTask
                  ]}
                >
                  <View style={styles.taskHeader}>
                    <View style={styles.taskTitleContainer}>
                      <View style={[
                        styles.categoryIcon,
                        { backgroundColor: data.completed ? '#4caf50' : '#B06AB3' }
                      ]}>
                        <MaterialCommunityIcons 
                          name={
                            key === 'vitamin_a' ? 'alpha-a-circle' :
                            key === 'vitamin_b' ? 'alpha-b-circle' :
                            key === 'vitamin_c' ? 'alpha-c-circle' :
                            key === 'minerals' ? 'molecule' :
                            'food-apple'
                          } 
                          size={24} 
                          color="#fff" 
                        />
                      </View>
                      <Text style={styles.taskTitle}>{formatTitle(key)}</Text>
                    </View>
                    <View style={styles.statusContainer}>
                      {data.completed ? (
                        <View style={styles.statusBadge}>
                          <MaterialCommunityIcons name="check-circle" size={16} color="#4caf50" />
                          <Text style={styles.statusText}>Detected</Text>
                        </View>
                      ) : (
                        <View style={[styles.statusBadge, styles.pendingBadge]}>
                          <MaterialCommunityIcons name="clock-time-four-outline" size={16} color="#ff9800" />
                          <Text style={styles.pendingText}>Pending</Text>
                        </View>
                      )}
                    </View>
                  </View>
                  
                  {data.completed && data.details.length > 0 && (
                    <View style={styles.detailsContainer}>
                      {data.details.map((item, index) => (
                        <View key={index} style={styles.detailItem}>
                          <Text style={styles.detailName}>{item.item}</Text>
                          <View style={styles.confidenceContainer}>
                            <View style={styles.confidenceBarContainer}>
                              <LinearGradient
                                colors={["#4568DC", "#B06AB3"]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={[
                                  styles.confidenceBar, 
                                  { width: `${item.confidence * 100}%` }
                                ]}
                              />
                            </View>
                            <Text style={styles.confidenceText}>
                              {(item.confidence * 100).toFixed(0)}%
                            </Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              ))}
            </View>

          </ScrollView>
        </>
      )}
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  headerGradient: {
    paddingTop: StatusBar.currentHeight || 40,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  headerIcons: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 15,
    padding: 5,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: -20,
  },
  progressContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  progressPercentageContainer: {
    alignItems: 'flex-end',
  },
  progressPercentage: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4568DC',
  },
  progressStatus: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 15,
  },
  progressBar: {
    height: '100%',
    borderRadius: 5,
  },
  progressBoxesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedBox: {
    backgroundColor: '#4caf50',
    elevation: 3,
  },
  incompleteBox: {
    backgroundColor: '#e0e0e0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  taskList: {
    paddingBottom: 30,
  },
  task: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  completedTask: {
    borderLeftWidth: 5,
    borderLeftColor: '#4caf50',
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  taskTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#B06AB3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  statusContainer: {
    flexDirection: 'row',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  pendingBadge: {
    backgroundColor: '#fff3e0',
  },
  statusText: {
    fontSize: 12,
    color: '#388e3c',
    marginLeft: 4,
    fontWeight: '600',
  },
  pendingText: {
    fontSize: 12,
    color: '#f57c00',
    marginLeft: 4,
    fontWeight: '600',
  },
  detailsContainer: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  detailItem: {
    marginBottom: 12,
  },
  detailName: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    fontWeight: '500',
  },
  confidenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 24,
  },
  confidenceBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginRight: 10,
    overflow: 'hidden',
  },
  confidenceBar: {
    height: 8,
    borderRadius: 4,
  },
  confidenceText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
    width: 40,
    textAlign: 'right',
  },
  cameraContainer: {
    flex: 1,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: 55,
    left: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    borderRadius: 30,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    overflow: 'hidden',
  },
  gradientButton: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
  },
});

export default ProgressTracker;