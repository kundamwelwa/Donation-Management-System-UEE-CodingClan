import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';

const { width, height } = Dimensions.get('window');

const donationData = [
  { month: 'Jan', amount: 1200 },
  { month: 'Feb', amount: 1500 },
  { month: 'Mar', amount: 1700 },
  { month: 'Apr', amount: 2000 },
  { month: 'May', amount: 1800 },
  { month: 'Jun', amount: 2100 },
];

const Statistics = () => {
  const lineChartData = {
    labels: donationData.map(item => item.month),
    datasets: [
      {
        data: donationData.map(item => item.amount),
      },
    ],
  };

  const barChartData = {
    labels: donationData.map(item => item.month),
    datasets: [
      {
        data: donationData.map(item => item.amount),
      },
    ],
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Statistics</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Monthly Donations</Text>
          <LineChart
            data={lineChartData}
            width={width - 40}
            height={220}
            chartConfig={{
              backgroundColor: '#fff',
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            bezier
            style={styles.chart}
          />
        </View>
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Donations by Type</Text>
          <BarChart
            data={barChartData}
            width={width - 40}
            height={220}
            chartConfig={{
              backgroundColor: '#fff',
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            style={styles.chart}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F8FF',
  },
  header: {
    paddingVertical: height * 0.1,
    paddingHorizontal: width * 0.07,
    backgroundColor: '#201E43',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: height * 0.02,
    alignItems: 'center',
  },
  headerText: {
    fontSize: width * 0.08,
    fontWeight: 'bold',
    color: '#F0F8FF',
  },
  scrollContainer: {
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.02,
  },
  chartContainer: {
    marginBottom: height * 0.02,
  },
  chartTitle: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    marginBottom: height * 0.01,
    color: '#333',
  },
  chart: {
    borderRadius: 10,
  },
});

export default Statistics;
