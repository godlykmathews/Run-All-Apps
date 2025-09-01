// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

interface ButtonConfig {
	id: string;
	text: string;
	tooltip?: string;
	command: string;
	alignment?: 'left' | 'right';
	priority?: number;
	color?: string;
	backgroundColor?: string;
	reuseTerminal?: boolean;
	workingDirectory?: string;
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "run-all-apps" is now active!');

	const config = vscode.workspace.getConfiguration('runAllApps');
	const buttons: ButtonConfig[] = config.get('buttons', []);
	const loadNpmScripts: boolean = config.get('loadNpmScripts', false);

	let allButtons = [...buttons];

	if (loadNpmScripts && vscode.workspace.workspaceFolders) {
		const workspaceFolder = vscode.workspace.workspaceFolders[0];
		const packageJsonPath = path.join(workspaceFolder.uri.fsPath, 'package.json');
		if (fs.existsSync(packageJsonPath)) {
			try {
				const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
				if (packageJson.scripts) {
					for (const scriptName in packageJson.scripts) {
						allButtons.push({
							id: `npm-${scriptName}`,
							text: `$(play) ${scriptName}`,
							tooltip: `Run npm run ${scriptName}`,
							command: `npm run ${scriptName}`,
							alignment: 'right',
							priority: 0
						});
					}
				}
			} catch (error) {
				console.error('Error reading package.json:', error);
			}
		}
	}

	const terminals: Map<string, vscode.Terminal> = new Map();

	for (const button of allButtons) {
		const commandId = `run-all-apps.run.${button.id}`;
		const disposable = vscode.commands.registerCommand(commandId, () => {
			runCommand(button, terminals);
		});
		context.subscriptions.push(disposable);

		const statusBarItem = vscode.window.createStatusBarItem(
			button.alignment === 'left' ? vscode.StatusBarAlignment.Left : vscode.StatusBarAlignment.Right,
			button.priority || 0
		);
		statusBarItem.command = commandId;
		statusBarItem.text = button.text;
		if (button.tooltip) {
			statusBarItem.tooltip = button.tooltip;
		}
		statusBarItem.name = "open dev mode";
		if (button.color) {
			statusBarItem.color = button.color;
		}
		if (button.backgroundColor) {
			statusBarItem.backgroundColor = new vscode.ThemeColor(button.backgroundColor);
		}
		statusBarItem.show();
		context.subscriptions.push(statusBarItem);
	}

	// Listen for configuration changes
	vscode.workspace.onDidChangeConfiguration(event => {
		if (event.affectsConfiguration('runAllApps')) {
			vscode.window.showInformationMessage('Run All Apps configuration changed. Please reload the window to apply changes.');
		}
	}, null, context.subscriptions);
}

function runCommand(button: ButtonConfig, terminals: Map<string, vscode.Terminal>) {
	const reuse = button.reuseTerminal !== false;
	let terminal: vscode.Terminal;
	if (reuse) {
		const key = button.workingDirectory || 'default';
		if (!terminals.has(key)) {
			const options: vscode.TerminalOptions = {};
			if (button.workingDirectory) {
				options.cwd = button.workingDirectory;
			}
			terminals.set(key, vscode.window.createTerminal(options));
		}
		terminal = terminals.get(key)!;
	} else {
		const options: vscode.TerminalOptions = {};
		if (button.workingDirectory) {
			options.cwd = button.workingDirectory;
		}
		terminal = vscode.window.createTerminal(options);
	}

	terminal.show();
	if (button.workingDirectory && reuse) {
		// For reused terminal, cd if needed
		terminal.sendText(`cd "${button.workingDirectory}"`);
	}
	terminal.sendText(button.command);
}

// This method is called when your extension is deactivated
export function deactivate() {}
