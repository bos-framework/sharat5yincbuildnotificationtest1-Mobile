
import React from 'react';
import { View, StatusBar, ActivityIndicator, StyleSheet } from 'react-native';
import NetworkService from '../Network/NetworkService';
import Constants from '../Resources/constants';
import AppData from '../store/AppData';
import { connect } from "react-redux";
import { saveUserId, saveUserDetails } from "../actions";

/*
*Use this component in Root Navigator of app, if app requires role based login with permisions and operations.
*This component mounts on App moving from inactive/background/suspended to active state.
*On mount of this component fetch the update permissions and operations of the app from the BOS API'S, which are changed/updated in BOS console.
*/

class AuthLoading extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.getUserIdFromlS();
    }


    // Get userId from local storage.
    getUserIdFromlS() {
        AppData.getItemForKey(Constants.USERID, (status, userId) => {
            if (status) {
                this.getUserProfileDetails(userId);
                //this.getModulesAssignedForUser(userId) //Uncomment this line when use role based login user
            } else { 
                //alert(Strings.error.errorMessage) //Uncomment this line when use role based login user
                this.props.navigation.navigate('App'); // Comment this line when use role based login user
            }
        })
    }

    // Get user profile details from server.
    getUserProfileDetails = (userId) => {
        NetworkService.getUserProfileDetails(userId).then(response => {
            if (response.ok) {
                response.json().then((responseJson) => {
                    if (responseJson) {
                        this.props.saveUserId(userId); // Comment this line when use role based login 
                        this.props.saveUserDetails(responseJson);
                        this.props.navigation.navigate('App'); // Comment this line when use role based login user
                    }
                })
            }
        }).catch(() => {
            //alert(Strings.error.errorMessage) //Uncomment this line when use role based login user
            this.props.navigation.navigate('App'); // Comment this line when use role based login user
        });
    }

    // Get all modules assigned to user
    getModulesAssignedForUser(userId) {
        
        NetworkService.getModulesAssignedForUser(userId).then(response => {
            if (response.ok) {
                response.json().then((responsejson) => {
                    this.props.saveUserId(userId);
                    this.storeModulesData(responsejson)
                })
            } else {
                this.props.navigation.navigate('App');
            }
        }).catch(() => {
            this.props.navigation.navigate('App');
        })

    }

    // Store role based user module data into App local storage.
    // fetch and load module data when app is in offline mode
    async storeModulesData(modulesData) {
        AppData.setItemForKey(Constants.MODULES, JSON.stringify(modulesData), (status) => {
            if (status) {
                this.props.navigation.navigate('App');
            } else {
                console.log("error", error);
            }
        });
    };

    render() {
        return (<View style={styles.container}>
            <ActivityIndicator />
            <StatusBar barStyle="default" />
        </View>);

    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default connect(null, { saveUserId, saveUserDetails })(AuthLoading);
