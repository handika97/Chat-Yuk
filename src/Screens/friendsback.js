import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Alert,
  BackHandler,
  Image,
} from 'react-native';
import app from '../config/firebase';
import * as firebase from 'firebase';
import 'firebase/firestore';
const db = app.firestore();
import {ScrollView} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
//import {styles} from '../components/ListDataComp';
import Geolocation from '@react-native-community/geolocation';

export default class friends extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      friends: [],
      idUser_2: '',
      name: '',
      email: this.props.route.params,
      location: [],
      userLocation: [],
    };
  }
  getUsers = async () => {
    db.collectionGroup('friends')
      .where('user', '==', `${await AsyncStorage.getItem('email')}`)
      .get()
      .then(querySnapshot => {
        const chatRoom = [];
        querySnapshot.forEach(doc => chatRoom.push(doc.data()));

        this.setState({
          friends: chatRoom,
        });
        // setTimeout(() => {

        // }, 1500);
      });
  };
  addChat = async id => {
    let email = await AsyncStorage.getItem('email');

    let dbRef = firebase.database().ref('users');
    dbRef.on('child_added', val => {
      let person = val.val();
      //person.email = val.key;

      if (person.email === email) {
        this.setState({
          name: person.name,
        });

        this.props.navigation.navigate('Home', {
          user2: id,
          user: this.state.name,
        });
      } else {
        // this.setState(prevState => {
        //   return {
        //     friends: [...prevState.friends, person],
        //   };
        // });
      }
    });
  };
  componentWillUnmount = () => {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  };
  UNSAFE_componentWillMount() {
    // BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);

    let dbRef = firebase
      .database()
      .ref('friends')
      .child(`${this.props.route.params.name}`);
    dbRef.on('child_added', val => {
      let person = val.val();
      //person.email = val.key;

      if (person.email === this.props.route.params.email) {
      } else {
        this.setState(prevState => {
          return {
            friends: [...prevState.friends, person],
          };
        });
      }
    });
  }
  componentDidMount = async () => {
    // BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    setTimeout(() => {
      this.locateCurrentPosition();
    }, 5000);

    setTimeout(() => this.getLocation(), 5000);
    let dbRef = firebase.database().ref('users');
    dbRef.on('child_added', val => {
      let person = val.val();
      //person.email = val.key;

      if (person.email === this.props.route.params.email) {
        this.setState({
          name: person.name,
        });
      }
    });
    console.log('yeea', this.props.route);
  };
  handleBackButton = () => {
    // Alert.alert(
    //   ' Exit From App ',
    //   ' Do you want to exit From App ?',
    //   [
    //     {text: 'Yes', onPress: () => BackHandler.exitApp()},
    //     {text: 'No', onPress: () => console.log('NO Pressed')},
    //   ],
    //   {cancelable: false},
    // );

    // Return true to enable back button over ride.
    BackHandler.exitApp();
    // return true;
  };
  logout = async () => {
    try {
      await AsyncStorage.removeItem('email');
      await this.props.navigation.replace('Login');
    } catch (e) {
      e;
    }
  };
  locateCurrentPosition = () => {
    Geolocation.getCurrentPosition(position => {
      firebase
        .database()
        .ref('location/' + this.props.route.params.name)
        .set({
          name: this.props.route.params.name,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });

      // console.log(JSON.stringify(position));
      // let initialPosition = {
      //   latitude: position.coords.latitude,
      //   longitude: position.coords.longitude,
      //   latitudeDelta: 0,
      //   longitudeDelta: 0.02,
      // };
      // console.log('yee', initialPosition);
    });
  };

  getLocation = () => {
    this.setState({location: []});
    let dbRef = firebase.database().ref('location');

    dbRef.on('child_added', val => {
      let person = val.val();
      //person.email = val. key;

      this.setState(prevState => {
        return {
          location: [...prevState.location, person],
        };
      });
      this.friendsLocation();
    });
  };
  friendsLocation = () => {
    this.setState({userLocation: []});
    for (let i = 0; i < this.state.location.length; i++) {
      for (let j = 0; j < this.state.friends.length; j++) {
        if (this.state.location[i].name === this.state.friends[j].name) {
          this.setState(prevState => {
            return {
              userLocation: [...prevState.userLocation, this.state.location[i]],
            };
          });
        }
      }
      //
    }
    // console.log(this.state.location[0].name);
  };
  componentDidUpdate() {}
  sendLocation = name => {
    for (let i = 0; i < this.state.location.length; i++) {
      if (this.state.location[i].name === name) {
        this.props.navigation.navigate('map', {
          latitude: this.state.location[i].latitude,
          longitude: this.state.location[i].longitude,
          friends: this.state.userLocation,
        });
      }
      // console.log(this.state.location[i], this.state.userLocation);
    }
  };

  render() {
    console.log('yee', this.state.userLocation);
    console.log('yaa', this.state.location);

    return (
      <View style={styles.container}>
        <View
          style={{
            height: 70,
            width: '100%',
            backgroundColor: '#FF6870',
            flexDirection: 'row',
            alignContent: 'center',
            justifyContent: 'center',
          }}>
          <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate('addFriends', {
                name: this.state.name,
                email: this.props.route.params.email,
              })
            }>
            <Image
              source={{
                uri:
                  'https://cdn2.iconfinder.com/data/icons/jetflat-faces/90/005_027_friend_add_like_subscribe_user_human_avatar-512.png',
              }}
              style={{marginTop: 10, height: 50, width: 50, marginLeft: 0}}
            />
          </TouchableOpacity>
          <Image
            source={require('../asset/logo.png')}
            style={{marginTop: -20, height: 120, width: 120, marginLeft: 60}}
          />
          <TouchableOpacity onPress={() => this.logout()}>
            <Image
              source={{
                uri:
                  'https://cdn0.iconfinder.com/data/icons/2-colors-superthick/128/exit-door-log-out-512.png',
              }}
              style={{
                marginTop: 10,
                height: 50,
                width: 50,
                marginLeft: 70,
              }}
            />
          </TouchableOpacity>
        </View>
        <ScrollView>
          {this.state.friends.length !== 0
            ? this.state.friends.map(friends => {
                return (
                  <View
                    style={{
                      height: 100,
                      width: '100%',
                      borderWidth: 1,
                      marginTop: 20,
                      marginBottom: 5,
                      borderColor: '#3bb0ba',
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: 'white',
                      borderTopLeftRadius: 50,
                      borderBottomLeftRadius: 50,
                      elevation: 7,
                    }}>
                    <TouchableOpacity
                      onPress={() => this.sendLocation(friends.name)}>
                      <View
                        style={{
                          marginLeft: 10,
                          height: 80,
                          backgroundColor: 'blue',
                          width: 80,
                          borderRadius: 100,
                          borderBottomColor: '#3bb0ba',
                        }}
                      />
                    </TouchableOpacity>
                    <View>
                      <TouchableOpacity
                        onPress={
                          () => this.addChat(friends.name)
                          // this.props.navigation.navigate('Home', friends)
                        }
                        style={{
                          height: 100,
                          width: 200,
                          alignContent: 'center',
                          justifyContent: 'center',
                        }}>
                        <Text
                          style={{
                            fontSize: 20,
                            marginLeft: 20,
                            alignSelf: 'center',
                          }}>
                          {friends.name}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })
            : null}
          {/* <Text>heheh</Text> */}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#faf5e4',
  },
  nav: {
    height: 50,
    backgroundColor: '#4b80d6',
    marginTop: 0,
    flexDirection: 'row',
  },
  next: {
    height: 50,
    backgroundColor: '#4b80d6',
    marginTop: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
});
