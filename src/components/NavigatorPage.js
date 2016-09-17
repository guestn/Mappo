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
import Icon from 'react-native-vector-icons/EvilIcons'
//const Homepage = require('./Homepage');
import UnitsPage from './UnitsPage'
import s from '../styles/styles'


//const myIcon = (<Icon name="rocket" size={30} color="#900" />)

class NavigatorPage extends Component {
	
	navigate(name) {
  		this.props.navigator.push({
    		component: name.component,
			passProps: {
				name: name.title
			}
		})
	}
	render() {
		return (
			<View>
				<View style={s.menuBar}>
					<Icon name='chevron-left' style={s.menuBarIcon} size={50} onPress={ () => this.props.navigator.pop()}/>

					<Text style={[s.txt15, s.txtWhite]}>{this.props.name}</Text>
					<Icon name='close' style={s.menuBarIcon} size={40} onPress={ () => this.props.navigator.popToTop()}/>

				</View>
				<TouchableHighlight onPress={ () => this.props.navigator.pop()}>
					<Text>BACK</Text>
				</TouchableHighlight>
				<TouchableHighlight onPress={ () => this.navigate({component:UnitsPage, title:'Units Page'})}>
					<Text>Units</Text>
				</TouchableHighlight>
			</View>
		)
	}
};

module.exports = NavigatorPage;