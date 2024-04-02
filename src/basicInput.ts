/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { QuickPickItem, window } from 'vscode';
import fetch from 'node-fetch';
import { rejects } from 'assert';



/**
 * Shows a pick list using window.showQuickPick().
 */
export async  function showQuickPick(Question: String, options: any) {
	return new Promise(async(resolve, reject) => {
		let i = 0;
		const result = await window.showQuickPick(
			options
			, {
				placeHolder: `${Question}`
			});
			resolve(`${result}`);
	});
}

/**
 * Shows an input box using window.showInputBox().
 */
export async function showInputBox(Question: String, isPassword: boolean) {
	return new Promise<string>(async (resolve, reject) => {

		const result = window.showInputBox({ value: "", prompt: `${Question}`, placeHolder: "", password: isPassword, ignoreFocusOut: true }).then((info) => {
			if (typeof info !== "undefined") {
				resolve(info);

			} else {
				throw new Error('cancelled');
				resolve("");
			}
		});
	});
};
