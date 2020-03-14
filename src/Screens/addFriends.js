import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Alert,
  Image,
  BackHandler,
  Dimensions,
} from 'react-native';
import app from '../config/firebase';
import * as firebase from 'firebase';
import 'firebase/firestore';
const db = app.firestore();
import {ScrollView} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
//import {styles} from '../components/ListDataComp';

export default class friends extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      friends: [],
      friendss: [],
      idUser_2: '',
      name: '',
    };
  }

  addFriends = () => {
    let dbRef = firebase
      .database()
      .ref('friends')
      .child(`${this.props.route.params.uid}`);
    dbRef.on('child_added', value => {
      let person = value.val();

      //person.email = val.key;
      if (person.uid === this.props.route.params.uid) {
      } else {
        this.setState(prevState => {
          return {
            friendss: [...prevState.friendss, person.uid],
          };
        });
      }
    });
  };

  addFriendsss = id => {
    if (
      this.state.friendss
        .map(function(obj) {
          return obj;
        })
        .indexOf(id.uid) === -1
    ) {
      console.log('yeash', id);
      console.log('yeh', this.state.friendss);
      let msgId = firebase
        .database()
        .ref('friends')
        .child(`${this.props.route.params.uid}`)
        .child(`${id.uid}`)
        .push().key;
      let updates = {};
      let friends = {
        name: id.name,
        email: id.email,
        uid: id.uid,
      };
      let friendss = {
        name: this.props.route.params.name,
        email: this.props.route.params.email,
        uid: this.props.route.params.uid,
      };
      updates['friends/' + this.props.route.params.uid + '/' + msgId] = friends;
      updates['friends/' + id.uid + '/' + msgId] = friendss;
      firebase
        .database()
        .ref()
        .update(updates);
    } else {
      Alert.alert('Teman Sudah Di Tambahkan');
    }
  };
  //-------------------------------------------------
  // if (person.name === id.name) {
  //   Alert.alert('Teman Sudah Di Tambahkan');
  // } else {
  // let msgId = firebase
  //   .database()
  //   .ref('friends')
  //   .child(`${this.props.route.params.name}`)
  //   .push().key;
  // let updates = {};
  // let friends = {
  //   name: id.name,
  //   email: id.email,
  // };
  // updates[
  //   'friends/' + this.props.route.params.name + '/' + msgId
  // ] = friends;
  // firebase
  //   .database()
  //   .ref()
  //   .update(updates);
  //       Alert.alert('add friends');
  //     }
  //   });
  // };
  componentWillUnmount() {
    // BackHandler.addEventListener('hardwareBackPress', function() {
    //   return false;
    // });
  }
  UNSAFE_componentWillMount() {
    // BackHandler.addEventListener('hardwareBackPress', function() {
    //   return true;
    // });
    let dbRef = firebase.database().ref('users');
    dbRef.on('child_added', val => {
      let person = val.val();
      //person.email = val.key;

      if (person.uid === this.props.route.params.uid) {
      } else {
        this.setState(prevState => {
          return {
            friends: [...prevState.friends, person],
          };
        });
      }
    });
  }
  componentDidMount() {
    this.addFriends();
  }

  render() {
    let {height, width} = Dimensions.get('window');
    console.log('ku', this.props);

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
            style={{height: 50, width: 50, marginLeft: width * -0.15}}
            onPress={() => this.props.navigation.navigate('friends')}>
            <Image
              source={require('../asset/back.png')}
              style={{marginTop: 10, height: 50, width: 50}}
            />
          </TouchableOpacity>
          <View style={{width: 200, height: 100, marginLeft: width * 0.1}}>
            <Text style={{fontSize: 20, color: 'white', marginTop: 10}}>
              Add Your Friends
            </Text>
          </View>
        </View>
        <ScrollView>
          {this.state.friends.length !== 0
            ? this.state.friends.map(friends => {
                return (
                  <View
                    style={{
                      height: 100,
                      width: '100%',
                      borderBottomWidth: 1,
                      borderBottomColor: '#3bb0ba',
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
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
                          uri: `${friends.avatar}`,
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
                    <View style={{width: width * 0.5}}>
                      <Text style={{fontSize: 20, marginLeft: 20}}>
                        {friends.name}
                      </Text>
                    </View>
                    {this.state.friendss
                      .map(function(obj) {
                        return obj;
                      })
                      .indexOf(friends.uid) === -1 ? (
                      <View>
                        <TouchableOpacity
                          onPress={
                            () => this.addFriendsss(friends)
                            // this.props.navigation.navigate('Home', friends)
                          }>
                          <Image
                            source={require('../asset/add.png')}
                            style={{
                              height: 50,
                              width: 50,
                              marginLeft: width * 0.1,
                            }}
                          />
                        </TouchableOpacity>
                      </View>
                    ) : null}
                    {/* <View>
                      <TouchableOpacity
                        onPress={
                          () => this.addFriendsss(friends)
                          // this.props.navigation.navigate('Home', friends)
                        }>
                        <Image
                          source={require('../asset/add.png')}
                          style={{
                            height: 50,
                            width: 50,
                            marginLeft: width * 0.1,
                          }}
                        />
                      </TouchableOpacity>
                    </View> */}
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
