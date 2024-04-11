# Get started with Qlik Embed, OAuth2 M2M Impersonation client

This extension will configure OAuth2 M2M Impersonation on an existing Qlik tenant using the tenant URL and Client Id and Client Secret from myqlik (https://account.myqlik.qlik.com/account) or a developer key from the tenant.

![images/integration.jpg](https://raw.githubusercontent.com/jacobvinzent/qlik_m2m_impersonation/master/images/integration.jpg)

## Features
This extension creates following:
1. An Oauth-client in your Qlik cloud tenant
2. A new space with access to everyone in the tenant
3. Upload a test app and publish it to the new space
4. A Node js Express web app using the values returned from 1-3 with sample HTML showing how to integrate objects in different ways
   
## Requirements

1. An activated Qlik Cloud tenant, with a dev token OR Oauth client Id and Secret from myqlik.
2. Node.js installed 


## Config file
If you want to reuse your variables for multiple tests, then you can add a file called config.json in the directory and enter the values here. Then you will not be prompted during the installation. All values need to be filled. Format of config.json is: 

```json
{

    "Qlik Cloud URL":"https://yourteant.region.qlikcloud.com",
    "Use Oauth client_id and secret": true,
    "Qlik Sense Oauth client_id": "Value only needed if Use Oauth client_id and secret is true",
    "Qlik Sense Oauth client_secret": "Value only needed if Use Oauth client_id and secret is true",
    "Qlik Sense developer key": "Value only needed if Use Oauth client_id and secret is false"
}
```

## Run the extension
To run the extension, select "Setup Qlik M2M impersonation" from the Command Palette. If everything runs successfully you can now see the webpage on http://localhost:3000

## Shortcuts included for HTML files

Below are the shortcuts. The ⇥ means the TAB

|    Trigger                  | Content                                                  |
| --------------------------  | ------------------------------------------------------   |
|  `qEmbedAnalyticsChart →`   | Qlik chart, renders only nebula.js visualizations        |
|  `qEmbedClassicChart   →`   | Qlik Classic App, renders all chart types                |
|  `qEmbedSelectionsBar  →`   | Qlik Selection-bar                                       |
|  `qEmbedClassicApp     →`   | Qlik Classic App, renders all chart types                |
|  `qEmbedField          →`   | Qlik Field                                               |
|  `qEmbedNebulaApp      →`   | Qlik Classic App, renders only nebula.js visualizations  |





