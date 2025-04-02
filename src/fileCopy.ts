import { rejects } from 'assert';
import { copyFile, readdirSync, existsSync, mkdirSync, copyFileSync, lstatSync, cpSync, readFile, readFileSync, writeFileSync} from 'fs';
import * as fs from 'fs';
import path, { resolve } from 'path';
import * as vscode from 'vscode';
import { FileSystemProvider } from 'vscode';


export async function readDir(directory: string): Promise<string[]> {
    let files: string[] = [];
    return new Promise((resolve, reject) => {

        readdirSync(directory).forEach(file => {
            let fullPath = path.join(directory, file);
            if (lstatSync(fullPath).isDirectory()) {
                console.log(fullPath);
                readDir(fullPath);
            } else {
                files.push(fullPath);
            }
        });

        resolve(files);
    });

}

export async function copyFile_(source: string, target: string) {

    return new Promise((resolve, reject) => {
        let directory = target.substring(0, target.lastIndexOf("\\"));
        if (!existsSync(directory)) {

            mkdirSync(directory, { recursive: true });
        }

        copyFileSync(source, target);
    });

}

export async function copyFiles_(source: string, target: string) {

    return new Promise((resolve, reject) => {


        cpSync(source, target, { recursive: true });
        resolve("OK");
    });

}


export async function readAndCreateDirs(directory: string, target: string) {
    let files: string[] = [];
    let directories: string[] = [];
    let target_: string[] = [target];

    const readDirs = async (): Promise<string[]> => {
        return new Promise((resolve, reject) => {
            readdirSync(directory).forEach(file => {
                let fullPath = path.join(directory, file);
                if (lstatSync(fullPath).isDirectory()) {
                    console.log(fullPath);
                    directories.push(fullPath);
                    readDir(fullPath);
                } else {
                    files.push(fullPath);
                }
            });

            resolve(directories);
        });
    };


    var dirs: string[] = await readDirs();
    dirs.forEach(element => {
        let tempdir = element.replace(directory, target);
        if (!existsSync(tempdir)) {
            mkdirSync(tempdir);
        }
    });
    let h = '';

}

export async function changeVariables(files: string[], mainDir: string, changes: string) {
    return new Promise((resolve, reject) => {
        files.forEach(element => {
            let file = path.join(mainDir, element);
            let data: string = readFileSync(file).toString();
            let data_new = '';

            Object.keys(JSON.parse(changes)).forEach((j: any) => {
                data = data.replaceAll(j, JSON.parse(changes)[j]);
            });

            writeFileSync(file, data);

        });

        resolve("OK");
    });

};


export async function generateRandomstring(length:number) {
    return new Promise((resolve, reject) => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters[randomIndex];
        }
        

        resolve(result);
    });

};



// Function to read the file, modify its content, and write the result to a new file
export async function hideAssistant(File: string, mainDir: string) {
    // Read the HTML file
    let file = path.join(mainDir, File);

    fs.readFile(file, 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading file:", err);
            return;
        }

        // Regex to find the <a> with the href="#ai-assistant" and its child <div class="sb-nav-link-icon">
        const regex = /(<a class="nav-link" href="#ai-assistant">.*?<div class="sb-nav-link-icon">.*?<\/div>)/g;

        // Replace the <div class="sb-nav-link-icon"> with a hidden div
        const updatedData = data.replace(regex, (match) => {
            // Modify the <div> to include the style "display:none;"
            return match.replace(
                /<div class="sb-nav-link-icon">.*?<\/div>/,
                '<div class="sb-nav-link-icon" style="display:none;"></div>'
            );
        });

        // Write the modified HTML to the output file
        fs.writeFile(file, updatedData, 'utf8', (err) => {
            if (err) {
                console.error("Error writing file:", err);
            } else {
                console.log("File updated successfully!");
            }
        });
        resolve("OK");
    });
}
