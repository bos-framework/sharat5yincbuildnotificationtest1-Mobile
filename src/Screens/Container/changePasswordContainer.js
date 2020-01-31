import React, { Component } from "react";
import { View, Text, Alert, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import NetworkService from '../../Network/NetworkService';
import Strings from '../../Resources/strings';
import Colors from '../../Resources/colors';
import Helper from '../../Utilities/helper';
import { connect } from "react-redux";
import ChangePassword from '../Presentational/changePassword';
import NavigationService from '../../Navigator/NavigationService';


class ChangePasswordContainer extends Component {

  constructor(props) {
    super(props);
  }

  static navigationOptions = () => {
    return {
      headerRight: (
        <TouchableWithoutFeedback onPress={() => NavigationService.navigate("Home")}>
          <View style={styles.cancelContainer}>
            <Text style={styles.cancelText}>Cancel</Text>
          </View>
        </TouchableWithoutFeedback>
      ),
      headerTintColor: Colors.secondaryButtonTextColor,
      title: "Change Password",
      headerStyle: {
        backgroundColor: Colors.primaryAppThemeColor,
      }
    };
  };

  // Initial state. 
  state = {
    userId: '',
    currentPassword: '',
    newPassword: '',
    confirmNewPasword: '',
    errors: {
      currentPasswordEmpty: false,
      newPasswordError: false,
      confirmNewPaswordError: false,
      passwordNotMatches: false
    }
  };

  // Change password button action.
  onPressSave = () => {

    // stop here if form is invalid.
    if (!this.validateFields()) {
      return;
    }
    this.changePasswordApiCall(this.props.userId)
  };

  // Change password API call with current and new passwords as parameters. 
  changePasswordApiCall(userId) {

    // Params
    let params = {
      currentPassword: this.state.currentPassword,
      newPassword: this.state.newPassword,
    };

    // Change password API Call
    NetworkService.changePassword(userId, params).then(response => {
      if (response.ok) {
        this.alertMessage(Strings.success.passwordChangedSuccessfully, true)
      } else if (response.status === 400) {
        this.alertMessage(Strings.error.currentPasswordIncorrect, false)
      } else {
        this.alertMessage(Strings.error.errorMessage, false)
      }
    }).catch(() => {
      this.alertMessage(Strings.error.errorMessage, false)
    });
  }

  // Display user with valid message in Alert popup.
  alertMessage(message, success) {
    Alert.alert(message, "", [
      {
        text: "OK",
        onPress: () => {
          if (success)
            this.props.navigation.goBack();
        }
      }
    ]);
  }

  // validating input fields.
  validateFields() {

    const { currentPassword, newPassword, confirmNewPasword, errors } = this.state;

    errors.currentPasswordEmpty = currentPassword.trim().length > 0 ? false : true;
    errors.newPasswordError = Helper.isPasswordValid(newPassword);
    errors.confirmNewPaswordError = Helper.isPasswordValid(confirmNewPasword);
    errors.passwordNotMatches = newPassword != confirmNewPasword ? true : false;

    // Update state with errors.
    this.setState({ errors });

    // Checking the form with field validation.
    return Helper.validateForm(errors);
  }

  /* 
    Update state properties with onChangeText for every Inputfield.
    Changing the Error status message.
  */
  onChangeTextHandler = (name, fErrorKey, sErrorKey, value) => {

    let error = this.state.errors
    error[fErrorKey] = false;
    if (sErrorKey != null) {
      error[sErrorKey] = false;
    }
    this.setState({ [name]: value, errors: error });
  }


  // Component render.
  render() {
    return (
      <ChangePassword
        data={this.state}
        onChangeTextHandler={this.onChangeTextHandler}
        onSaveBtnTapped={this.onPressSave} />
    );
  }
}

const mapStateToProps = state => {
  let { userId } = state.user;
  return { userId };
};

const styles = StyleSheet.create({
  cancelContainer: {
    height: 25,
    width: 100,
    marginRight: 10,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  cancelText: {
    fontSize: 16,
    padding: 2,
    color: Colors.secondaryButtonTextColor,
  }
});

export default connect(mapStateToProps, null)(ChangePasswordContainer);

