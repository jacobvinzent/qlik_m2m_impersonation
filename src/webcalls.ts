/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { window } from 'vscode';
import fetch from 'node-fetch';
import { rejects } from 'assert';
import * as fs from 'fs';
import * as path from 'path';



/**
 * Shows an input box using window.showInputBox().
 */
export async function createAuth0Child(client_id: String, client_secret: String, auth0url: String, qlikSenseURL: String) {
	qlikSenseURL = cleanOAuthURL(qlikSenseURL, '');
	return new Promise(async (resolve, reject) => {
		//Get Token from auth0
		auth0url = cleanOAuthURL(auth0url, 'auth0.com');
		let tokenResponse: string = await getOauthToken(client_id, client_secret, auth0url);

		var token: string = JSON.parse(tokenResponse).access_token;
		//Create an app in auth0
		var createApp = await createAuth0App(token, auth0url, qlikSenseURL);
		resolve(createApp);
	});
};


const getOauthToken = async (client_id: String, client_secret: String, auth0url: String) => {
	return new Promise<string>((resolve, reject) => {
		var headers = new Headers();
		headers.append("content-type", "application/json");

		var raw = JSON.stringify({
			"client_id": `${client_id}`,
			"client_secret": `${client_secret}`,
			"audience": `${auth0url}/api/v2/`,
			"grant_type": "client_credentials"
		});

		var requestOptions: object = {
			method: 'POST',
			headers: headers,
			body: raw,
			redirect: 'follow'
		};

		fetch(`${auth0url}/oauth/token`, requestOptions)
			.then(response => response.text())
			.then(result => resolve(result))
			.catch(error => console.log('error', error));
	});
};


const createAuth0App = async (token: String, auth0url: String, qlikSenseURL: String) => {
	qlikSenseURL = cleanOAuthURL(qlikSenseURL, '');

	return new Promise((resolve, reject) => {
		var headers = new Headers();
		headers.append("Content-Type", "application/json");
		headers.append("Authorization", `Bearer ${token}`);
		qlikSenseURL = cleanOAuthURL(qlikSenseURL, '');
		var raw = JSON.stringify({
			"name": "Qlik_SaaS",
			"logo_uri": "",
			"callbacks": [
				`${qlikSenseURL}/login/callback`,
				`https://localhost:3000/callback`,
				`http://localhost:3000/callback`,
				`https://${qlikSenseURL}/login/callback`
			],
			"allowed_origins": [
				"https://localhost:3000",
				"http://localhost:3000",
				`https://${qlikSenseURL}`
			],
			"client_aliases": [],
			"allowed_clients": [],
			"allowed_logout_urls": [],
			"token_endpoint_auth_method": "none",
			"app_type": "spa",
			"is_first_party": true,
			"jwt_configuration": {
				"lifetime_in_seconds": 36000,
				"secret_encoded": true,
				"scopes": {},
				"alg": "RS256"
			},
			"sso": true,
			"custom_login_page_on": true,
			"is_heroku_app": true,
			"addons": {},
			"resource_servers": [],
			"client_metadata": {}
		});

		var requestOptions: object = {
			method: 'POST',
			headers: headers,
			body: raw,
			redirect: 'follow'
		};

		fetch(`${auth0url}/api/v2/clients`, requestOptions)
			.then(response => response.text())
			.then(result => resolve(result))
			.catch(error => console.log('error', error));


	});
};


//For OAUTH creds, get Token
export async function getQlikSenseToken(clientID: String, clientSecrect: String, qlikSenseURL: String) {
	qlikSenseURL = cleanOAuthURL(qlikSenseURL, '');
	return new Promise((resolve, reject) => {
		var headers = new Headers();
		headers.append("Accept", "application/json");
		headers.append("Content-Type", "application/json");

		var raw = JSON.stringify({
			"client_id": `${clientID}`,
			"client_secret": `${clientSecrect}`,
			"grant_type": "client_credentials"
		});

		var requestOptions: object = {
			method: 'POST',
			headers: headers,
			body: raw,
			redirect: 'follow'
		};

		fetch(`${qlikSenseURL}/oauth/token`, requestOptions)
			.then(response => response.text())
			.then(result => {
				resolve(result);
			}
			)
			.catch(error => { console.log('error', error); }
			);
	});

};


