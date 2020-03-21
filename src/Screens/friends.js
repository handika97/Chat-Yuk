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
  Button,
  Modal,
} from 'react-native';
import app from '../config/firebase';
import * as firebase from 'firebase';
import 'firebase/firestore';
const db = app.firestore();
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {ScrollView} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
//import {styles} from '../components/ListDataComp';
import Geolocation from '@react-native-community/geolocation';
// import Modal, {ModalContent} from 'react-native-modals';
import OneSignal from 'react-native-onesignal';
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
      gender: '',
      story: '',
    };
    OneSignal.init('a464b459-cadf-4ccd-a3ce-c670ff2b3e52');
    OneSignal.addEventListener('received', this.onReceived);
    OneSignal.addEventListener('opened', this.onOpened);
    OneSignal.addEventListener('ids', this.onIds);
    OneSignal.configure();
  }

  onReceived = notification => {
    console.log('Notification received: ', notification);
  };

  onOpened = openResult => {
    console.log('Message: ', openResult.notification.payload.body);
    console.log('Data: ', openResult.notification.payload.additionalData);
    console.log('isActive: ', openResult.notification.isAppInFocus);
    console.log('openResult: ', openResult);
  };

  onIds = device => {
    console.log('Device info: ', device);
    this.setState({device});
  };

  addChat = async id => {
    let email = await AsyncStorage.getItem('email');

    let dbRef = firebase.database().ref('users');
    dbRef.on('child_added', val => {
      let person = val.val();
      //person.email = val.key;

      if (person.uid === id.uid) {
        this.setState({
          // name: person.name,
          // gender: person.gender,
          // story: person.story,
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
          gender: person.gender,
          story: person.story,
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
  getUser = () => {
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
  updateUsers = () => {
    firebase
      .database()
      .ref('users/' + this.props.route.params.uid)
      .update({
        name: this.state.name,
        gender: this.state.gender,
        story: this.state.story,
      });
    this.setState({
      visible: false,
    });
    this.getUser();
  };
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
            backgroundColor: 'white',
            flexDirection: 'row',
            display: 'flex',
            // justifyContent: 'center',
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 11,
            },
            shadowOpacity: 0.57,
            shadowRadius: 15.19,

            elevation: 7,
          }}>
          <Image
            source={require('../asset/logo.png')}
            style={{
              marginTop: -20,
              height: 100,
              width: 100,
              alignSelf: 'flex-start',
            }}
          />
        </View>
        <ScrollView>
          {this.state.friendss.length !== 0
            ? this.state.friend.map(friend => {
                return this.state.friendss.map(friendss => {
                  return friend.uid === friendss.uid ? (
                    <View
                      style={{
                        height: 70,
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
                        elevation: 3,
                      }}>
                      <TouchableOpacity
                        onPress={() => this.sendLocation(friendss.name)}>
                        <View
                          style={{
                            marginLeft: 10,
                            height: 50,

                            width: 50,
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
                                marginTop: -35,
                                alignSelf: 'center',
                              }}>
                              {friendss.name}
                            </Text>
                          </TouchableOpacity>

                          <Text
                            style={{
                              fontSize: 13,
                              marginLeft: 20,
                              color: 'grey',
                              alignSelf: 'center',
                              marginTop: -50,
                            }}>
                            #{friendss.story}
                          </Text>
                        </View>
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
            height: 50,
            width: '100%',
            // flexDirection: 'row',
            display: 'flex',
          }}>
          <TouchableOpacity
            onPress={() => this.setState({visible: true})}
            style={{alignSelf: 'center'}}>
            <Image
              source={require('../asset/profile.png')}
              style={{height: 50, width: 50}}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate('addFriends', {
                name: this.state.name,
                email: this.state.email,
                uid: this.props.route.params.uid,
              })
            }
            style={{alignSelf: 'flex-end', marginTop: -51}}>
            <Image
              source={{
                uri:
                  'https://cdn2.iconfinder.com/data/icons/jetflat-faces/90/005_027_friend_add_like_subscribe_user_human_avatar-512.png',
              }}
              style={{height: 50, width: 50}}
            />
          </TouchableOpacity>
        </View>

        <Modal visible={this.state.visible}>
          {/* <ModalContent> */}
          <KeyboardAwareScrollView
            resetScrollToCoords={{x: 0, y: 0}}
            scrollEnabled={false}>
            <View
              style={{
                width: width,
                backgroundColor: 'white',
                height: '100%',
                display: 'flex',
              }}>
              <View
                style={{
                  height: 70,
                  width: '100%',
                  backgroundColor: 'white',
                  flexDirection: 'row',
                  display: 'flex',
                  // justifyContent: 'center',
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 11,
                  },
                  shadowOpacity: 0.57,
                  shadowRadius: 15.19,

                  elevation: 7,
                }}>
                <Image
                  source={require('../asset/logo.png')}
                  style={{
                    marginTop: -20,
                    height: 100,
                    width: 100,
                    alignSelf: 'flex-start',
                  }}
                />
              </View>
              <View
                style={{
                  marginTop: 10,
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
                    borderRadius: 10,
                  }}
                />
              </View>
              <TouchableOpacity
                onPress={() => {
                  this.logout(), this.setState({visible: false});
                }}
                style={{
                  marginTop: -110,
                  marginLeft: 250,
                }}>
                <View>
                  <Image
                    source={{
                      uri:
                        'https://cdn0.iconfinder.com/data/icons/2-colors-superthick/128/exit-door-log-out-512.png',
                    }}
                    style={{
                      height: 60,
                      width: 60,
                    }}
                  />
                </View>
              </TouchableOpacity>

              <View style={{display: 'flex'}}>
                <View
                  style={{
                    width: 300,
                    marginTop: 70,
                    marginLeft: 10,
                    borderBottomWidth: 2,
                    alignSelf: 'center',
                  }}>
                  <TextInput
                    type="text"
                    onChangeText={text => this.setState({name: text})}
                    style={{
                      fontSize: 20,
                    }}>
                    {this.state.user.name}
                  </TextInput>
                </View>
                <View
                  style={{
                    width: 300,
                    marginTop: 10,
                    marginLeft: 10,
                    borderBottomWidth: 2,
                    alignSelf: 'center',
                  }}>
                  <TextInput
                    type="text"
                    onChangeText={text => this.setState({email: text})}
                    style={{
                      fontSize: 20,
                    }}
                    editable={false}>
                    {this.state.user.email}
                  </TextInput>
                </View>
                <View
                  style={{
                    width: 300,
                    marginTop: 10,
                    marginLeft: 10,
                    borderBottomWidth: 2,
                    alignSelf: 'center',
                  }}>
                  <TextInput
                    type="text"
                    placeholder="Gender"
                    onChangeText={text => this.setState({gender: text})}
                    style={{
                      fontSize: 20,
                    }}>
                    {this.state.user.gender}
                  </TextInput>
                </View>
                <View
                  style={{
                    width: 300,
                    marginTop: 10,
                    marginLeft: 10,
                    borderBottomWidth: 2,
                    alignSelf: 'center',
                  }}>
                  <TextInput
                    type="text"
                    placeholder="write your story"
                    onChangeText={text => this.setState({story: text})}
                    style={{
                      fontSize: 20,
                    }}>
                    {this.state.user.story}
                  </TextInput>
                </View>
              </View>

              <View style={{display: 'flex'}}>
                <TouchableOpacity onPress={() => this.updateUsers()}>
                  <View
                    style={{
                      height: 30,
                      width: 70,
                      backgroundColor: '#2196F3',
                      marginTop: 20,
                      justifyContent: 'center',
                      alignSelf: 'center',
                    }}>
                    <Text style={{alignSelf: 'center'}}>Update</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.setState({visible: false})}>
                  <View
                    style={{
                      height: 50,
                      width: 50,
                      marginTop: 35,
                      justifyContent: 'center',
                      alignSelf: 'center',
                    }}>
                    <Image
                      source={require('../asset/profile.png')}
                      style={{height: '100%', width: '100%'}}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAwareScrollView>
          {/* </ModalContent> */}
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
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
