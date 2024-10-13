const { exec } = require('child_process');
const path = require('path');

const extractText = (pdfPath, callback) => {
    const scriptPath = path.join(__dirname, '../scripts/extract_text.py');
    exec(`python ${scriptPath} ${pdfPath}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error extracting text: ${error}`);
            return;
        }
        callback(stdout);
    });
};

module.exports = { extractText };