export async function createOAuthInQlikSense(token: String, qlikSenseURL: String, admin:boolean) {
	qlikSenseURL = cleanOAuthURL(qlikSenseURL, '');

	return new Promise((resolve, reject) => {
		var headers = new Headers();
		headers.append("Content-Type", "application/json");
		headers.append("Authorization", `Bearer ${token}`);
		var accessScopes = admin ? ["admin_classic", "user_default"]:["user_default"];

		var postfixTitle = admin ? "_admin" : "_client"
			

		var raw = JSON.stringify({
			"appType": "web",
			"clientName": "my-embedded-portal" + postfixTitle,
			"description": "",
			"allowedGrantTypes": ["urn:qlik:oauth:user-impersonation", "client_credentials"],
			"allowedScopes": accessScopes,
			"redirectUris": [
				"https://localhost:3000",
				"http://localhost:3000"


			],
			"allowedOrigins": [
				"https://localhost:3000",
				"http://localhost:3000"

			]
		});

		var requestOptions: Object = {
			method: 'POST',
			headers: headers,
			body: raw,
			redirect: 'follow'
		};

		fetch(`${qlikSenseURL}/api/v1/oauth-clients`, requestOptions)
			.then(response => response.text())
			.then(result => resolve(result))
			.catch(error => console.log('error', error));

	});
};

//JVI
//Create constent in here before Publish
export async function MakeOauthTrusted(token: String, qlikSenseURL: String, OauthID: String) {
	qlikSenseURL = cleanOAuthURL(qlikSenseURL, '');

	return new Promise((resolve, reject) => {
		var header = new Headers();
		header.append("Content-Type", "application/json");
		header.append("Authorization", `Bearer ${token}`);

		var raw = JSON.stringify([
			{ "op": "replace", "value": "trusted", "path": "/consentMethod" }
		]);

		var requestOptions: Object = {
			method: 'PATCH',
			headers: header,
			body: raw,
			redirect: 'follow'
		};

		fetch(`${qlikSenseURL}/api/v1/oauth-clients/${OauthID}/connection-configs/me`, requestOptions)


			.then(response => {
				response.text();
			})
			.then(result => {
				resolve(result);
			}).
			catch(error => {
				console.log('error', error);
			});
	});
};

export async function PublishOAuthInQlikSense(token: String, qlikSenseURL: String, OauthID: String) {
	qlikSenseURL = cleanOAuthURL(qlikSenseURL, '');
	return new Promise((resolve, reject) => {
		var headers = new Headers();
		headers.append("Content-Type", "application/json");
		headers.append("Authorization", `Bearer ${token}`);


		var requestOptions: Object = {
			method: 'POST',
			headers: headers,
			redirect: 'follow'
		};

		fetch(`${qlikSenseURL}/api/v1/oauth-clients/${OauthID}/actions/publish`, requestOptions)
			.then(response => response.text())
			.then(result => {
				resolve(result);
			})
			.catch(error => {
				console.log('error', error);
			});

	});
};

export async function getTenantID(token: String, qlikSenseURL: String) {
	qlikSenseURL = cleanOAuthURL(qlikSenseURL, '');
	return new Promise((resolve, reject) => {
		var headers = new Headers();
		headers.append("Content-Type", "application/json");
		headers.append("Authorization", `Bearer ${token}`);


		var requestOptions: Object = {
			method: 'GET',
			headers: headers,
			redirect: 'follow'
		};

		fetch(`${qlikSenseURL}/api/v1/users/me`, requestOptions)
			.then(response => response.text())
			.then(result => resolve(JSON.parse(result).tenantId))
			.catch(error => console.log('error', error));
	});
}

