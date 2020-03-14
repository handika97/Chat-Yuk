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
const inittialState = {
  latitude: -62.000132,
  longitude: 100.23434,
  latitudeDelta: 0,
  longitudeDelta: 0.05,
};
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

      coordinates: this.props.route.params.friends,
    };
  }

  onCarouselItemChange = index => {
    let location = this.state.coordinates[index];

    this._map.animateToRegion({
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0,
      longitudeDelta: 0.03,
    });

    this.state.markers[index].showCallout();
  };
  myMarker() {
    Geolocation.getCurrentPosition(position => {
      this._map.animateToRegion({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        latitudeDelta: 0,
        longitudeDelta: 0.01,
      });
    });
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

  requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      var response = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      console.log('iPhone: ' + response);
      if (response === 'granted') {
        // this.locateCurrentPosition();
      }
    } else {
      var response = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      console.log('Android: ' + response);
      if (response === 'granted') {
        // this.locateCurrentPosition();
      }
    }
  };
  onMakerPressed = (location, index) => {
    this._map.animateToRegion({
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0,
      longitudeDelta: 0.01,
    });
    this._carousel.snapToItem(index);
  };
  renderCarouseItem = ({item, index}) => (
    <TouchableWithoutFeedback
      onPress={() => {
        this.onMakerPressed(item, index);
      }}>
      <View style={styles.cardContainer}>
        <Text style={styles.cardContainerTitle}>
          <Text style={styles.cardTitle}>{item.name}</Text>
        </Text>
        <Image style={styles.cardImage} source={{uri: `${item.avatar}`}} />
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
            {/* <Circle
          center={this.state.initialPosition}
          radius={500}
          strokeColor={'#9999ff'}
          strokeWidth={1}
          fillColor={'rgba(153, 187, 255,0.5)'}
        /> */}
            <Polygon coordinates={this.state.coordinates} strokeWidth={0} />
            {this.state.coordinates.map((marker, index) => (
              <Marker
                // key={marker.id}
                ref={ref => (this.state.markers[index] = ref)}
                onPress={() => this.onMakerPressed(marker, index)}
                coordinate={{
                  latitude: marker.latitude,
                  longitude: marker.longitude,
                }}>
                <Thumbnail source={{uri: `${marker.avatar}`}} />
                <Callout>
                  <View>
                    <Text style={styles.textCenter}>{marker.name}</Text>
                  </View>
                </Callout>
              </Marker>
            ))}
          </MapView>
        ) : null}
        <Carousel
          ref={c => {
            this._carousel = c;
          }}
          data={this.state.coordinates}
          containerCustomStyle={styles.carousel}
          renderItem={this.renderCarouseItem}
          sliderWidth={Dimensions.get('window').width}
          removeClippedSubviews={false}
          itemWidth={100}
          onSnapToItem={index => this.onCarouselItemChange(index)}
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
