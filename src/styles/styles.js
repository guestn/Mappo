/**
 * Global Stylesheet
*/

'use strict';
import React, { Component } from 'react';
const ReactNative = require('react-native');

import {
  StyleSheet,
} from 'react-native';

const HL_COLOR = '#FF4625',
	 SHDW_DIMS =  {
		   height: 1,
		   width: 0
    }


const s = StyleSheet.create({
	
	
	test: {
		backgroundColor:'red',
		position:'absolute',
		top: 150,
		left: 10,
		padding:20,
		zIndex:500
	},
	
	container: {
		flex: 2,
		marginTop: 0,
		backgroundColor: 'transparent',
		//padding: 10,
		//paddingTop: 0,
	},
	linearGradient: {
		position:'relative',
		flex: 1,
	},
	itemWrapper: {
		//backgroundColor: 'white',
	},
	navButton: {
		top: 10,
		left: 10,
		//width: 46,
		//backgroundColor: 'rgba(255,255,255,0.5)',
	},
	group: {
		position: 'absolute',
		top: 0,
		left: 0,
		zIndex: 10
	},
	mapView: {
		position:'absolute',
		//height: 668, 
		//width: 375,
		marginTop: 0
	},
	icon: {
		color: 'white',
		backgroundColor: HL_COLOR,
		shadowColor: "#000000",
		shadowOpacity: 0.4,
		shadowRadius: 5,
		shadowOffset: SHDW_DIMS
	},
	list: {
		position:'relative',
		flex: 1,
	},
	// infoBlocks
	infoBlockT: {
		position:'absolute',
		padding: 10,
		top: 0,
		borderWidth:1,
		flexDirection:'row',
		justifyContent: 'space-between',
	},
	
	infoBlockB: {
		position:'absolute',
		padding: 10,
		bottom: 0,
		borderWidth:1,
		flexDirection:'row',
		justifyContent: 'space-between',
	},
	infoBlockBR: {
		position:'relative',
		flexDirection:'row',
		//top: height - 50,
		paddingTop: 10,
		paddingBottom: 10,
		alignSelf: 'flex-end',
	},
	infoBlockBL: {
		position:'relative',
		flexDirection:'row',
		paddingTop: 10,
		paddingBottom: 10,

	},
		infoBoxElement: {
			alignItems: 'center',
			paddingLeft: 10,
			paddingRight: 10,
			borderRightColor: 'white',
			borderRightWidth: 2,
			height:40,
		},
		infoBoxElementR: {
			borderRightWidth: 0,
		},
		compass: {
			color: 'white',
			padding: 0,
			//borderWidth: 1,
			width:70,
			marginTop: -13,
			paddingTop: 6,
			backgroundColor:'transparent',

		},

	// settings pages
	
	menuBar: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		backgroundColor: '#aaa',
		alignItems: 'center',
	},
		menuBarIcon: {
			color: 'white',
			backgroundColor: 'transparent',

		},

	// general
	paddingZero: {
		paddingLeft: 0,
		paddingRight: 0
	},
	shadow: {
		shadowColor: "#000000",
		shadowOpacity: 0.4,
		shadowRadius: 5,
		shadowOffset: SHDW_DIMS
	},
	
	// text
	txt20: {
		fontSize: 30,
		//fontFamily: 'Orkney-Regular',
		lineHeight: 30,
		backgroundColor:'transparent',
	},
	txt15: {
		fontSize: 20,
		//fontFamily: 'Orkney-Regular',		
	},
	txt10: {
		//fontFamily: 'Orkney-Regular'
	},
	txtWhite: {
		color: 'white'	
	},
	txtHilite: {
		color: HL_COLOR,
	},
	
	// backgrounds
	bgHilite: {
		backgroundColor: HL_COLOR,
	},
	bgTransparent: {
		backgroundColor: 'transparent',
	},
	moreIndic: {
		position:'absolute',
		top: 0,
		right: 0,
		width: 10,
		height: 10,
		backgroundColor:'rgba(255,255,255,0.8)'
	}
});

module.exports = s;