export async function createOauthIDPInQlikSense(token: String, qlikSenseURL: String, tenantId: String, OAuthURL: String, OAuthAppClient: String, OAuthAppSecret: String) {
	qlikSenseURL = cleanOAuthURL(qlikSenseURL, '');
	let JSON_ = `{"provider":"auth0","interactive":true,"protocol":"OIDC","tenantIds":["${tenantId}"],"skipVerify": true,"options":{"discoveryUrl":"${OAuthURL}/.well-known/openid-configuration","clientId":"${OAuthAppClient}","clientSecret":"${OAuthAppSecret}","emailVerifiedAlwaysTrue":false,"blockOfflineAccessScope":false,"claimsMapping":{"sub":["sub"],"name":["name"],"groups":["groups"],"email":["email"],"client_id":["client_id"],"picture":["picture"]}}}`;

	return new Promise((resolve, reject) => {
		var headers = new Headers();
		headers.append("Content-Type", "application/json");
		headers.append("Authorization", `Bearer ${token}`);

		var raw = JSON_;


		var requestOptions: Object = {
			method: 'POST',
			headers: headers,
			body: raw,
			redirect: 'follow'
		};

		fetch(`${qlikSenseURL}/api/v1/identity-providers`, requestOptions)
			.then(response => response.text())
			.then(result => {
				resolve(result);
			})
			.catch(error => {
				console.log('error', error);
			});

	});


}



async function uploadApp(token: String, qlikSenseURL: String, filePath: string) {


	return new Promise((resolve, reject) => {
		const fileData = fs.readFileSync(filePath);
		var headers = new Headers();
		headers.append("Content-Type", "application/octet-stream");
		headers.append("Authorization", `Bearer ${token}`);

		var requestOptions: Object = {
			method: 'POST',
			headers: headers,
			body: fileData

		};

		fetch(`${qlikSenseURL}/api/v1/apps/import?name=testapp`, requestOptions).then(response => response.text())
			.then(result => {
				resolve(result);
			})
			.catch(error => {
				console.log('error', error);
			});;

	});

}

export async function uploadApps(token: String, qlikSenseURL: String, path_input: string) {
	let apps: any = [];
	return new Promise(async (resolve, reject) => {
		const files = fs.readdirSync(path_input).filter(t => {
			return path.extname(t).toLowerCase() === ".qvf";
		});

		for (var n = 0; n < files.length; n++)
		//for (var file in files)
		//	files.forEach((file) =>
		{
			const filePath = path.join(path_input, files[n]);

			// Read file content synchronously
			//const data = fs.readFileSync(filePath, 'utf8');
			let app = await uploadApp(token, qlikSenseURL, filePath);
			apps.push(app);

		};
		resolve(apps);
	});
}


export async function createSpace(token: String, qlikSenseURL: String, spacename: string, addToName: string = "") {
	return new Promise(async (resolve, reject) => {
		let spaces: any = await checkSpaceName(token, qlikSenseURL, spacename);


		while (isSpaceNameUsed(spacename + addToName)) {
			if (addToName === "") {
				addToName = "1";
			} else {
				addToName = (parseInt(addToName) + 1).toString();
			}
		}

		function isSpaceNameUsed(name: string) {
			if (spaces.indexOf(name) > -1) {
				return true;
			} else {
				return false;
			}

		}


		var headers = new Headers();
		headers.append("Content-Type", "application/json");
		headers.append("Authorization", `Bearer ${token}`);
		headers.append("accept", "application/json");


		var requestOptions: Object = {
			method: 'POST',
			headers: headers,
			body: JSON.stringify({
				"name": `${spacename}${addToName}`,
				"type": "managed"
			}),
			redirect: 'follow'
		};

		fetch(`${qlikSenseURL}/api/v1/spaces`, requestOptions)
			.then(response => response.text())
			.then(result => {

				resolve(result);
			})
		.catch(error => {
			console.log('error', error);
		});
});

}



