/**
 * renders Router component
*/

'use strict';
import React, { Component } from 'react';
//const ReactNative = require('react-native');
import ReactNative from 'react-native'


import {
	Navigator,
	ScrollView,
	StyleSheet,
	Text,
	NetInfo,
	TouchableHighlight,
	DeviceEventEmitter,
	View,
	Dimensions,
	MapView,
	ListView
} from 'react-native';

//import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/EvilIcons';
const NativeModules = ReactNative.NativeModules;
const { RNLocation } = require('NativeModules');
import config from '../../config'
import Item from './Item'
import NavigatorPage from './NavigatorPage'
import s from '../styles/styles'

import { initializeApp } from 'firebase'
const firebaseApp = initializeApp({
  apiKey: config.API_KEY,
  authDomain: config.AUTH_DOMAIN,
  databaseURL: config.DATABASE_URL,
  storageBucket: config.STORAGE_BUCKET
})


const itemsRef = firebaseApp.database().ref('items')
const archivesRef = firebaseApp.database().ref('archive')
const connectedRef = firebaseApp.database().ref('.info/connected')

//const myIcon = (<Icon name="rocket" size={30} color="#900" />)

const {height, width} = Dimensions.get('window')

class Router extends Component {
	constructor(props) {
    	super(props);
    }

    configureScene(route, routeStack){
		return Navigator.SceneConfigs.FloatFromRight
	}

	renderScene(route, navigator) {
		//console.log(this.props);
    	return React.createElement(
    		route.component,
    		{ ...this.props, ...route.passProps, route, navigator }
    	)

    	//return <route.component navigator={navigator} {...route.passProps} />
	}


  	render() {
	    return (
			<Navigator
			configureScene={ this.configureScene }
			style={{ flex:1 }}
			initialRoute={{ component: Groceries }}
			renderScene={ this.renderScene }
			props={this.props} />

	    )
  	}
};

export default class Groceries extends Component {
	constructor(props) {
		super(props)

		this.state = {
			newItem: ''
		}
	}

	componentWillMount() {
		//console.log(this.props);
    	this.dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})

		this.props.loadOfflineItems()

		itemsRef.on('child_added', (snapshot) => {
			this.props.addItem(snapshot.val())
		})

		itemsRef.on('child_removed', (snapshot) => {
			this.props.removeItem(snapshot.val().id)
		})

		if (NetInfo) {
			NetInfo.isConnected.fetch().done(isConnected => {
				if (isConnected) {
					this.props.checkConnection()
				} else {
					this.props.goOffline()
				}
			})
		} else {
			this.props.checkConnection()
		}

		connectedRef.on('value', snap => {
			if (snap.val() === true) {
				this.props.goOnline()
      		} else {
	  			this.props.goOffline()
      		}
    	})
	}

	renderRow(rowData) {
    //console.log(this.props.connected)
    	return (
		<Item {...this.props} data={rowData}
            onRemove={() => this._remove(rowData.id)} />
		)
	}


	_remove(id) {
		itemsRef.child(id).remove()
	}


	render() {
    	//console.log('PROPS!')
		//console.log(this.props)

		let items, readonlyMessage
		if (this.props.connected) {
			items = this.props.onlineItems
			readonlyMessage = <Text style={styles.offline}>Online</Text>
		} else if (this.props.connectionChecked) {
			items = this.props.offlineItems
			readonlyMessage = <Text style={styles.offline}>Offline</Text>
		} else {
			items = []
			readonlyMessage = <Text style={styles.offline}>Loading...</Text>
		}

		return (
			<View style={styles.container}>
			<Text style={{position:'absolute',zIndex:4}}>{readonlyMessage}</Text>

				<ListView style={{position:'absolute',top:150,left:10,zIndex:10}}
					dataSource={this.dataSource.cloneWithRows(items)}
					enableEmptySections={true}
					renderRow={this.renderRow.bind(this)}
				/>
				<PositionManager {...this.props}/>
			</View>
		)
  	}
}

// location

RNLocation.requestAlwaysAuthorization();
RNLocation.startUpdatingLocation();
RNLocation.setDistanceFilter(5.0);

function UnixFormat(unix) {
	var theTime = new Date(unix);
	var hours = '0' + theTime.getHours(); 	// Hours part from the timestamp
	var minutes = '0' + theTime.getMinutes(); 	// Minutes part from the timestamp
	var seconds = '0' + theTime.getSeconds();
	var time = hours.substr(-2) + ':' + minutes.substr(-2) + ':'+ seconds.substr(-2);
	return time;
}

function leftPad(number, targetLength) {
    var output = number + '';
    while (output.length < targetLength) {
        output = '0' + output;
    }
    return output;
}


