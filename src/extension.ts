import * as vscode from 'vscode';
import { registerDataformCommands } from './commands/dataformCommands';

export function activate(context: vscode.ExtensionContext) {
    console.log('SQLX extension is now active');

    registerDataformCommands(context);
}

export function deactivate() {}
