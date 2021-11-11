import React from 'react';
import { View, Button } from 'react-native';


export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      bgColor: "",
    };
  }
  render() {
    const { name, bgColor } = this.props.route.params;
    this.props.navigation.setOptions({ title: name, backgroundColor: bgColor });
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: bgColor }}>
        <Button title="Go to Start" onPress={() => this.props.navigation.navigate("Start")} />
      </View>
    )
  }
}