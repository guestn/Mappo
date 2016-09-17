'use strict';

import React, { Component } from 'react';

const ReactNative = require('react-native');
import {
  AlertIOS,
  Navigator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';

//import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
//const Homepage = require('./Homepage');
const s = require('../styles/styles');


//const myIcon = (<Icon name="rocket" size={30} color="#900" />)

class UnitsPage extends Component {
s	
	render() {
		return (
			<View>
				<Text>UnitsPage</Text>
				<Text>{this.props.name}</Text>
				<TouchableHighlight onPress={ () => this.props.navigator.pop()}>
					<Text>BACK</Text>
				</TouchableHighlight>
			</View>
		)
	}
};



module.exports = UnitsPage;


