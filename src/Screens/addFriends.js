import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  Dimensions,
} from 'react-native';
import app from '../config/firebase';
import * as firebase from 'firebase';
import 'firebase/firestore';
import {ScrollView} from 'react-native-gesture-handler';

let {height, width} = Dimensions.get('window');
export default class friends extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      friends: [],
      friendss: [],
      idUser_2: '',
      name: '',
      keyword: '',
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

  componentWillUnmount() {
    // BackHandler.addEventListener('hardwareBackPress', function() {
    //   return false;
    // });
  }
  UNSAFE_componentWillMount() {
    // BackHandler.addEventListener('hardwareBackPress', function() {
    //   return true;
    // });
    this.getFriends();
  }
  getFriends = () => {
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
  };
  componentDidMount() {
    this.addFriends();
  }

  render() {
    let keyword = this.state.friends.filter(
      friends =>
        friends.name.toLowerCase().indexOf(this.state.keyword.toLowerCase()) ===
        0,
    );
    return (
      <View style={styles.container}>
        <View
          style={{
            height: 70,
            width: '100%',
            backgroundColor: 'white',
            flexDirection: 'row',
            alignContent: 'center',
            justifyContent: 'center',
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
            style={{height: 50, width: 50, marginLeft: width * -0.15}}
            onPress={() => this.props.navigation.navigate('friends')}>
            <Image
              source={require('../asset/back.png')}
              style={{marginTop: 10, height: 50, width: 50}}
            />
          </TouchableOpacity>
          <View
            style={{
              display: 'flex',

              alignItems: 'flex-start',
            }}>
            <TextInput
              onChangeText={text => this.setState({keyword: text})}
              style={{
                fontSize: 20,
                width: 200,
                height: 50,
                marginLeft: width * 0.1,
                borderBottomWidth: 2,
              }}
              placeholder="Search Friends"
              onKeyUp={this.getFriends}
            />
          </View>
        </View>
        <ScrollView>
          {this.state.keyword.length !== 0
            ? keyword.map(friends => {
                return (
                  <View
                    style={{
                      height: 100,
                      width: '100%',
                      marginTop: 10,
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
