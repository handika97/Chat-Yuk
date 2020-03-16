import React, {useState, useEffect, Fragment} from 'react';

import Geolocation from '@react-native-community/geolocation';
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
import Carousel from 'react-native-snap-carousel';

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

// console.state(props);
export default class Maps extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      markers: [],
      initialPosition: {
        latitude: this.props.route.params.latitude,
        longitude: this.props.route.params.longitude,
        longitudeDelta: 0.001,
        latitudeDelta: 0.001,
      },

      fransCoordinates: this.props.route.params.friends,
    };
  }

  carause_map = index => {
    let location = this.state.fransCoordinates[index];

    this._map.animateToRegion({
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0,
      longitudeDelta: 0.03,
    });

    this.state.markers[index].showCallout();
  };
  market() {
    Geolocation.getCurrentPosition(position => {
      this._map.animateToRegion({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        latitudeDelta: 0,
        longitudeDelta: 0.01,
      });
    });
  }

  CurrentPosition = () => {
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
    // this.requestLocationPermission();
    this.setState({
      initialPosition: {
        latitude: this.props.route.params.latitude,
        longitude: this.props.route.params.longitude,
        longitudeDelta: 0.001,
        latitudeDelta: 0.001,
      },
    });
  }

  onPress = (location, index) => {
    this._map.animateToRegion({
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0,
      longitudeDelta: 0.01,
    });
    this._carousel.snapToItem(index);
  };
  renderCarouse = ({item, index}) => (
    <TouchableWithoutFeedback
      onPress={() => {
        this.onPress(item, index);
      }}>
      <View
        style={{
          alignSelf: 'center',
          height: 70,
          width: 70,
          padding: 5,
          borderRadius: 10,
        }}>
        <Image
          style={{
            height: '100%',
            width: ' 100%',
            bottom: 0,
            position: 'relative',
            borderRadius: 10,
          }}
          source={{uri: `${item.avatar}`}}
        />
      </View>
    </TouchableWithoutFeedback>
  );
  render() {
    console.log('yee', this.props.route.params.friends);
    return (
      <>
        {this.state.initialPosition.length !== 0 ? (
          <MapView
            ref={map => (this._map = map)}
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            showsUserLocation
            initialRegion={this.state.initialPosition}>
            <Polygon
              coordinates={this.state.fransCoordinates}
              strokeWidth={0}
            />
            {this.state.fransCoordinates.map((marker, index) => (
              <Marker
                // key={marker.id}
                ref={ref => (this.state.markers[index] = ref)}
                onPress={() => this.onPress(marker, index)}
                coordinate={{
                  latitude: marker.latitude,
                  longitude: marker.longitude,
                }}>
                <Thumbnail source={{uri: `${marker.avatar}`}} />
                {/* <Callout>
                  <View>
                    <Text style={styles.textCenter}>{marker.name}</Text>
                  </View>
                </Callout> */}
              </Marker>
            ))}
          </MapView>
        ) : null}
        <Carousel
          ref={c => {
            this._carousel = c;
          }}
          data={this.state.fransCoordinates}
          containerCustomStyle={{
            position: 'absolute',
            bottom: 0,
            marginBottom: 30,
          }}
          renderItem={this.renderCarouse}
          sliderWidth={Dimensions.get('window').width}
          removeClippedSubviews={false}
          itemWidth={100}
          onSnapToItem={index => this.carause_map(index)}
        />
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
});
