import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Image,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Animated,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import app from '../config/firebase';
import * as firebase from 'firebase';
import {AuthContext} from '../context/auth';
import AsyncStorage from '@react-native-community/async-storage';
import {SafeAreaView} from 'react-native-safe-area-context';
import friends from './friends';
import {FlatList, ScrollView} from 'react-native-gesture-handler';
//const db = app.firestore();
import Axios from 'axios';
import OneSignal from 'react-native-onesignal';

const isIOS = Platform.OS === 'ios';
export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      person: this.props.route.params.name,
      text: '',
      messageList: [],
      e: '',
      f: '',
    };
    this.keyboardHeight = new Animated.Value(0);
    this.bottomPadding = new Animated.Value(60);
    OneSignal.init(process.env.onesignal_key);
    OneSignal.addEventListener('received', this.onReceived);
    OneSignal.addEventListener('opened', this.onOpened);
    OneSignal.addEventListener('ids', this.onIds);
    OneSignal.configure();
  }

  send = async () => {
    if (this.state.text.length > 0) {
      let msgId = await firebase
        .database()
        .ref('message')
        .child(this.props.route.params.user.uid)
        .child(this.props.route.params.user2.uid)
        .push().key;
      let updates = {};
      let message = {
        message: this.state.text,
        time: firebase.database.ServerValue.TIMESTAMP,
        from: this.props.route.params.user.name,
        uidFrom: this.props.route.params.user.uid,
      };

      updates[
        'message/' +
          this.props.route.params.user.uid +
          '/' +
          this.props.route.params.user2.uid +
          '/' +
          msgId
      ] = message;
      updates[
        'message/' +
          this.props.route.params.user2.uid +
          '/' +
          this.props.route.params.user.uid +
          '/' +
          msgId
      ] = message;
      firebase
        .database()
        .ref()
        .update(updates);
      this.setState({text: ''});
      console.log(this.state.text);
      let headers = {
        'Content-Type': 'application/json',
        Authorization:
          "Basic 'MmZhNDVkYTAtMWI0Yi00NjQ1LTg4MjUtNjcxNWY3Y2VjNzgz'",
      };

      let endpoint = 'https://onesignal.com/api/v1/notifications';

      let body = JSON.stringify({
        app_id: 'a464b459-cadf-4ccd-a3ce-c670ff2b3e52',
        include_player_ids: ['e8e5f386-8b58-426b-8220-482d66c19f53'],
        contents: {en: message.message},
      });
      let config = {
        headers,
      };

      await Axios.post(endpoint, body, config).then(res => console.log(res));
    }
  };
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
  UNSAFE_componentWillMount() {
    firebase
      .database()
      .ref('message')
      .child(this.props.route.params.user.uid)
      .child(this.props.route.params.user2.uid)
      .on('child_added', value => {
        let person = value.val();
        // console.log('yea', person);
        this.setState(prevState => {
          return {
            messageList: [...prevState.messageList, value.val()],
          };
        });
        // console.log('yeea', this.state.messageList);
      });
  }
  componentDidMount() {
    setTimeout(
      function() {
        this.scrollView.scrollToEnd();
      }.bind(this),
    );
  }
  componentWillUnmount() {
    // this.keyboardShowListener.remove();
    // this.keyboardHideListener.remove();
  }
  componentDidUpdate() {
    setTimeout(
      function() {
        this.scrollView.scrollToEnd();
      }.bind(this),
    );
  }
  convertTime = time => {
    let d = new Date(time);
    let c = new Date();
    // console.log(d.getDay(), d.getMonth(), d.getFullYear());
    // console.log('ye', c.getDay(), c.getMonth(), c.getFullYear());
    let result = (d.getHours() < 10 ? '0' : '') + d.getHours() + ':';
    result += (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
    if (c.getDay() !== d.getDay()) {
      result = d.getDate() + '-' + d.getMonth() + '-' + d.getFullYear();
    }
    return result;
  };

  // convertDate = time => {
  //   let d = new Date(time);
  //   let c = new Date();
  //   let result = 'This Day';
  //   // console.log(this.state.e);
  //   if (c.getDay() !== d.getDay()) {
  //     if (this.state.e === d.getDay()) {
  //       result = null;
  //     } else {
  //       result = d.getDate() + ' ' + d.getMonth() + ' ' + d.getFullYear();
  //       this.setState({
  //         e: d.getDay(),
  //       });
  //     }
  //   } else {
  //     if (this.state.f === d.getDate()) {
  //       result = null;
  //     } else {
  //       result = 'This Day';
  //       this.setState({
  //         f: d.getDate(),
  //       });
  //     }
  //   }
  //   console.log(result);
  //   return result;
  // };

  // let e = d.getDay();

  render() {
    let {height, width} = Dimensions.get('window');
    // console.log('yes', this.props.route.params);
    return (
      <SafeAreaView>
        <View
          style={{
            height: 70,
            width: '100%',
            backgroundColor: 'white',
            flexDirection: 'row',
            alignContent: 'center',
            justifyContent: 'center',
            position: 'absolute',
            zIndex: 20,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 11,
            },
            shadowOpacity: 0.57,
            shadowRadius: 15.19,

            elevation: 23,
          }}>
          <TouchableOpacity
            style={{height: 50, width: 50, marginLeft: width * -0.25}}
            onPress={() => this.props.navigation.navigate('friends')}>
            <Image
              source={require('../asset/back.png')}
              style={{marginTop: 10, height: 50, width: 50}}
            />
          </TouchableOpacity>
          <View style={{width: 200, height: 100, marginLeft: 10}}>
            <Text style={{fontSize: 20, color: 'black', marginTop: 20}}>
              {this.props.route.params.user2.name}
            </Text>
          </View>
        </View>
        <KeyboardAwareScrollView
          resetScrollToCoords={{x: 0, y: 0}}
          scrollEnabled={false}>
          <ScrollView
            ref={ref => {
              this.scrollView = ref;
            }}
            style={{
              height: height * 0.75,
              padding: 8,
              marginTop: height * 0.12,
              marginBottom: 1,
            }}>
            {this.state.messageList.length !== 0
              ? this.state.messageList.map(message => {
                  return (
                    <View>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignSelf:
                            message.uidFrom === this.props.route.params.user.uid
                              ? 'flex-end'
                              : 'flex-start',

                          marginBottom: 10,
                        }}>
                        {message.uidFrom ===
                        this.props.route.params.user.uid ? (
                          <Text
                            style={{
                              color: 'black',
                              padding: 7,
                              fontSize: 15,
                              backgroundColor: '#03fcd7',
                              borderRadius: 7,
                              maxWidth: '70%',
                            }}>
                            {message.message}
                            {'\n'}
                            <Text
                              style={{
                                fontSize: 10,
                                color: 'grey',
                              }}>
                              {this.convertTime(message.time)}
                            </Text>
                          </Text>
                        ) : (
                          <View style={{flexDirection: 'row'}}>
                            <Image
                              source={{
                                uri: `${this.props.route.params.user2.avatar}`,
                              }}
                              style={{
                                marginLeft: 0,
                                alignSelf: 'center',
                                borderRadius: 100,
                                height: 40,
                                width: 40,
                              }}
                            />
                            <Text
                              style={{
                                color: 'black',
                                padding: 7,
                                marginLeft: 5,
                                fontSize: 15,
                                backgroundColor: '#dbfc03',
                                borderRadius: 7,
                                maxWidth: '70%',
                              }}>
                              {message.message}
                              {'\n'}
                              <Text style={{fontSize: 10, color: 'grey'}}>
                                {this.convertTime(message.time)}
                              </Text>
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  );
                })
              : null}
          </ScrollView>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',

              borderWidth: 2,
              borderRadius: 20,
              backgroundColor: 'white',
              marginBottom: 10,
            }}>
            <TextInput
              onChangeText={text => this.setState({text: text})}
              value={this.state.text}
              placeholder="Type message"
              style={{width: width * 0.84, fontSize: 20}}
            />
            <TouchableOpacity onPress={this.send}>
              <Image
                source={require('../asset/send.png')}
                style={{height: 60, width: 60}}
              />
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // // backgroundColor: '#fffeee',
    // flexDirection: 'column',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    justifyContent: 'center',

    //alignItems: 'center',
  },
  sectionTitle: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  //--------------------------------------LOGIN-----------------------------------------------------
  sectionForm: {
    width: 360,
    height: 200,
    backgroundColor: 'rgba(255, 255,255,0.2)',
    borderRadius: 25,
    paddingHorizontal: 10,
    fontSize: 16,
    justifyContent: 'center',
    marginTop: 50,
    color: '#ffffff',
    marginVertical: 30,
    borderColor: 'white',
    borderWidth: 0.5,
  },
  sectionButton: {
    flex: 1,
    alignItems: 'center',
  },
  input: {
    backgroundColor: 'rgba(216,216,176,0.3)',
    color: 'rgba(25,21,60,1)',
    borderRadius: 10,
    fontSize: 20,
    borderColor: 'black',
    borderWidth: 0.5,
  },
  username: {
    marginTop: 0,
    fontWeight: '100',
  },
  password: {
    marginTop: 30,
    fontWeight: '100',
  },
  button: {
    width: 100,
    //backgroundColor: 'rgba(255, 255,255,0.2)',
    height: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fontLogin: {
    fontSize: 23,
    fontWeight: 'bold',
    color: 'white',
  },
  //---------------------SIGHUP----------------------------------------------------------------
  signupTextCont: {
    flexGrow: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingVertical: 16,
    flexDirection: 'row',
  },
  signupText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 16,
  },
  signupButton: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
});
