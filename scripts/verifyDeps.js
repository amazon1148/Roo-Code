const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function verifyEnvironment(directory) {
    try {
        // Step 1: Locate the ESLint configuration file (.eslintrc.js)
        let eslintConfigPath;
const configJs = path.join(directory, '.eslintrc.js');
const configJson = path.join(directory, '.eslintrc.json');
try {
    fs.accessSync(configJs, fs.constants.F_OK);
    eslintConfigPath = configJs;
} catch (err) {
    fs.accessSync(configJson, fs.constants.F_OK);
    eslintConfigPath = configJson;
}
        fs.accessSync(eslintConfigPath, fs.constants.F_OK);
        console.log("Found ESLint configuration file at", eslintConfigPath);

        // Step 2: Verify that eslint-config-react-app is installed
        const npmListOutput = execSync('npm list --depth 0', { cwd: directory, encoding: 'utf8' });
        if (!npmListOutput.includes('eslint-config-react-app')) {
            console.log('Warning: eslint-config-react-app is not listed as a direct dependency.');
        } else {
            console.log("eslint-config-react-app is installed.");
        }

        // Step 3: Run the lint commands in isolation

        // 3a. Run root lint check
        console.log("Running root lint check:");
        const rootLint = execSync('eslint src --ext ts', { encoding: 'utf8' });
        console.log("Root lint output:");
        console.log(rootLint);

        // 3b. Run webview lint check
        console.log("Running webview lint check:");
        const webviewLint = execSync('npm run lint', { cwd: directory, encoding: 'utf8' });
        console.log("Webview lint output:");
        console.log(webviewLint);
    } catch (error) {
        console.error('Verification failed:', error.message);
        process.exit(1);
    }
}

verifyEnvironment('./webview-ui/');
