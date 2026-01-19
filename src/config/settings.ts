import * as vscode from 'vscode';

export interface SqlxSettings {
    dataformCliPath: string;
    runOptions: {
        dryRun: boolean;
        runTests: boolean;
        verbose: boolean;
        vars: Record<string, string>;
        schemaSuffix: string;
    };
    terminal: {
        reuseTerminal: boolean;
        clearBeforeRun: boolean;
    };
}

export function getSettings(): SqlxSettings {
    const config = vscode.workspace.getConfiguration('sqlx');

    return {
        dataformCliPath: config.get<string>('dataformCliPath', 'dataform'),
        runOptions: {
            dryRun: config.get<boolean>('runOptions.dryRun', false),
            runTests: config.get<boolean>('runOptions.runTests', false),
            verbose: config.get<boolean>('runOptions.verbose', false),
            vars: config.get<Record<string, string>>('runOptions.vars', {}),
            schemaSuffix: config.get<string>('runOptions.schemaSuffix', ''),
        },
        terminal: {
            reuseTerminal: config.get<boolean>('terminal.reuseTerminal', true),
            clearBeforeRun: config.get<boolean>('terminal.clearBeforeRun', true),
        },
    };
}
