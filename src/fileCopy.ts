import { rejects } from 'assert';
import { copyFile, readdirSync, existsSync, mkdirSync, copyFileSync, lstatSync, cpSync, readFile, readFileSync, writeFileSync } from 'fs';
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