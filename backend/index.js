const express = require("express");
const multer = require("multer");
const { extractText } = require("./pdfExtraction");
const { processText } = require("./textProcessing");
const cors = require("cors");
const fs = require("fs");
const ExcelJS = require("exceljs");

const app = express();
const upload = multer({ dest: "data/" });

app.use(cors());
app.post("/upload", upload.single("pdf"), (req, res) => {
  const pdfPath = req.file.path;
  extractText(pdfPath, async (textOutput) => {
    processText("data/extracted_text.txt", (processedOutput) => {
      fs.readFile("../data/extracted_text.txt", "utf8", async (err, data) => {
        if (err) {
          console.error("Error reading the file:", err);
          return;
        }
        const extractedData = cleanAndExtractData(data);
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("SEC 13F Data");
        worksheet.columns = [
          { header: "CUSIP_NO", key: "cusip_no" },
          { header: "ISSUER NAME", key: "issuer_name" },
          { header: "ISSUER_DESCRIPTION", key: "issuer_description" },
          { header: "STATUS", key: "status" },
        ];
        worksheet.addRows(extractedData);
        // console.log(extractedData);
        const outputPath = "output.xlsx";
        await workbook.xlsx.writeFile(outputPath);
      });
      res.send("Processing complete!");
    });
  });
});

function cleanAndExtractData(text) {
  let lines = text
    .split("\r")
    .filter(
      (line) =>
        line.trim() !== "" &&
        line.length > 3 &&
        !(
          line.substring(0, 6).includes("**") ||
          line.substring(0, 8).includes("CUSIP") ||
          line.substring(0, 8).includes("ISSUER") ||
          line.substring(0, 8).includes("STATUS")
        )
    );
  lines = lines.map((line) => line.substring(1));
  console.log(lines);
  let cnt = 0;
  let dataArray = [];
  let flag = false;
  let entry = null;
  lines.forEach((line) => {
    const regex = /\b[A-Z0-9]{6} \b[A-Z0-9]{2} \d{1}\b/g;
    if (regex.test(line)) {
      if (entry) {
        // console.log(entry);
        dataArray.push(entry);
      }
      entry = {
        cusip_no: line.replace(/\s+/g, ""),
        issuer_name: "",
        issuer_description: "",
        status: "",
      };
      cnt = 0;
      flag = true;
    } else if (flag) {
      cnt++;
      switch (cnt) {
        case 1:
          entry.issuer_name = line;
          break;
        case 2:
          entry.issuer_description = line;
          break;
        case 3:
          const statusMatch = line.match(/(ADDED|DELETED)/);
          entry.status = statusMatch ? statusMatch[0] : "";
          break;
        default:
          break;
      }
    }
  });
  // console.log(dataArray);
  const resultArray = [];
  let tempObj = {};

  dataArray.forEach((item) => {
    // Merge the current item into the temporary object
    Object.assign(tempObj, item);

    // When we find a `cusip_no`, we consider the group complete
    if (item.cusip_no) {
      resultArray.push(tempObj);
      tempObj = {}; // Reset for the next group
    }
  });
  return resultArray;
}
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
