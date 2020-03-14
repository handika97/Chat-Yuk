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
const isIOS = Platform.OS === 'ios';
export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      person: this.props.route.params.name,
      text: '',
      messageList: [],
    };
    this.keyboardHeight = new Animated.Value(0);
    this.bottomPadding = new Animated.Value(60);
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
    }
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
    this.keyboardShowListener = Keyboard.addListener(
      isIOS ? 'keyboardWillShow' : 'keyboardDidShow',
      e => this.keyboardEvent(e, true),
    );
    this.keyboardHideListener = Keyboard.addListener(
      isIOS ? 'keyboardWillHide' : 'keyboardDidHide',
      e => this.keyboardEvent(e, false),
    );
  }
  componentWillUnmount() {
    this.keyboardShowListener.remove();
    this.keyboardHideListener.remove();
  }
  keyboardEvent = (e, isShow) => {
    let heightOS = isIOS ? 60 : 0;
    let bottomOS = isIOS ? 120 : 60;
    Animated.parallel([
      Animated.timing(this.keyboardHeight, {
        duration: e.duration,
        toValue: isShow ? heightOS : 0,
      }),
      Animated.timing(this.bottomPadding, {
        duration: e.duration,
        toValue: isShow ? bottomOS : 60,
      }),
    ]).start();
  };

  render() {
    let {height, width} = Dimensions.get('window');
    console.log('yes', this.props.route.params);
    return (
      <SafeAreaView>
        <View
          style={{
            height: 70,
            width: '100%',
            backgroundColor: '#FF6870',
            flexDirection: 'row',
            alignContent: 'center',
            justifyContent: 'center',
            position: 'absolute',
            zIndex: 20,
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
            <Text style={{fontSize: 20, color: 'white', marginTop: 20}}>
              {this.props.route.params.user2.name}
            </Text>
          </View>
        </View>
        <KeyboardAwareScrollView
          resetScrollToCoords={{x: 0, y: 0}}
          scrollEnabled={false}>
          <ScrollView
            style={{
              height: height * 0.75,
              padding: 8,
              marginTop: height * 0.12,
            }}
            ref={ref => (this.flatList = ref)}
            onContentSizeChange={() =>
              this.flatList.scrollToEnd({animated: true})
            }>
            {this.state.messageList.length !== 0
              ? this.state.messageList.map(message => {
                  return (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignSelf:
                          message.from === this.props.route.params.user.name
                            ? 'flex-end'
                            : 'flex-start',
                        backgroundColor: 'white',
                        borderRadius: 7,
                        marginBottom: 10,
                      }}>
                      <Text style={{color: 'black', padding: 7, fontSize: 25}}>
                        {message.message}
                      </Text>
                    </View>
                  );
                })
              : null}
          </ScrollView>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 0,
              borderWidth: 2,
              borderRadius: 20,
              backgroundColor: 'white',
            }}>
            <TextInput
              onChangeText={text => this.setState({text: text})}
              placeholder="Type message"
              style={{width: width * 0.84, fontSize: 20}}
            />
            <TouchableOpacity onPress={this.send}>
              <Image
                source={require('../asset/send.png')}
                style={{height: 50, width: 50}}
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
