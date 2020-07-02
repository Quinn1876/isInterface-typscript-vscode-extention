/**
 * isInterface Vscode Extension
 * By: Quinn Hodges
 *
 * This is my first Vscode Extension so I will be using
 * other source code for reference:
 * https://github.com/quicktype/quicktype-vscode/blob/master/src/extension.ts
 * https://github.com/ue/alphabetical-sorter
 */

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "isinterface" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('isinterface.isInterface', () => {
		// The code you place here will be executed every time your command is executed
    const editor = vscode.window.activeTextEditor;
    const lines = [];

    if (editor){
      let indentation: string;
      if (editor.options.insertSpaces) {
          const tabSize = editor.options.tabSize as number;
          indentation = " ".repeat(tabSize);
      } else {
          indentation = "\t";
      }

      const selection = editor.selection;
      if (selection) {
        const startPoint = selection.start.line;
        const endPoint = selection.end.line;
        const isSingleLine = selection.isSingleLine;

        // interface is not a single Line
        if (isSingleLine) {
          return;
        }

        // pull the selected interface into memory
        for (let i = startPoint; i <= endPoint; i++) {
          lines.push(editor.document.lineAt(i).text);
        }

        const interfaceName = lines[0].replace(/ *interface +/, '').replace(/ *{/, '');
        const fields = [];
        for(let i = 1; i < lines.length - 1; i++) {
          // extract field names
          fields.push(lines[i].split(':')[0].trimLeft())
        }

        const isInterfaceLines: string[] = [];
        isInterfaceLines.push(`function is${interfaceName}(object: any): object is ${interfaceName} {`);
        isInterfaceLines.push(`${indentation}return (`);
        fields.forEach((field, fieldIndex) => isInterfaceLines.push(`${indentation}${indentation}${fieldIndex > 0 ? '&& ' : ''}'${field}' in object`));
        isInterfaceLines.push(`${indentation})`);
        isInterfaceLines.push('};');
        isInterfaceLines.push('');

        editor.edit(editBuilder => {
          editBuilder.insert(
            new vscode.Position(startPoint, 0),
            isInterfaceLines.join('\n'),
          );
        });
      }
    }
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
