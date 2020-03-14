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
  Dimensions,
} from 'react-native';
import app from '../config/firebase';
import * as firebase from 'firebase';
import 'firebase/firestore';
const db = app.firestore();
import {ScrollView} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
//import {styles} from '../components/ListDataComp';
import Geolocation from '@react-native-community/geolocation';
import Modal, {ModalContent} from 'react-native-modals';

export default class friends extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      friends: [],
      friend: [],
      friendss: [],
      idUser_2: '',
      visible: false,
      name: '',
      email: '',
      uid: this.props.route.uid,
      location: [],
      userLocation: [],
      user: [],
    };
  }

  addChat = async id => {
    let email = await AsyncStorage.getItem('email');

    let dbRef = firebase.database().ref('users');
    dbRef.on('child_added', val => {
      let person = val.val();
      //person.email = val.key;

      if (person.uid === id.uid) {
        this.setState({
          name: person.name,
        });

        this.props.navigation.navigate('Home', {
          user2: id,
          user: this.state.user,
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
      .child(`${this.props.route.params.uid}`);
    // let dbReff = firebase.database().ref('users');

    dbRef.on('child_added', val => {
      let person = val.val();
      //person.email = val.key;

      this.setState(prevState => {
        return {
          friend: [...prevState.friend, person],
        };
      });
    });
    let dbReff = firebase.database().ref('users');
    dbReff.on('child_added', val => {
      let person = val.val();
      //person.email = val.key;

      if (person.uid === this.props.route.params.uid) {
      } else {
        this.setState(prevState => {
          // this.myfriends();
          return {
            friendss: [...prevState.friendss, person],
          };
        });
      }
    });
  }
  componentDidMount = async () => {
    // await AsyncStorage.setItem('email', `${this.props.route.params.email}`);
    // await AsyncStorage.setItem('uid', `${this.props.route.params.uid}`);
    let email = await AsyncStorage.getItem('email');
    this.setState({
      email: email,
    });

    // BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);

    this.locateCurrentPosition();

    setTimeout(() => this.getLocation(), 2000);
    let dbRef = firebase.database().ref('users');
    dbRef.on('child_added', val => {
      let person = val.val();
      //person.email = val.key;

      if (person.uid === this.props.route.params.uid) {
        this.setState({
          name: person.name,
          user: person,
        });
      }
    });
    if (
      this.state.friend !== undefined &&
      this.state.userLocation.length === 0
    ) {
      setTimeout(() => this.friendsLocation(), 2000);
    }
  };
  handleBackButton = () => {
    BackHandler.exitApp();
    // return true;
  };
  logout = async () => {
    firebase
      .database()
      .ref('users/' + this.props.route.params.uid)
      .update({
        status: 0,
      });
    try {
      await AsyncStorage.removeItem('email');
      await AsyncStorage.removeItem('uid');
      await this.props.navigation.replace('Login');
    } catch (e) {
      e;
    }
  };
  locateCurrentPosition = () => {
    Geolocation.getCurrentPosition(position => {
      firebase
        .database()
        .ref('users/' + this.props.route.params.uid)
        .update({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
    });
  };

  getLocation = () => {
    this.setState({location: []});
    let dbRef = firebase.database().ref('users');

    dbRef.on('child_added', val => {
      let person = val.val();
      //person.email = val. key;

      this.setState(prevState => {
        return {
          location: [...prevState.location, person],
        };
      });
    });
  };
  friendsLocation = () => {
    this.setState({userLocation: []});
    for (let i = 0; i < this.state.friendss.length; i++) {
      for (let j = 0; j < this.state.friend.length; j++) {
        if (this.state.friendss[i].uid === this.state.friend[j].uid) {
          this.setState(prevState => {
            return {
              userLocation: [...prevState.userLocation, this.state.friendss[i]],
            };
          });
        } else {
        }
      }
      //
    }
  };
  // friendsLocation = () => {
  //   // this.setState({userLocation: []});
  //   for (let i = 0; i < this.state.location.length; i++) {
  //     for (let j = 0; j < this.state.friend.length; j++) {
  //       if (
  //         this.state.location[i].uid === this.state.friend[j].uid &&
  //         this.state.location[i].uid !== this.props.route.params.uid
  //       ) {
  //         this.setState(prevState => {
  //           return {
  //             userLocation: [...prevState.userLocation, this.state.location[i]],
  //           };
  //         });
  //       }
  //     }
  //     //
  //   }
  // };
  myfriends = () => {
    this.setState({friends: []});
    for (let i = 0; i < this.state.friendss.length; i++) {
      for (let j = 0; j < this.state.friend.length; j++) {
        if (this.state.friendss[i].uid === this.state.friend[j].uid) {
          this.setState(prevState => {
            return {
              friends: [...prevState.friends, this.state.friendss[i]],
            };
          });
        }
      }
      //
    }
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
    }
  };

  render() {
    let {height, width} = Dimensions.get('window');
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
                email: this.state.email,
                uid: this.props.route.params.uid,
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
          {this.state.friendss.length !== 0
            ? this.state.friend.map(friend => {
                return this.state.friendss.map(friendss => {
                  return friend.uid === friendss.uid ? (
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
                        onPress={() => this.sendLocation(friendss.name)}>
                        <View
                          style={{
                            marginLeft: 10,
                            height: 80,

                            width: 80,
                            borderRadius: 100,
                            borderBottomColor: '#3bb0ba',
                          }}>
                          <Image
                            source={{
                              uri: `${friendss.avatar}`,
                            }}
                            style={{
                              height: '100%',
                              width: '100%',
                              marginLeft: 0,
                              alignSelf: 'center',
                              borderRadius: 100,
                            }}
                          />
                        </View>
                      </TouchableOpacity>
                      <View>
                        <TouchableOpacity
                          onPress={
                            () => this.addChat(friendss)
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
                            {friendss.name}
                          </Text>
                        </TouchableOpacity>
                      </View>
                      {friendss.status === 1 ? (
                        <View
                          style={{
                            height: 10,
                            width: 10,
                            borderRadius: 20,
                            backgroundColor: 'green',
                          }}
                        />
                      ) : (
                        <View
                          style={{
                            height: 10,
                            width: 10,
                            borderRadius: 20,
                            backgroundColor: 'red',
                          }}
                        />
                      )}
                    </View>
                  ) : null;
                });
              })
            : null}
          {/* <Text>heheh</Text> */}
        </ScrollView>
        <View
          style={{
            height: 70,
            width: '100%',
            flexDirection: 'row',
            alignContent: 'center',
            justifyContent: 'center',
          }}>
          <TouchableOpacity onPress={() => this.setState({visible: true})}>
            <Image
              source={require('../asset/profile.png')}
              style={{height: 50, width: 50, marginLeft: 0}}
            />
          </TouchableOpacity>
        </View>
        <Modal
          visible={this.state.visible}
          swipeDirection={['up', 'down']} // can be string or an array
          swipeThreshold={200} // default 100
          onSwipeOut={event => {
            this.setState({visible: false});
          }}
          onTouchOutside={event => {
            this.setState({visible: false});
          }}
          style={{marginTop: 150}}>
          <ModalContent>
            <View
              style={{
                width: width,
                backgroundColor: 'white',
                height: '100%',
              }}>
              <View
                style={{
                  marginTop: 30,
                  height: 100,
                  width: 100,
                  marginLeft: 0,
                  alignSelf: 'center',
                }}>
                <Image
                  source={{
                    uri: `${this.state.user.avatar}`,
                  }}
                  style={{
                    height: '100%',
                    width: '100%',
                    marginLeft: 0,
                    alignSelf: 'center',
                  }}
                />
              </View>
              <View>
                <Text
                  style={{alignSelf: 'center', fontSize: 30, marginTop: 30}}>
                  {this.state.user.name}
                </Text>
              </View>
              <View>
                <Text
                  style={{alignSelf: 'center', fontSize: 25, marginTop: 30}}>
                  {this.state.user.email}
                </Text>
              </View>
              {/* <View
                style={{
                  flexDirection: 'row',
                  height: '10%',
                  width: '100%',
                  marginLeft: 22,
                }}>
                <TextInput
                  style={{
                    height: 60,
                    width: 200,
                    fontSize: 20,

                    borderBottomWidth: 2,
                  }}
                  placeholder=" Share Your Story"
                  selectionColor="#428AF8"
                  name="name"
                  value={this.state.status}
                  onChangeText={text => this.setState({status: text})}
                />
                <TouchableOpacity onPress={() => this.handleUpdate()}>
                  <View
                    style={{
                      marginLeft: 20,
                      width: 80,
                      height: 40,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderWidth: 1,
                      backgroundColor: 'grey',
                      marginTop: 17,
                      borderRadius: 10,
                    }}>
                    <Text
                      style={{
                        fontSize: 20,
                      }}>
                      Share
                    </Text>
                  </View>
                </TouchableOpacity>
              </View> */}
            </View>
          </ModalContent>
        </Modal>
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
