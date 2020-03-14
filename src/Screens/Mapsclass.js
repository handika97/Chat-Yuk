import React, {useState, useEffect, Fragment} from 'react';

import Geolocation from '@react-native-communzity/geolocation';
import {ScrollView} from 'react-native-gesture-handler';
import {request, PERMISSIONS} from 'react-native-permissions';
import {
  Image,
  ImageBackground,
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  Platform,
  Alert,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TouchableHighlight,
} from 'react-native';

import Modal from 'react-native-modal';

import {
  Container,
  Header,
  Content,
  Card,
  CardItem,
  Thumbnail,
  Button,
  Left,
  Body,
} from 'native-base';

import MapView, {
  PROVIDER_GOOGLE,
  Marker,
  Callout,
  Circle,
  Polygon,
} from 'react-native-maps';
const inittialState = {
  latitude: null,
  longitude: null,
  latitudeDelta: 0,
  longitudeDelta: 0.05,
};
// console.state(props);
export default class Maps extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      initialPosition: [],
    };
  }
  locateCurrentPosition = () => {
    Geolocation.getCurrentPosition(position => {
      // console.log(JSON.stringify(position));
      let initialPosition = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        latitudeDelta: 0,
        longitudeDelta: 0.02,
      };
      this.setState({
        initialPosition,
      });
    });
  };
  componentDidMount() {
    this.locateCurrentPosition();
  }

  requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      var response = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      console.log('iPhone: ' + response);
      if (response === 'granted') {
        this.locateCurrentPosition();
      }
    } else {
      var response = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      console.log('Android: ' + response);
      if (response === 'granted') {
        this.locateCurrentPosition();
      }
    }
  };
  render() {
    return (
      <>
        {this.state.initialPosition.length !== 0 ? (
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            showsUserLocation
            initialRegion={this.state.initialPosition}>
            {/* <Circle
              center={this.state.initialPosition}
              radius={500}
              strokeColor={'#9999ff'}
              strokeWidth={1}
              fillColor={'rgba(153, 187, 255,0.5)'}
            /> */}
          </MapView>
        ) : null}
      </>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    flex: 1,
  },
  map: {
    height: '100%',
    width: '100%',
  },
  textCenter: {
    textAlign: 'center',
  },
  listCarousel: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 0,
    marginBottom: 170,
    marginLeft: 20,
  },
  carousel: {
    position: 'absolute',
    bottom: 0,
    marginBottom: 30,
  },
  cardContainer: {
    alignSelf: 'center',
    height: 70,
    width: 70,
    padding: 5,
    borderRadius: 10,
  },
  cardContainerTitle: {
    backgroundColor: 'rgba(90, 82, 165,1)',
    height: 20,
    width: 70,
    top: 0,
    position: 'absolute',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    alignSelf: 'center',
    textAlign: 'center',
    padding: 4,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 10,
  },
  cardImage: {
    height: 50,
    width: 70,
    bottom: 0,
    position: 'absolute',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  modalMaps: {padding: 0, margin: 0},
  btnBottom: {position: 'absolute', bottom: 0, width: '100%'},
});
