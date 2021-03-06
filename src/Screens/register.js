import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Image,
} from 'react-native';
import app from '../config/firebase';
import * as firebase from 'firebase';
import {AuthContext} from '../context/auth';
import AsyncStorage from '@react-native-community/async-storage';
const db = app.firestore();
export default class login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      password: '',
      login: '',
      token: '',
      userData: [],
    };
  }
  onSubmitButton = async () => {
    await firebase
      .auth()
      //   .signInWithEmailAndPassword(this.state.email, this.state.password)
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(res => {
        console.log(res.user.uid);
        // app.firestore();
        // db.collection('Users')
        //   .doc()
        //   .set({
        //     name: `${this.state.name}`,
        //     email: `${this.state.email}`,
        //     password: `${this.state.password}`,
        //   });
        let email = this.state.email;
        firebase
          .database()
          .ref('users/' + res.user.uid)
          .set({
            password: this.state.password,
            email: this.state.email,
            name: `${this.state.name}`,
            uid: res.user.uid,
          });
        firebase
          .database()
          .ref('friends/' + res.user.uid)
          .set([
            {
              password: this.state.password,
              email: this.state.email,
              name: `${this.state.name}`,
              uid: res.user.uid,
            },
          ]);
        firebase
          .database()
          .ref('location/' + res.user.uid)
          .set({
            latitude: 0,
            longitude: 0,
          });
        this.props.navigation.navigate('friends', {
          email: this.state.email,
          name: this.state.name,
          uid: res.user.uid,
        });
        const _storeData = async () => {
          try {
            await AsyncStorage.setItem('email', `${this.state.email}`);
            await AsyncStorage.setItem('uid', `${res.user.uid}`);
          } catch (e) {
            e;
          }
        };

        _storeData();
      })
      .catch();
  };

  render() {
    return (
      <View style={styles.container}>
        <ImageBackground
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            position: 'relative',
            resizeMode: 'center',
            flex: 1,
            width: null,
            height: null,
            justifyContent: 'center',
          }}
          blurType="light"
          //blurAmount={2}
          blurRadius={0.5}
          source={{
            uri: 'https://i.dlpng.com/static/png/6845041_preview.png',
          }}>
          <View style={styles.sectionTitle}>
            <Image source={require('../asset/logo.png')} />
          </View>
          <View style={styles.sectionForm}>
            <TextInput
              style={[styles.input, styles.username]}
              placeholder="Your Name"
              selectionColor="#428AF8"
              name="name"
              value={this.state.name}
              onChangeText={text => this.setState({name: text})}
            />
            <TextInput
              style={[styles.input, styles.username]}
              placeholder="Email"
              selectionColor="#428AF8"
              name="name"
              value={this.state.email}
              onChangeText={text => this.setState({email: text})}
            />
            <TextInput
              style={[styles.input, styles.username]}
              placeholder="Password"
              secureTextEntry={true}
              // password={true}
              // type="password"
              // name="password"
              onChangeText={text => this.setState({password: text})}
            />
          </View>
          {this.state.email.length >= 5 && this.state.password.length >= 5 ? (
            <View style={styles.sectionButton}>
              <TouchableOpacity
                onPress={() => {
                  this.onSubmitButton();
                }}>
                <View style={styles.button}>
                  <Text style={styles.fontLogin}>Register</Text>
                </View>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.sectionButton}>
              <TouchableOpacity disabled>
                <View style={styles.button}>
                  <Text style={styles.fontLogin}>Register</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}

          {/* <View style={styles.signupTextCont}>
            <Text style={styles.signupText}>Already have an account?</Text>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Register')}>
              <Text style={styles.signupButton}> Sign up</Text>
            </TouchableOpacity>
          </View> */}
        </ImageBackground>
      </View>
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
    marginTop: 0,
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
    borderWidth: 1,
  },
  username: {
    marginTop: 0,
    fontWeight: '100',
    padding: 10,
    marginBottom: 10,
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
