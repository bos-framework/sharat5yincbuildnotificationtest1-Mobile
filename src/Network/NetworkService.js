import RequestService from './RequestService';

class NetworkService {
  
  constructor () {
    this.baseUrl = '',
    this.appKey = ''
  }

  async configuration(options={}) {
    if (!options.baseUrl || !options.appKey) {
      throw "Configure BOS: APP_KEY and BASE_URL.";
    }
    this.baseUrl = await options.baseUrl;
    this.appKey  = await options.appKey;
  }

  signUp(params) {
    var url = `${this.baseUrl}/auth/odata/Users`;
    return RequestService.postRequest(url, this.appKey, params);
  }
  
  login(params) {
    var url = `${this.baseUrl}/auth/odata/Verification?api-version=1.0`;
    return RequestService.postRequest(url, this.appKey, params);
  }

  getUserDetails(email) {
    var url = `${this.baseUrl}/auth/odata/users?$filter=deleted eq false and email eq ${"'"}${email}${"'"}`;
    return RequestService.getRequest(url, this.appKey);
  }

  getUserProfileDetails(userId) {
    var url = `${this.baseUrl}/auth/odata/Users${"("}${userId}${")"}?api-version=1.0`;
    return RequestService.getRequest(url, this.appKey);
  }

  forgotPassword(userId, params) {
    var url = `${this.baseUrl}/auth/odata/Users${"("}${userId}${")"}/ForcePasswordChange?api-version=1.0` ;
    return RequestService.postRequest(url, this.appKey, params);
  }

  updateUserProfile(userId, params) {
    var url = `${this.baseUrl}/auth/odata/Users${"("}${userId}${")"}?api-version=1.0`;
    return RequestService.patchRequest(url, this.appKey, params);
  }

  changePassword(userId, params) {
    var url = `${this.baseUrl}/auth/odata/Users${"("}${userId}${")"}/ChangePassword?api-version=1.0`;
    return RequestService.postRequest(url, this.appKey, params);
  }

  sendEmail(params) {
    var url = `${this.baseUrl}/email/odata/email`;
    return RequestService.postRequest(url, this.appKey, params);
  }

  getAllRoles() {
    var url = `${this.baseUrl}/auth/odata/Roles?api-version=1.0`;
    return RequestService.getRequest(url, this.appKey);
  }

  assignRoleToUser(userId, params) {
    var url = `${this.baseUrl}/auth/odata/Users${"("}${userId}${")"}/AssignUserToMultipleRoles?api-version=1.0`;
    return RequestService.postRequest(url, this.appKey, params);
  }

  getModulesAssignedForUser(userId) {
    var url = `${this.baseUrl}/ia/odata/Permissions/GetOwnerPermissionsSets${"("}ownerId=${userId}${")"}?api-version=1.0`
    return RequestService.getRequest(url, this.appKey);
  }

  getUserRoleWithUserId(userId) {
    var url = `${this.baseUrl}/auth/odata/Users?$filter=id eq ${userId}&$expand=roles($expand=Role)`
    return RequestService.getRequest(url, this.appKey);
  }
  
}

export default new NetworkService();