export async function createSpaceAssignment(token: String, qlikSenseURL: String, spaceID: String) {

	return new Promise((resolve, reject) => {
		var headers = new Headers();
		headers.append("Content-Type", "application/json");
		headers.append("Authorization", `Bearer ${token}`);
		headers.append("accept", "application/json");


		var requestOptions: Object = {
			method: 'POST',
			headers: headers,
			body: JSON.stringify(
				{ "type": "group", "assigneeId": "000000000000000000000001", "roles": ["consumer"] }
			),
			redirect: 'follow'
		};



		fetch(`${qlikSenseURL}/api/v1/spaces/${spaceID}/assignments`, requestOptions)
			.then(response => {
				response.text();

			})
			.then(result => {
				resolve(result);
			})
			.catch(error => {
				console.log('error', error);
			});
	});
}



async function checkSpaceName(token: String, qlikSenseURL: String, spacename: string, spaces: any = [], nextURL: string = "") {
	return new Promise((resolve, reject) => {

		var headers = new Headers();
		headers.append("Content-Type", "application/json");
		headers.append("Authorization", `Bearer ${token}`);
		headers.append("accept", "application/json");


		var requestOptions: Object = {
			method: 'GET',
			headers: headers,
			redirect: 'follow'
		};

		var url = nextURL === "" ? `${qlikSenseURL}/api/v1/spaces?filter=name co "${spacename}"` : nextURL;


		fetch(url, requestOptions)
			.then(response => response.text())
			.then(result => {

				var spaces_temp = spaces.concat(JSON.parse(result).data);
				if (JSON.parse(result).links.hasOwnProperty('next')) {

					resolve(checkSpaceName(token, qlikSenseURL, spacename, spaces_temp, JSON.parse(result).links.next.href));

				} else {

					let returnArray = spaces_temp.map((v: any) => v.name);
					resolve(returnArray);
				}

			})
			.catch(error => {
				console.log('error', error);
			});
	});

}



export async function publishApps(token: String, qlikSenseURL: String, app: String, space: String, appName: string) {
	return new Promise((resolve, reject) => {
		var headers = new Headers();
		headers.append("Content-Type", "application/json");
		headers.append("Authorization", `Bearer ${token}`);
		headers.append("accept", "application/json");

		var reqObj = { "spaceId": JSON.parse(`${space}`).id, "attributes": { "name": `${appName}`, "description": "" }, "data": "source" };


		var requestOptions: Object = {
			method: 'POST',
			headers: headers,
			body: JSON.stringify(reqObj),
			redirect: 'follow'
		};


		fetch(`${qlikSenseURL}/api/v1/apps/${app}/publish`, requestOptions)
			.then(response => {
				return response.text();

			})
			.then(result => {
				resolve(JSON.parse(result).attributes.id);
			})
			.catch(error => {
				console.log('error', error);
			});
	});
}




export function cleanOAuthURL(url: String, find: string) {

	while (url.endsWith('/')) {
		url = url.substring(0, url.length - 1);
	}

	if (find === '') {
		return url;
	}

	url.indexOf(find);
	url = url.substring(0, url.indexOf(find) + find.length);

	return url;


}



export async function getAssistants(token: String, qlikSenseURL: String) {
	qlikSenseURL = cleanOAuthURL(qlikSenseURL, '');

	return new Promise((resolve, reject) => {
		var headers = new Headers();
		headers.append("Content-Type", "application/json");
		headers.append("Authorization", `Bearer ${token}`);

		var requestOptions: Object = {
			method: 'GET',
			headers: headers,
			redirect: 'follow'
		};

		fetch(`${qlikSenseURL}/api/v1/assistants`, requestOptions)
			.then(response => response.text())
			.then(result => {
				resolve(result);
	
			})
			.catch(error => console.log('error', error));

	});
};








