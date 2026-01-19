import * as vscode from 'vscode';
import { getSettings } from '../config/settings';

let dataformTerminal: vscode.Terminal | undefined;

const TERMINAL_NAME = 'Dataform';

export function getOrCreateTerminal(): vscode.Terminal {
    const settings = getSettings();

    // Check if we should reuse terminal
    if (settings.terminal.reuseTerminal && dataformTerminal) {
        // Check if terminal is still alive
        const terminals = vscode.window.terminals;
        if (terminals.includes(dataformTerminal)) {
            return dataformTerminal;
        }
    }

    // Create new terminal
    dataformTerminal = vscode.window.createTerminal(TERMINAL_NAME);
    return dataformTerminal;
}

export function runCommand(command: string, cwd?: string) {
    const settings = getSettings();
    const terminal = getOrCreateTerminal();

    terminal.show();

    if (settings.terminal.clearBeforeRun) {
        terminal.sendText('clear');
    }

    if (cwd) {
        terminal.sendText(`cd "${cwd}"`);
    }

    terminal.sendText(command);
}

export function disposeTerminal() {
    if (dataformTerminal) {
        dataformTerminal.dispose();
        dataformTerminal = undefined;
    }
}
