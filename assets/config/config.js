/**
 * Config file: change the parameters according to your integration scenario
 */

const myConfig = {
  tenantHostname: "<replace_tenantURL_From_Qlik>",
  oAuthClientId: "<replace_OAUTH_clientID_From_Qlik>",
  oAuthClientSecret: "<replace_OAUTH_clientSecret_From_Qlik>",
  licenseOAuthClientId: "",
  licenseOAuthClientSecret: ""

};

const myParamsConfig = {
  tenantHostname: myConfig.tenantHostname,
  oAuthClientId: myConfig.oAuthClientId,
  appId: "<replace_APPID_From_Qlik>"
};

const getParameters = async function (email) {
  //This function should, based on the user's email or any other unique parameter, find the right Qlik tenant hostname, oAuthClientId and appId from your backend. This should be stored as a part of the tenant hydration process.


  //For demo purposes the values are hardcoded in this project.
  return myParamsConfig;
};



export { myConfig, myParamsConfig, getParameters };
