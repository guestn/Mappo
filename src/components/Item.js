import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View
} from 'react-native'

export default class Item extends Component {
  constructor(props) {
    super(props)

    this.state = {

    }
  }

  render() {
    const wrapperStyles = {
      backgroundColor: '#00AA00',
    }
    return (
	    
        <View ref="wrapper" collapsable={false}>
            <View style={styles.row}>
              <Text style={styles.text}>
              {this.props.data.obj.latitude},{this.props.data.obj.altitude}, {this.props.data.obj.time}
              </Text>
              <Text onPress={() => this.props.onRemove()}>X</Text>
            </View>
            <View style={styles.separator} />
        </View>
    )
  }
}

const styles = StyleSheet.create({
  row: {
	flexDirection: 'row',
	alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: 5,
    backgroundColor: '#FFFFFF',
    flex: 1
  },
  separator: {
    height: 1,
    backgroundColor: '#CCCCCC'
  },
  text: {
    //flex: 1,
    fontSize: 10
  }
})
