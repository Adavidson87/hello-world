import React from 'react';
import { View, Button, Platform, KeyboardAvoidingView, StyleSheet } from 'react-native';
import { Bubble, GiftedChat, InputToolbar } from 'react-native-gifted-chat'
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";
import { LogBox } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import MapView from 'react-native-maps';
import CustomActions from './CustomActions';

// disables warnings
LogBox.ignoreLogs(['Setting a timer', 'undefined']);
LogBox.ignoreLogs(['expo-permissions is now deprecated', 'undefined'])

// configures firebase
const firebaseConfig = {
  apiKey: "AIzaSyDFj2L28mx4QS8a2oJsfVlSu_LaX6-W8Es",
  authDomain: "testing-20055.firebaseapp.com",
  projectId: "testing-20055",
  storageBucket: "testing-20055.appspot.com",
  messagingSenderId: "43438124324",
  appId: "1:43438124324:web:412138291607f31e1997b1",
  measurementId: "G-NBM0LRBF9T"
}

export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uid: 0,
      user: {
        _id: '',
        name: '',
      },
      messages: [],
      isConected: false,
      image: null,
      location: null,
    };
    //starts firebase
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    //registers for updates
    this.referenceChatMessages = firebase.firestore().collection("messages");
    this.referenceMessageUser = null;
  }

  // Mounts system messages
  componentDidMount() {
    // imports username from start screen
    const { name } = this.props.route.params;

    // checks to see if online
    NetInfo.fetch().then(connection => {
      if (connection.isConnected) {
        console.log('online');
        this.setState({ isConnected: true });
        // authenticating user annonymously
        this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
          if (!user) {
            firebase.auth().signInAnonymously();
            user = {
              uid: 1,
              name: this.props.route.params.name
            }
          }
          this.setState({
            uid: user.uid,
            messages: [],
            user: {
              _id: user.uid,
              name: name,
            }
          });
          // refers to current useres messages
          this.referenceMessagesUser = firebase.firestore().collection('messages').where("uid", "==", this.state.uid)
          // listens to collection changes
          this.unsubscribe = this.referenceChatMessages.orderBy("createdAt", "desc").onSnapshot(this.onCollectionUpdate);
        });
      } else {
        console.log('offline');
        this.setState({ isConected: false });
        // gets messages stored offline
        this.getMessages();
      }
    });
  }

  // stops listening to authenciation and collection changes
  componentWillUnmount() {
    this.authUnsubscribe();
    this.unsubscribe();
  }

  // updates state with new messages with snapshot
  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      //get the QueryDocumentSnapshot's data
      var data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text || "",
        createdAt: data.createdAt.toDate(),
        user: data.user,
        image: data.image || null,
        location: data.location || null,
      });
    });
    this.setState({
      messages,
    })
  }

  // adds a new messages to database
  addMessage = () => {
    const message = this.state.messages[0];
    this.referenceChatMessages.add({
      uid: this.state.uid,
      _id: message._id,
      text: message.text || null,
      createdAt: message.createdAt,
      user: this.state.user,
      image: message.image || null,
      location: message.location || null,
    })
  }

  // sends messages to the chat
  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }),
      () => {
        this.addMessage();
        this.saveMessages();
      })
  }

  // gets messages from storage
  async getMessages() {
    let messages = '';
    try {
      messages = await AsyncStorage.getItem('messages') || [];
      this.setState({
        messages: JSON.parse(messages)
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  // saves messages to async storage
  async saveMessages() {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
    } catch (error) {
      console.log(error.message);
    }
  }

  // deletes messages
  async deleteMessages() {
    try {
      await AsyncStorage.removeItem('messages');
      this.setState({
        messages: []
      })
    } catch (error) {
      console.log(error.message);
    }
  }

  // renders the color of the chat bubbles
  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#000'
          },
          left: {
            backgroundColor: '#fff'
          }
        }}
      />
    )
  }

  // stops toolbar from being rneded when offline
  renderInputToolbar(props) {
    if (this.state.isConnected == true) {
      return (
        <InputToolbar
          {...props}
        />
      );
    }
  }

  // displays actionsheet
  renderCustomActions = (props) => {
    return <CustomActions {...props} />;
  };

  // renders custom map view
  renderCustomView(props) {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{ width: 150, height: 100, borderRadius: 13, margin: 3 }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  }

  render() {

    // variables
    const { name, bgColor } = this.props.route.params;
    this.props.navigation.setOptions({ title: name, backgroundColor: bgColor });

    return (

      // main container for the page
      <View style={[styles.container, { backgroundColor: bgColor }]}>

        {/* chatbox component */}
        <GiftedChat
          messages={this.state.messages}
          isConnected={this.state.isConnected}
          renderBubble={this.renderBubble.bind(this)}
          renderInputToolbar={this.renderInputToolbar.bind(this)}
          renderActions={this.renderCustomActions}
          renderCustomView={this.renderCustomView}
          onSend={messages => this.onSend(messages)}
          user={this.state.user} />

        {/* button to return to start page */}
        <Button title="Go to Start" onPress={() => this.props.navigation.navigate("Start")} />

        {/* keeps the keyboard from blocking the text input field on android devices */}
        {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
      </View>
    )
  }
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
  },
})