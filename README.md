# Run All Apps

One-click buttons in the status bar to launch dev commands like npm run dev, npm start, or any custom shell command.

## Features

- Add buttons via VS Code settings or config file
- Customize display text or icon, tooltip, command to run
- Control alignment (left/right), color, priority/order
- Terminal behavior: reuse or open new terminal; working directory support
- Configuration reflects immediately (no VS Code restart required)
- Optional: automatically load npm scripts from package.json

## Requirements

- VS Code 1.103.0 or higher

## Extension Settings

This extension contributes the following settings:

* `runAllApps.buttons`: Array of button configurations. Each button object has:
  - `id`: Unique identifier
  - `text`: Display text (can include icons like `$(play)`)
  - `tooltip`: Hover tooltip
  - `command`: Shell command to execute
  - `alignment`: "left" or "right" (default: "right")
  - `priority`: Number for ordering (default: 0)
  - `color`: Text color
  - `backgroundColor`: Background color (theme color name)
  - `reuseTerminal`: Boolean to reuse terminal (default: true)
  - `workingDirectory`: Relative path for command execution

* `runAllApps.loadNpmScripts`: Boolean to auto-load npm scripts from package.json (default: false)

## Usage

1. Install the extension
3. In the new window, open settings (Ctrl+,) and search for "Run All Apps"
3. Search for "Run All Apps"
4. Configure the `runAllApps.buttons` array with your desired commands
5. Optionally enable `runAllApps.loadNpmScripts` to auto-add npm scripts
6. Buttons will appear in the status bar
7. Click a button to run the command in a terminal

## Example Configuration

```json
{
  "devCommandButtons.buttons": [
    {
      "id": "dev",
      "text": "$(play) Dev",
      "tooltip": "Start development server",
      "command": "npm run dev",
      "alignment": "right",
      "priority": 10,
      "reuseTerminal": true
    },
    {
      "id": "build",
      "text": "$(tools) Build",
      "tooltip": "Build the project",
      "command": "npm run build",
      "alignment": "right",
      "priority": 5
    }
  ],
  "devCommandButtons.loadNpmScripts": true
}
```

## Known Issues

- Configuration changes require window reload to apply (VS Code limitation for status bar items)

## Release Notes

### 0.0.1

Initial release with basic status bar button functionality.

## Following extension guidelines

Ensure that you've read through the extensions guidelines and follow the best practices for creating your extension.

* [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)

## Working with Markdown

You can author your README using Visual Studio Code. Here are some useful editor keyboard shortcuts:

* Split the editor (`Cmd+\` on macOS or `Ctrl+\` on Windows and Linux).
* Toggle preview (`Shift+Cmd+V` on macOS or `Shift+Ctrl+V` on Windows and Linux).
* Press `Ctrl+Space` (Windows, Linux, macOS) to see a list of Markdown snippets.

## For more information

* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
* [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy!**
