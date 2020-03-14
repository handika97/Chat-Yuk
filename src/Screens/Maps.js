import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, ActivityIndicator, Image} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import {ScrollView} from 'react-native-gesture-handler';

const inittialState = {
  latitude: null,
  longitude: null,
  latitudeDelta: 0,
  longitudeDelta: 0.05,
};
// console.state(props);
const Maps = props => {
  const [currenPosition, setCurrentPosition] = useState(inittialState);
  const [propss, setpropss] = useState(props.route.params.friends);
  const [propsss, setpropsss] = useState(props.route.params);
  useEffect(() => {
    Geolocation.getCurrentPosition(
      position => {
        // alert(JSON.stringify(position));
        const {latitude, longitude} = position.coords;
        setCurrentPosition({
          ...currenPosition,
          latitude,
          longitude,
        });
      },
      error => alert(error.message),
      {timeout: 20000, maximumAge: 1000},
    );
  });
  console.log(propss);
  return currenPosition.latitude ? (
    <MapView
      provider={PROVIDER_GOOGLE}
      style={styles.map}
      showsMyLocationButton={true}
      showsTraffic
      showsCompass
      initialRegion={{
        latitude: propsss.latitude,
        longitude: propsss.longitude,
        longitudeDelta: 0.001,
        latitudeDelta: 0.001,
      }}>
      <Marker
        coordinate={currenPosition}
        style={{
          width: 70,
          height: 70,
        }}
      />
      {propss !== null
        ? propss.map(location => {
            return (
              <Marker
                coordinate={{
                  latitude: location.latitude,
                  longitude: location.longitude,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
                style={{
                  width: 70,
                  height: 70,
                }}>
                <Text
                  style={{
                    fontSize: 10,
                    marginTop: 0,
                    zIndex: 20,
                    alignSelf: 'center',
                  }}>
                  {location.name}
                </Text>
                <Image
                  source={{
                    uri: `${location.avatar}`,
                  }}
                  style={{
                    width: ' 70%',
                    height: '70%',
                    borderRadius: 100,
                    borderWidth: 3,
                    borderColor: 'green',
                    alignSelf: 'center',
                  }}
                />
              </Marker>
            );
          })
        : null}
    </MapView>
  ) : (
    <ActivityIndicator size="large" style={styles.loading} />
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
    height: '90%',
    justifyContent: 'center',
  },
  loading: {
    flex: 1,
  },
});

export default Maps;
