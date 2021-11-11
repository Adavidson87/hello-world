import React from 'react';
import { StyleSheet, Image, ImageBackground, View, Text, TouchableOpacity, TextInput } from 'react-native';
// import { TextInput } from 'react-native-gesture-handler';

export default class Start extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      bgColor: "#fff",
    };
  }

  render() {
    return (
      /* Adds background image */
      <ImageBackground source={require("../assets/Background-Image.png")} resizeMode="cover" style={styles.bgImg}>

        {/* Primary container on start screen */}
        <View style={styles.container}>

          {/* Page title */}
          <Text style={styles.title}>Hello-World!</Text>
          <Image source={require("../assets/icon.png")} />

          <View style={styles.secondaryContainer}>

            {/* Allows you to put your name in */}
            <TextInput style={styles.txtInput}
              onChangeText={(name) => this.setState({ name })}
              value={this.state.name}
              placeholder="Type name here..." />

            {/* Background Color Picker */}
            <View style={styles.colorPicker}>
              <Text style={styles.colorText}>Choose your background color</Text>
              <View style={styles.colors}>

                <TouchableOpacity style={styles.color1} onPress={() => this.setState({ bgColor: "#090208" })}></TouchableOpacity>

                <TouchableOpacity style={styles.color2} onPress={() => this.setState({ bgColor: "#474056" })}></TouchableOpacity>

                <TouchableOpacity style={styles.color3} onPress={() => this.setState({ bgColor: "#8a95a5" })}></TouchableOpacity>                

                <TouchableOpacity style={styles.color4} onPress={() => this.setState({ bgColor: "#b9c6ae" })}></TouchableOpacity>                

              </View>
            </View>


            {/* Allows you to go to the chat screen */}
            <TouchableOpacity style={styles.button}
              title="Go to Chat"
              onPress={() => this.props.navigation.navigate('Chat', {
                name: this.state.name,
                bgColor: this.state.bgColor
              })}>
              <Text style={styles.btnText}>Go to Chat</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ImageBackground >
    )
  }
}

const styles = StyleSheet.create({
  bgImg: {
    width: "100%",
    height: "100%",
    flex: 1,
  },

  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  title: {
    fontSize: 45,
    fontWeight: "600",
    letterSpacing: 2,
    color: "#fff",
    position: "absolute",
    top: 35,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
    textShadowColor: "#000",
  },

  secondaryContainer: {
    width: "88%",
    height: "44%",
    minHeight: 240,
    maxHeight: 270,
    alignItems: "center",
    padding: 25,
    borderRadius: 20,
    borderRadius: 20,
    borderColor: "black",
    borderWidth: 2,
    backgroundColor: "lightslategrey",
    opacity: 0.7,
    bottom: 20,
    position: "absolute",
  },

  txtInput: {
    width: "88%",
    height: 40,
    borderColor: "black",
    borderWidth: 2,
    borderRadius: 10,
    backgroundColor: "white",
    textAlign: "center",
  },

  colorText: {
    fontSize: 16,
    fontWeight: "300",
    color: "black",
    textAlign: "center",
  },

  colorPicker: {
    flex: 1,
    padding: 30,
  },

  colors: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  color1: {
    width: 40,
    height: 40,
    backgroundColor: "#090208",
    borderRadius: 40,
    borderWidth: 2,
  },

  color2: {
    width: 40,
    height: 40,
    backgroundColor: "#474056",
    borderRadius: 40,
    borderWidth: 2,
  },

  color3: {
    width: 40,
    height: 40,
    backgroundColor: "#8a95a5",
    borderRadius: 40,
    borderWidth: 2,
  },

  color4: {
    width: 40,
    height: 40,
    backgroundColor: "#b9c6ae",
    borderRadius: 40,
    borderWidth: 2,
  },

  button: {
    backgroundColor: "darkslategrey",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    width: "88%",
    height: 40,
    borderRadius: 5,
    borderColor: "black",
    borderWidth: 2,
  },

  btnText: {
    fontSize: 16,
    fontWeight: 600,
    textAlign: "center",
    color: "#fff",
    textTransform: "uppercase",
    fontWeight: "bold",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
    textShadowColor: "#000",
  }
})