import * as path from "node:path";
import * as vscode from "vscode";
import { getSettings } from "../config/settings";
import {
	findProjectRoot,
	getCurrentFilePath,
	getRelativeFilePath,
} from "../utils/projectDetection";
import { runCommand } from "../utils/terminal";

function buildBaseCommand(args: string[] = []): string {
	const settings = getSettings();
	const parts = [settings.dataformCliPath, ...args];

	if (settings.runOptions.verbose) {
		parts.push("--verbose");
	}

	const vars = settings.runOptions.vars;
	if (Object.keys(vars).length > 0) {
		const varsJson = JSON.stringify(vars);
		parts.push("--vars", `'${varsJson}'`);
	}

	if (settings.runOptions.schemaSuffix) {
		parts.push("--schema-suffix", settings.runOptions.schemaSuffix);
	}

	return parts.join(" ");
}

function requireProjectRoot(): string | undefined {
	const projectRoot = findProjectRoot();
	if (!projectRoot) {
		vscode.window
			.showErrorMessage(
				"No Dataform project found. Make sure you have a dataform.json or workflow_settings.yaml file in your project.",
				"Initialize Project",
			)
			.then((selection) => {
				if (selection === "Initialize Project") {
					vscode.commands.executeCommand("sqlx.init");
				}
			});
		return undefined;
	}
	return projectRoot;
}

export function registerDataformCommands(context: vscode.ExtensionContext) {
	// Compile command
	context.subscriptions.push(
		vscode.commands.registerCommand("sqlx.compile", () => {
			const projectRoot = requireProjectRoot();
			if (!projectRoot) return;

			const command = buildBaseCommand(["compile"]);
			runCommand(command, projectRoot);
		}),
	);

	// Run command
	context.subscriptions.push(
		vscode.commands.registerCommand("sqlx.run", () => {
			const projectRoot = requireProjectRoot();
			if (!projectRoot) return;

			const settings = getSettings();
			const args = ["run"];

			if (settings.runOptions.runTests) {
				args.push("--include-deps");
			}

			const command = buildBaseCommand(args);
			runCommand(command, projectRoot);
		}),
	);

	// Dry run command
	context.subscriptions.push(
		vscode.commands.registerCommand("sqlx.runDryRun", () => {
			const projectRoot = requireProjectRoot();
			if (!projectRoot) return;

			const command = buildBaseCommand(["run", "--dry-run"]);
			runCommand(command, projectRoot);
		}),
	);

	// Test command
	context.subscriptions.push(
		vscode.commands.registerCommand("sqlx.test", () => {
			const projectRoot = requireProjectRoot();
			if (!projectRoot) return;

			const command = buildBaseCommand(["test"]);
			runCommand(command, projectRoot);
		}),
	);

	// Run current file command
	context.subscriptions.push(
		vscode.commands.registerCommand("sqlx.runCurrentFile", () => {
			const projectRoot = requireProjectRoot();
			if (!projectRoot) return;

			const currentFile = getCurrentFilePath();
			if (!currentFile) {
				vscode.window.showWarningMessage("No file is currently open.");
				return;
			}

			if (!currentFile.endsWith(".sqlx")) {
				vscode.window.showWarningMessage("Current file is not a .sqlx file.");
				return;
			}

			// Get the relative path and extract the action name
			const relativePath = getRelativeFilePath(currentFile, projectRoot);
			// Remove the definitions/ prefix and .sqlx extension to get the action name
			const actionName = relativePath
				.replace(/^definitions\//, "")
				.replace(/\.sqlx$/, "");

			const settings = getSettings();
			const args = ["run", "--actions", actionName];

			if (settings.runOptions.dryRun) {
				args.push("--dry-run");
			}

			const command = buildBaseCommand(args);
			runCommand(command, projectRoot);
		}),
	);

	// Run full refresh current file command
	context.subscriptions.push(
		vscode.commands.registerCommand("sqlx.runFullRefreshCurrentFile", () => {
			const projectRoot = requireProjectRoot();
			if (!projectRoot) return;

			const currentFile = getCurrentFilePath();
			if (!currentFile) {
				vscode.window.showWarningMessage("No file is currently open.");
				return;
			}

			if (!currentFile.endsWith(".sqlx")) {
				vscode.window.showWarningMessage("Current file is not a .sqlx file.");
				return;
			}
			// Get the relative path and extract the action name
			const relativePath = getRelativeFilePath(currentFile, projectRoot);
			// Remove the definitions/ prefix and .sqlx extension to get the action name
			const actionName = relativePath
				.replace(/^definitions\//, "")
				.replace(/\.sqlx$/, "");

			const args = ["run", "--full-refresh", "--actions", actionName];
			const command = buildBaseCommand(args);
			runCommand(command, projectRoot);
		}),
	);

	// Init command
	context.subscriptions.push(
		vscode.commands.registerCommand("sqlx.init", async () => {
			const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
			if (!workspaceFolder) {
				vscode.window.showErrorMessage("Please open a folder first.");
				return;
			}

			const projectPath = await vscode.window.showInputBox({
				prompt: "Enter project path (relative to workspace root)",
				value: ".",
				placeHolder: ".",
			});

			if (projectPath === undefined) return;

			const fullPath = path.join(workspaceFolder.uri.fsPath, projectPath);
			const command = buildBaseCommand(["init", "bigquery", fullPath]);
			runCommand(command);
		}),
	);

	// Init credentials command
	context.subscriptions.push(
		vscode.commands.registerCommand("sqlx.initCreds", () => {
			const projectRoot = requireProjectRoot();
			if (!projectRoot) return;

			const command = buildBaseCommand(["init-creds", "bigquery"]);
			runCommand(command, projectRoot);
		}),
	);
}
