import React from 'react';
import { StatusBar, View, StyleSheet } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';

const StatusBarManager = ({ backgroundColor, children }) => {
  const statusBarStyle = isLightColor(backgroundColor) ? 'dark-content' : 'light-content';

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <StatusBar
        barStyle={statusBarStyle}
        backgroundColor={backgroundColor}
      />
      {children}
    </View>
  );
};

// Utility function to determine if a color is light or dark
const isLightColor = (color) => {
  const hex = color.replace('#', '');
  const c_r = parseInt(hex.substr(0, 2), 16);
  const c_g = parseInt(hex.substr(2, 2), 16);
  const c_b = parseInt(hex.substr(4, 2), 16);
  const brightness = (c_r * 299 + c_g * 587 + c_b * 114) / 1000;
  return brightness > 155;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: getStatusBarHeight(),
  },
});

export default StatusBarManager;
