import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  SafeAreaView,
  RefreshControl,
  ActivityIndicator
} from 'react-native';

// Mock data for demonstration
const MOCK_NEWS = [
  {
    id: '1',
    title: 'COVID-19 Booster Shots Available',
    description: 'Free COVID-19 booster shots now available at Central Hospital every weekend. Appointments not required.',
    type: 'camp', // camp or alert
    date: '2025-04-20',
    location: 'Central Hospital, Main St.',
    image: 'https://placeholder.com/medical-camp'
  },
  {
    id: '2',
    title: 'Dengue Fever Alert in Riverside Area',
    description: 'Health officials report increased cases of dengue fever in Riverside. Take precautions against mosquito bites.',
    type: 'alert',
    date: '2025-04-15',
    severity: 'high',
    image: 'https://placeholder.com/alert'
  },
  {
    id: '3',
    title: 'Free Eye Check-up Camp',
    description: 'Free comprehensive eye examinations for all ages. Prescription glasses available at subsidized rates.',
    type: 'camp',
    date: '2025-04-25',
    location: 'Community Center, Park Avenue',
    image: 'https://placeholder.com/eye-camp'
  },
  {
    id: '4',
    title: 'Seasonal Flu on the Rise',
    description: 'Seasonal influenza cases increasing in the eastern districts. Vaccination recommended for vulnerable populations.',
    type: 'alert',
    date: '2025-04-14',
    severity: 'medium',
    image: 'https://placeholder.com/flu'
  },
];

const HealthNews = ({navigation}) => {
  const [activeTab, setActiveTab] = useState('all');
  const [news, setNews] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

//   const navigation = useNavigation();

  // Simulating API fetch
  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = () => {
    // In a real app, replace with actual API call
    setLoading(true);
    setTimeout(() => {
      setNews(MOCK_NEWS);
      setLoading(false);
    }, 1000);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchNews();
    setRefreshing(false);
  };

  const filterNews = () => {
    if (activeTab === 'all') return news;
    return news.filter(item => item.type === activeTab);
  };

  const getItemColor = (type, severity) => {
    if (type === 'camp') return '#4CAF50'; // Green for camps
    if (severity === 'high') return '#F44336'; // Red for high severity alerts
    return '#FF9800'; // Orange for medium severity alerts
  };

  const renderNewsItem = ({ item }) => (
    <TouchableOpacity 
      style={[
        styles.newsCard, 
        { borderLeftColor: getItemColor(item.type, item.severity) }
      ]}
    >
      <View style={styles.cardHeader}>
        <View style={styles.tagContainer}>
          <Text style={[
            styles.tag, 
            { backgroundColor: getItemColor(item.type, item.severity) }
          ]}>
            {item.type === 'camp' ? 'MEDICAL CAMP' : 'HEALTH ALERT'}
          </Text>
        </View>
        <Text style={styles.date}>{new Date(item.date).toLocaleDateString()}</Text>
      </View>

      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
      
      {item.location && (
        <View style={styles.locationContainer}>
          <Text style={styles.locationLabel}>Location: </Text>
          <Text style={styles.locationText}>{item.location}</Text>
        </View>
      )}
      
      {item.severity && (
        <View style={styles.severityContainer}>
          <Text style={styles.severityLabel}>Severity: </Text>
          <Text style={[
            styles.severityText, 
            { color: item.severity === 'high' ? '#F44336' : '#FF9800' }
          ]}>
            {item.severity.toUpperCase()}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Health News</Text>
        <Text style={styles.headerSubtitle}>Stay informed about local health events</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'all' && styles.activeTab]} 
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>All</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'camp' && styles.activeTab]} 
          onPress={() => setActiveTab('camp')}
        >
          <Text style={[styles.tabText, activeTab === 'camp' && styles.activeTabText]}>Medical Camps</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'alert' && styles.activeTab]} 
          onPress={() => setActiveTab('alert')}
        >
          <Text style={[styles.tabText, activeTab === 'alert' && styles.activeTabText]}>Health Alerts</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0066CC" />
          <Text style={styles.loadingText}>Loading health updates...</Text>
        </View>
      ) : (
        <FlatList
          data={filterNews()}
          renderItem={renderNewsItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#0066CC']}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No health updates available</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    padding: 16,
    backgroundColor: '#0066CC',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E1E5EA',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#0066CC',
  },
  tabText: {
    fontSize: 14,
    color: '#555',
  },
  activeTabText: {
    color: '#0066CC',
    fontWeight: '600',
  },
  listContainer: {
    padding: 12,
  },
  newsCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderLeftWidth: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tagContainer: {
    flexDirection: 'row',
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  date: {
    fontSize: 12,
    color: '#777',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    marginBottom: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    marginTop: 4,
  },
  locationLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
  },
  locationText: {
    fontSize: 13,
    color: '#555',
  },
  severityContainer: {
    flexDirection: 'row',
    marginTop: 4,
  },
  severityLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
  },
  severityText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#555',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: '#777',
    textAlign: 'center',
  }
});

export default HealthNews;