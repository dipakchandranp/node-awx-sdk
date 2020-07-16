/**
 * This module will be used to communicate with AWX server.
 * OAuth token management will be handled by this class.
 * All ReST API calls to AWX can be made through this class,
 * `call` method is the common interface implemented in this.
 * On expire of token this class will create new token using refreshtoken.
 * `callDynamic` is for calling AWX with dynamic urls
 **/
const axios = require("axios");
const request = require("request");

const ERROR_CODES = {
  AWX_01: "AWX_01", //Must provide host, username and password of AWX to use the sdk
  AWX_02: "AWX_02" //Failed to get AWS API resources
};

class AwxRestConnector {
  constructor(host, username, password) {
    if (!host || !username || !password) {
      const err = new Error(ERROR_CODES.AWX_01);
      throw err;
    }
    this.host = host;
    this.username = username;
    this.password = password;
    this.apiVersion = null;
    this.apiResources = null;
    this.tokenInfo = null;
  }

  // function to get the API resources
  getApiResources() {
    return new Promise((resolve, reject) => {
      if (this.apiResources) {
        resolve(this.apiResources);
      } else {
        this._setApiResources().then(() => {
          resolve(this.apiResources);
        });
      }
    });
  }

  // function to get the token details
  getToken() {
    return new Promise((resolve, reject) => {
      if (this.tokenInfo) {
        const now = new Date();
        const expire = new Date(this.tokenInfo.expires);
        if (now < expire) {
          resolve(this.tokenInfo.token);
        } else {
          this._setTokenInfo().then(() => {
            resolve(this.tokenInfo.token);
          });
        }
      } else {
        this._setTokenInfo().then(() => {
          resolve(this.tokenInfo.token);
        });
      }
    });
  }

  _;

  /** START: Setting token and apiResources required **/

  _setApiResources() {
    return this._getApiEndPoints().then(() => {
      return this._setCurrentVersionApiResources(this.apiVersion);
    });
  }

  _getApiEndPoints() {
    return axios({
      method: "GET",
      url: `${this.host}/api`
    })
      .then(response => {
        this.apiVersion = response.data.current_version;
        return this.apiVersion;
      })
      .catch(error => {
        throw new Error(ERROR_CODES.AWX_02);
      });
  }

  // Setting api end points in the class property
  _setCurrentVersionApiResources(currentVersion) {
    return axios({
      method: "GET",
      url: `${this.host}${currentVersion}`
    })
      .then(response => {
        this.apiResources = response.data;
      })
      .catch(error => {
        throw new Error(ERROR_CODES.AWX_02);
      });
  }

  // Setting auth token information in the class
  _setTokenInfo() {
    return this.getApiResources().then(apiResources => {
      var options = {
        url: `${this.host}${apiResources.tokens}`,
        method: "POST",
        auth: {
          user: this.username,
          pass: this.password
        }
      };
      return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
          if (error) {
            reject(error);
          } else {
            this.tokenInfo = JSON.parse(body);
            resolve(this.tokenInfo.token);
          }
        });
      });
    });
  }
  /** START: Setting token and apiResources required **/

  /** A common interface to interact with AWX **/
  call(method, url, data) {
    return this.getApiResources().then(apiResources => {
      return this.callService(method, `${apiResources[url]}`, data);
    });
  }

  callDynamic(method, url, data) {
    return this.callService(method, `${url}`, data);
  }

  callService(method, url, data) {
    return this.getToken().then(token => {
      return axios({
        method,
        url: `${this.host}${url}`,
        data,
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(response => {
          return response.data;
        })
        .catch(error => {
          throw error;
        });
    });
  }
}

module.exports = AwxRestConnector;
