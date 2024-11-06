import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

const Splash = () => {
  return (
    <View style={styles.container}>
      <Image source={require('C:\\Users\\evapr\\Desktop\\MC\\Donation-Management-System-UEE-CodingClan\\DonationManagementAdminApp\\assets\\splash.png')} style={styles.image} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default Splash;
