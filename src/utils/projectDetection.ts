import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

const PROJECT_FILES = ['dataform.json', 'workflow_settings.yaml'];

export function findProjectRoot(startPath?: string): string | undefined {
    let currentDir = startPath;

    if (!currentDir) {
        const activeEditor = vscode.window.activeTextEditor;
        if (activeEditor) {
            currentDir = path.dirname(activeEditor.document.uri.fsPath);
        } else if (vscode.workspace.workspaceFolders?.[0]) {
            currentDir = vscode.workspace.workspaceFolders[0].uri.fsPath;
        }
    }

    if (!currentDir) {
        return undefined;
    }

    // Walk up the directory tree to find project root
    while (currentDir !== path.dirname(currentDir)) {
        for (const projectFile of PROJECT_FILES) {
            const projectFilePath = path.join(currentDir, projectFile);
            if (fs.existsSync(projectFilePath)) {
                return currentDir;
            }
        }
        currentDir = path.dirname(currentDir);
    }

    return undefined;
}

export function isDataformProject(): boolean {
    return findProjectRoot() !== undefined;
}

export function getCurrentFilePath(): string | undefined {
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor) {
        return undefined;
    }
    return activeEditor.document.uri.fsPath;
}

export function getRelativeFilePath(filePath: string, projectRoot: string): string {
    return path.relative(projectRoot, filePath);
}