class PositionManager extends Component {
	constructor(props) {
		super(props)

		this.state = {
			longitude: 0,
			latitude: 0,
			altitude: 0,
			speed: 0,
			course: 0,
			gyro: true,
			tracklogArr: [{latitude:0,longitude:0}]
		}
	    this.handleStart = this.handleStart.bind(this);
	    this.handleStop = this.handleStop.bind(this);
	    this._add = this._add.bind(this);
			this._get = this._get.bind(this);
			this._archive = this._archive.bind(this);
2
	}


	componentDidMount(props) {


		RNLocation.requestAlwaysAuthorization();
		RNLocation.startUpdatingLocation();
		RNLocation.setDistanceFilter(5.0);

		var location = [];

		DeviceEventEmitter.addListener('locationUpdated', function (data) {
	        // Example location returned
	        //{
	          //coords: {
	            //speed: -1,
	            //longitude: -0.1337,
	            //latitude: 51.50998,
	            //accuracy: 5,
	            //heading: -1,
	            //altitude: 0,
	            //altitudeAccuracy: -1
	          //},
	         // timestamp: 1446007304457.029
	        //}

	        location[0] = data;

	        console.log('LOCATION!!!:' + location[0].coords.latitude);
	        this.setState({
	        	longitude: parseFloat(location[0].coords.longitude.toFixed(4)),
						latitude: parseFloat(location[0].coords.latitude.toFixed(6)),
						altitude: parseFloat(location[0].coords.altitude.toFixed(1)),
						speed: parseFloat(location[0].coords.speed.toFixed(1)),
						course: parseFloat(location[0].coords.course.toFixed(1)),
						time: UnixFormat(location[0].timestamp)
					})

			if (this.state.live) {
				this._add(this.state)
			}

		}.bind(this))

		//now get the current tracklog
		this._get();
	}

	componentDidUpdate() {
	  	//console.log('updated!!');
	  //setInterval(()=> { this._add(this.state) },5000);

	}

	handleStart() {
		console.log('START')
		RNLocation.startUpdatingLocation();
		this.setState({
			gyro: true,
			live: true
		});
	}

	handleStop(props) {
		console.log('STOP')

		//RNLocation.stopUpdatingLocation();
		this.setState({
			gyro: false,
			live: false
		});
		//console.log('POSNstate!')
		////console.log(this.state)

	}

	_add(posn) {
		const id = Math.random().toString(36).substring(7)
		const itemRef = itemsRef.child(id)

		itemRef.set({
			id,
			obj: posn,
			time: new Date().getTime()
		})

		this.setState({newItem: ''})
	}
	_get() {
		itemsRef.on("value", (snapshot) => {
			console.log(snapshot.val());

			var route = [];
			var tracklog = snapshot.val()

			for (var i in tracklog) {
				var point = [];
				var point = [tracklog[i].obj.longitude, tracklog[i].obj.latitude, tracklog[i].time]
				route.push(point);
			}
			route = route.sort()
			console.log(route);

			var coordForMap = []
			for (var i in route) {
				coordForMap[i] = {latitude:route[i][1], longitude: route[i][0] }
			}

			this.setState({tracklogArr: coordForMap})

		}, function (errorObject) {
			console.log("The read failed: " + errorObject.code);
		});
	}

	_archive() {
		const id = Math.random().toString(36).substring(7)
		const archiveRef = archivesRef.child(id)
		const tracklog = null;

		itemsRef.on("value", (snapshot) => {
			var tracklog = snapshot.val()
			archiveRef.set({
				id,
				route: tracklog,
				time: new Date().getTime()
			})
		})



		this.setState({newItem: ''})
	
	}

	navigate(name) {
  		this.props.navigator.push({
    		component: name,
			passProps: {
				name: 'Navigator Page'
			}
		})
	}

