/*
 * Config file: change the parameters according to your integration scenario.
 * Do not version control this file, and consider using .env files if you require
 * a more common integration pattern.
 */

// This is the hard-coded config for the M2M steps in impersonation, exposed below by getParameters().
const myConfig = {
  tenantHostname: "<replace_tenantURL_From_Qlik>",
  oAuthClientId: "<replace_OAUTH_clientID_From_Qlik>",
  oAuthClientSecret: "<replace_OAUTH_clientSecret_From_Qlik>",
  appId: "<replace_APPID_From_Qlik>"
};

// Create a cut-down config without the client secret for use in the qlik-embed HEAD tag
const myParamsConfig = {
  tenantHostname: myConfig.tenantHostname,
  oAuthClientId: myConfig.oAuthClientId,
  appId: myConfig.appId,
};

const getParameters = async function (email) {
  /*
    This function should:
    - Accept a user or customer identifier (such as email)
    - Look up the correct Qlik Cloud tenant for that customer
    - Retrieve the corresponding OAuth client details for the impersonation activity
    - Retrieve the corresponding OAuth client for the qlik-embed tag (review guiding
      principles for OAuth M2M impersonation: https://qlik.dev/authenticate/oauth/guiding-principles-oauth-impersonation/)
  
    For purposes of making this demo as simple as possible, the values are hardcoded
    in this project via myParamsConfig, and the same OAuth client is used for
    embedding and impersonation. Do not do this in production.

    */
  return myParamsConfig;
};

export { myConfig, getParameters };
