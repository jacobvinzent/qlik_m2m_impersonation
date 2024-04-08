/**
 * Config file: change the parameters according to your integration scenario
 */

const myConfig = {
  tenantHostname: "<replace_tenantURL_From_Qlik>",
  oAuthClientId: "<replace_OAUTH_clientID_From_Qlik>",
  oAuthClientSecret: "<replace_OAUTH_clientSecret_From_Qlik>",
};

const myParamsConfig = {
  tenantHostname: myConfig.tenantHostname,
  oAuthClientId: myConfig.oAuthClientId,
  appId: "your-app-id",
};

const getParameters = async function (email) {
  //This function should, based on the user's email, find the right Qlik tenant hostname, oAuthClientId and appId from your backend. This should be stored as a part of the tenant hydration process.

  //The oAuthClientId and AppId can be fetched using the APIs,when you know the tenant URL and using the OEM OAuth clientID and Secret used for the tenant hydration.

  //use the function call below to get the first web oAuth clientID from a URL. Remember to fill the licenseOAuthClientId and licenseOAuthClientSecret in the myConfig const.

  //var = oAuthClientId = await oAuthClientId(url);

  //For demo purposes the values are hardcoded in this project.
  return myParamsConfig;
};

const oAuthClientId = async function (url) {
  return new Promise(async (resolve, reject) => {
    var accessToken = await getAccessToken(url);

    const headers = new Headers();
    headers.append(
      "Authorization",
      "Bearer " + JSON.parse(accessToken).access_token
    );
    headers.append("Content-type", "application/json");
    headers.append("Accept", "application/json");

    const requestOptions = {
      method: "GET",
      headers: headers,
      redirect: "follow",
    };

    fetch("https://" + url + "/api/v1/oauth-clients", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        resolve(
          JSON.parse(result).data.filter((v) => v.appType === "web")[0].clientId
        );
      })
      .catch((error) => console.error(error));
  });
};

const getAccessToken = async function (url) {
  return new Promise((resolve, reject) => {
    const headers = new Headers();
    headers.append("Accept", "application/json");
    headers.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      client_id: myConfig.licenseOAuthClientId,
      client_secret: myConfig.licenseOAuthClientSecret,
      grant_type: "client_credentials",
    });

    const requestOptions = {
      method: "POST",
      headers: headers,
      body: raw,
      redirect: "follow",
    };

    fetch("https://" + url + "/oauth/token", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        resolve(result);
      })
      .catch((error) => console.error(error));
  });
};

export { myConfig, myParamsConfig, getParameters };
