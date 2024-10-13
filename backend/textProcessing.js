const { exec } = require('child_process');
const path = require('path');

const processText = (textPath, callback) => {
    const scriptPath = path.join(__dirname, '../scripts/process_text.py');
    exec(`python ${scriptPath} ${textPath}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error processing text: ${error}`);
            return;
        }
        callback(stdout);
    });
};

module.exports = { processText };