	render() {
		return (
		<View style={{
			flex: 1,
			justifyContent: 'center',
			alignItems: 'center'
		}}>
			<MapView
				style={{'width':width, 'height':height,position:'absolute',bottom:0,left:0}}
				region={{latitude: this.state.tracklogArr[0].latitude, longitude: this.state.tracklogArr[0].longitude, latitudeDelta: 0.15, longitudeDelta: 0.15}}
				showsUserLocation={false}
				followUserLocation={false}
		        overlays={[{
		          coordinates: this.state.tracklogArr,
		          strokeColor: '#f007',
		          lineWidth:6
		        }]}
		        annotations={[{
					latitude: this.state.tracklogArr[0].latitude, longitude: this.state.tracklogArr[0].longitude,
					title:'Start',
          		}]}
			/>
			<View style={{position:'absolute',top: 100,right:10, backgroundColor:'white'}}>
				<TouchableHighlight onPress={() => this._add(this.state)}>
					<Text>SAVE</Text>
				</TouchableHighlight>
				<Text style={styles.text}>latitude: {this.state.latitude}</Text>
				<Text style={styles.text}>longitude: {this.state.longitude}</Text>
				<Text style={styles.text}>altitude: {this.state.altitude}</Text>
				<Text style={styles.text}>speed: {this.state.speed}</Text>
				<Text style={styles.text}>course: {this.state.course}</Text>
				<Text>updated: {this.state.time}</Text>



			{
				this.state.live ?
					<TouchableHighlight  onPress={this.handleStop}><Text style={{color:'red'}}>Stop</Text></TouchableHighlight> :
 					<TouchableHighlight  onPress={this.handleStart}><Text  style={{color:'red'}}>Start</Text></TouchableHighlight>
			}
			<TouchableHighlight onPress={() => this._archive()}>
				<Text>ARCHIVE</Text>
			</TouchableHighlight>
			</View>

			<HomepageInfoBlockT {...this.props} posn={this.state}/>
			<HomepageInfoBlockB  {...this.props} posn={this.state}/>
		</View>
		)
	}

}

/*
					region={{latitude: this.state.latitude+0, longitude: this.state.longitude+0, latitudeDelta: 0.15, longitudeDelta: 0.15}}

 overlays={[{
		          coordinates:[

				  	{latitude: 37.785, longitude: -122.3035},
				  	{latitude: 37.755, longitude: -122.302},
		            {latitude: 37.745, longitude: -122.310},
		            {latitude: this.state.latitude, longitude: this.state.longitude},
		          ],
		          strokeColor: '#f007',
		          lineWidth:6
		        }]}
*/

class HomepageInfoBlockT extends Component {
	navigate(name) {
  		this.props.navigator.push({
    		component: name,
			passProps: {
				name: 'Navigator Page'
			}
		})
	}


	render() {
		return (
			<View style={s.infoBlockT} width={width}>
				<View style={[s.infoBlockBL, s.bgTransparent]}>
					<View style={[s.infoBoxElement, s.infoBoxElementR]}>
						<Icon name='gear' style={s.icon} size={50}/>
					</View>
					<MoreIndic/>
				</View>

				<View style={[s.infoBlockBR, s.bgTransparent]}>

					<View style={s.infoBoxElement}>
						<Text style={[s.txtHilite, s.txt10]}>alt</Text>
						<Text style={[s.txtHilite, s.txt20]}>14530</Text>
					</View>
					<TouchableHighlight style={[s.infoBoxElement, s.infoBoxElementR, s.paddingZero]} onPress={ ()=> this.navigate(NavigatorPage)}>
						<Icon name='gear' style={s.compass} size={70}/>
					</TouchableHighlight>
				</View>
			</View>
		)
	}
}


class HomepageInfoBlockB extends Component {

	render() {
		return (
			<View style={s.infoBlockB} width={width}>
				<View style={[s.infoBlockBL, s.bgHilite, s.shadow]}>
					<View style={[s.infoBoxElement, s.infoBoxElementR]}>
						<Text style={[s.txtWhite, s.txt10]}>home</Text>
						<Text style={[s.txtWhite, s.txt20]}>50.2</Text>
					</View>
					<MoreIndic/>
				</View>

				<View style={[s.infoBlockBR, s.bgHilite, s.shadow]}>
					<View style={s.infoBoxElement}>
						<Text style={[s.txtWhite, s.txt10]}>speed</Text>
						<Text style={[s.txtWhite, s.txt20]}>{this.props.posn.speed}</Text>
					</View>
					<View style={s.infoBoxElement}>
						<Text style={[s.txtWhite, s.txt10]}>alt</Text>
						<Text style={[s.txtWhite, s.txt20]}>{leftPad(this.props.posn.altitude,4)}</Text>
					</View>
					<View style={[s.infoBoxElement, s.infoBoxElementR, s.paddingZero]}>
						<Icon name='arrow-up' style={[s.compass, {transform: [{rotate: this.props.posn.course+'deg)'}]}]} size={70}/>
					</View>
				</View>
			</View>
		)
	}
}

//						<Icon name='arrow-up' style={s.compass} size={70}/>
transform: [{rotate: '50deg'}]

class MoreIndic extends Component {
	render() {
		return (
			<View style={s.moreIndic}></View>
		)
	}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#F6F6F6'
  },
  newItem: {
    backgroundColor: '#FFFFFF',
    height: 42,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    marginBottom: 10,
    marginLeft: 20,
    marginRight: 20,
    paddingLeft: 10,
    borderRadius: 5,
    fontSize: 10
  },
  offline: {
    backgroundColor: '#000000',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
    paddingTop: 5,
    paddingBottom: 5
  },
  text: {
	  fontSize: 10,
  },

})


module.exports = Router;
