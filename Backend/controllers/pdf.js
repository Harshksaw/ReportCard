// controllers/reportController.js
const path = require("path");
const fs = require("fs");
const puppeteer = require("puppeteer");
const fse = require('fs-extra');

const Docker = require('dockerode');

const Class = require("../models/excelmodel");

function getReliabilityDescription(score) {
  if (score > 0.9) {
    return "Excellent reliability, at the level of the best standardized tests.";
  }
  if (score >= 0.85 && score <= 0.9) {
    return "Exam seems to be Very good and reliable.";
  }
  if (score >= 0.8 && score <= 0.84) {
    return "Exam seems to be Good and reliable.";
  }
  if (score >= 0.71 && score <= 0.79) {
    return "Values lies betweeen the marginally acceptable ranges.There are probably a few items which could be improved";
  }
  if (score >= 0.61 && score <= 0.7) {
    return "Somewhat low. This test should be supplemented by other  measures for grading";
  }
  if (score >= 0.51 && score <= 0.6) {
    return "Value Suggests need for revision of the test. The test definitely need to be supplemented by other measures for grading";
  }
  if (score <= 0.5) {
    return "Questionable Reliability . The test should not contribute heavily to the course grade, and it needs revision";
  }
}
function parseInputString(input) {
  let numbers = [];
  let parts = input.split(' ').map(part => part.trim());

  parts.forEach(part => {
    if (part.includes('-')) {
      let [start, end] = part.split('-').map(Number);
      for (let i = start; i <= end; i++) {
        numbers.push(i);
      }
    } else {
      numbers.push(Number(part));
    }
  });

  return numbers;
}


function parseInputString(input) {
  let numbers = [];
  let parts = input.split(',').map(part => part.trim());

  parts.forEach(part => {
    if (part.includes('-')) {
      let [start, end] = part.split('-').map(Number);
      for (let i = start; i <= end; i++) {
        numbers.push(i);
      }
    } else {
      numbers.push(Number(part));
    }
  });

  return numbers;
}


function formatNumberRanges(numbers) {
  // Sort the numbers
  numbers.sort((a, b) => a - b);

  let ranges = [];
  let start = numbers[0];
  let end = numbers[0];

  for (let i = 1; i < numbers.length; i++) {
    if (numbers[i] === end + 1) {
      end = numbers[i];
    } else {
      if (end - start >= 2) {
        ranges.push(`${start}-${end}`);
      } else {
        for (let j = start; j <= end; j++) {
          ranges.push(`${j}`);
        }
      }
      start = numbers[i];
      end = numbers[i];
    }
  }

  // Add the last range
  if (end - start >= 2) {
    ranges.push(`${start}-${end}`);
  } else {
    for (let j = start; j <= end; j++) {
      ranges.push(`${j}`);
    }
  }

  return ranges.join(", ");
}

async function generateReportCardPDF(dbData) {
  // console.log("🚀 ~ generateReportCardPDF ~ dbData:", dbData.academicYear);
  const data = dbData;




  

  
 


  const reportCardHtml = ` <style>
   .report-card {
  width: 1000px;
  height: 90%;
  padding: 10px 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: #b8d3ef;
  border: 6px solid #1C4A7A;
}

.report-card table {
  width: 100%;
  height: auto;
border-collapse: collapse;
  border: 2px solid #000; /* Add this line to set the border color to black */
  align-self: center;
}

.report-card th, .report-card td {
  border: 2px solid #000; /* Ensure borders are visible */
  padding: 4px;
  text-align: left;
  font-size: 12px;
}

.report-card th {
  background-color: #D9D9D9 !important;
  color: #000 !important;
  font-weight: bold;
  border: 2px solid #000;
}

.header-box, .info-box {
  text-align: center;
  background-color: #fff;
  border: 1px solid #000;
  height: 80px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.info-box {
  padding: 20px;
  background-color: #f9f9f9;
  flex-direction: column;
  border: 1px solid #ddd;
  border-radius: 5px;
border-collapse: collapse;
}

.row {
  display: flex;
  width: 100%;
  flex-direction: row;
  margin-bottom: 10px;
}

.column {
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  padding: 10px;
}

.column p {
  margin: 0;
  padding: 5px 0;
}

.info-box .column {
  width: 48%;
}

.data-details {
  width: 100%;
}

.data-details td {
  font-size: 10px; /* Reduced font size */
  font-weight: 400;
  text-align: center;
}

.data-details th {
  font-size: 16px;
}

.white {
  background-color: #e7e4e4;
}

table.maintable {
  background-color: white;
  height: 60%;
  border: 2px solid #000;
border-collapse: collapse;
}

table.maintable td {
  text-align: center;
  font-size: 12px; /* Adjusted font size */
}

table.maintable th {
  border: 2px solid #000;
border-collapse: collapse;
  font-size: 16px;
  text-align: center;
}

ul {
  list-style-type: none;
}

.bottom {
  width: 90%;
}

.bottom tr td {
  background-color: #fff;
}

.roww {
  background-color: #fff;
}

.spac {
  margin: 0px 1px 0 1px;
}

.spacing {
  margin-bottom: 2px;
}

.column p {
  font-size: 14px;
  font-weight: bold; /* Corrected font-weight */
  text-align: center;
}

.per {
  width: 40px;
}

.comments {
  text-align: center;
}

.items {
  text-align: center;
}

.arabic-text {
  font-family: 'Amiri', serif;
  color: rgba(0, 0, 0, 0.5); /* Adjust the transparency as needed */
}

.litt {
  font-family: 'Amiri', serif;
  color: rgba(0, 0, 0, 0.5); /* Adjust the transparency as needed */
}

.comments div {
  display: block; /* Ensures each comment is on a separate line */
  margin-bottom: 2px; /* Adds space between comments */
}

.roww td {
  text-align: center;
}

.rowe td {
  text-align: center;
  padding: 2px 0px 5px 10px;
}

.cred {
  position: absolute;
  bottom: 10px; /* Adjust this value as needed */
  left: 50%;
  transform: translateX(-50%);
}

.bottom th {
  text-align: center;
}

.data-details {
  border: 2px solid #000;
border-collapse: collapse;
  margin-top: 20px;
}

.bottom th, .bottom td {
  flex-grow: 1;
  border: 1px solid ##c7bebe; /* Thin gray border for internal lines */
}

.items-table {
  margin-top: 0px;
  border: 2px solid black;
    border-collapse: collapse;
}
    .items-table th, .items-table td {
  border: 1px solid ##c7bebe; /* Thin gray border for internal lines */
}

.credits {
  font-size: 10px;
  font-weight: 50;
  color: #000 !important;
  margin-bottom: 0px; /* Adjust this value to control spacing */
  line-height: 1.1; /* Adjust this value to control line spacing */
}

.div-analysis-report {
  color: red;
  font-size: 16px;
  font-weight: bold;
  margin: 20px 0 0px 0;
}

.row p {
  font-weight: 600;
}
  </style>

<div class="report-card">
  <div class="header-box">
    <div style="font-size: 12px; font-weight: bold; gap: 5px;">
      <ul style="display: flex; flex-direction: column;">
        <li class="spacing">KINGDOM OF SAUDI ARABIA</li>
        <li class="spacing">Ministry of Education</li>
        <li class="spacing">${data?.university || "Najran University"}</li>
        <li class="spacing">Faculty of Dentistry</li>
      </ul>
    </div>
    <img src="https://res.cloudinary.com/dkijovd6p/image/upload/v1725480428/t50opxpqoofrimbd3yxi.png" alt="University Logo" style="width: 75px; height: 75px;">
    <img src="https://res.cloudinary.com/dkijovd6p/image/upload/t_hii/o3jtksywnmrppxs9o9yt.jpg" alt="University Logo" style="width: 125px; height: 75px;">
  </div>

  <div class="info-box back" style="padding: 15px; background-color: #e7e4e4; border: 1px solid #000; border-radius: 5px;">
    <div class="row" style="display: flex; flex-direction: row; justify-content: space-around; margin-bottom: 10px; text-align: center;">
      <p style="margin: 0; padding: 3px;">Course Name: ${data.name}</p>
      <p style="margin: 0; padding: 3px 0;">Course Code: ${data.courses.code} <span style="margin-left: 2px;">(${data?.gender?.toUpperCase()})</span></p>
      <p style="margin: 0; padding: 3px 0;">Credit Hours: ${data.creditHours}</p>
    </div>
    <div class="row" style="display: flex; flex-direction: row; justify-content: space-around; margin-bottom: 10px; text-align: left; padding-left:-15px">
      <p style="margin:0; padding: 0px 0;">Semester: ${data.semester} <span>(${data.academicYear})</span></p>
      <p style="margin: 0; padding: 3px 0;">Course Coordinator: ${data.courseCoordinator}</p>
      <p style="margin: 0; padding: 3px 0;">Level: ${data.level}</p>
    </div>
    <div class="row" style="display: flex; flex-direction: row; justify-content: center;">
      <p style="margin: 0; padding: 3px 0;">Department: ${data.department}</p>
    </div>
  </div>

<div class="div-analysis-report">Item Analysis Report</div>

    <div class="items-table">
      <table class="maintable">
        <tr>
          <th class="white" style="width: 5%;">S.No.</th>
          <th class="white" style="width: 12%;">Item Category</th>
          <th style="width: 35%;">Question No</th>
          <th style="width: 6%;">Total Questions</th>
          <th class="per" style="width: 7%;">%</th>
          <th style="width: 35%;">Comments/Recommendation</th>
        </tr>
        ${data.items
      .map((item, index) => {
        // let formattedString = "";
        // if (item.items) {
        //   formattedString = formatNumberRanges(Object.values(item.items));
        // }

        let comments = "";


        // const numbers = parseInputString(item.items);
        // const result = findRanges(numbers).joim(", ");

        if (item.numberOfItems > 0) {
          if (item.category === "Poor (Bad) Questions") {
            comments = `
                  <div>● Discrimination value of this items are negative in value.</div>
                  <div>● Discrimination value of this items are less than 0.20</div>
                  <div>● All the items should be rejected.</div>
                `;
          } else if (item.category === "Very Difficult Question") {
            comments = `
                  <div>● Keys of these items are needed to be checked.</div>
                  <div>● Items should be rejected.</div>
                `;
          } else if (item.category === "Difficult Question") {
            comments = `
                  <div>● Key of this item is also needed to be checked.</div>
                `;
          } else if (item.category === "Good Question") {
            comments = `
                  <div>● Discrimination value of first raw items is accepted good.</div>
                  <div>● Items could be stored in question bank for further use.</div>
                `;
          } else if (item.category === "Easy Question") {
            comments = `
                  <div>● Item should be revised before re-use.</div>
                `;
          } else if (item.category === "Very Easy Question") {
            comments = `
                  <div>● Items should be rejected or needed to be revised.</div>
                `;
          } else {
            comments = `
                  <div>● No specific comments available.</div>
                `;
          }
          if (item.category == "Reliability") {
            comments = getReliabilityDescription(item.numberOfItems);
          }
        }
        if (item.category === "Reliability") {
          return `
                <tr>
                  <td class="white">${index + 1}</td>
                  <td class="white">${item.category}</td>
                  <td colspan="3" style="white-space: nowrap; background-color:#f4e2dd; min-width: 160px; max-width: 160px; font-size: 12px; font-weight: 600; text-align: center;">KR20 = ${item.numberOfItems
            }</td>
                  <td class=" comments" style=" font-size: 12px; background-color:#f4e2dd; font-weight: 600;">${comments}</td>
                </tr>
              `;
        } else {
          return `
                <tr>
                  <td class="white">${index + 1}</td>
                  <td class="white">${item.category}</td>
                       <td style="word-wrap: break-word; min-width: 160px; max-width: 160px;">

    ${item.items
              .map((subItem) => `<span class="spac">${subItem}</span>`)
              .join(", ")}

</td>
                  <td class="items">${item.numberOfItems > 0 ? item.numberOfItems : " "
            }</td>
                  <td>${item.percentage > 0 ? item.percentage : " "}</td>
                  <td class="comments">${comments}</td>
                </tr>
              `;
        }
      })
      .join("")}
      </table>
    </div>
    <div class="data-details maint" style="margin-top: 10px;">
      <table class="bottom" >
        <tr>


          <th  style="width: 15%;">Students Attended</th>
          <th  style="width: 15%;">Students Pass</th>
          <th>A+</th>
          <th>A</th>
          <th>B+</th>
          <th>B</th>
          <th>C+</th>
          <th>C</th>
          <th>D+</th>
          <th>D</th>
          <th>F</th>
        </tr>
        <tr class="roww">


          <td>${data.courses.studentsAttended}</td>
          <td>${data.courses.studentsPassed.number}</td>
          <td>${data.courses.grades.APlus.number?.toFixed(0)}</td>
          <td>${data.courses.grades.A.number?.toFixed(0)}</td>
          <td>${data.courses.grades.BPlus.number?.toFixed(0)}</td>
          <td>${data.courses.grades.B.number?.toFixed(0)}</td>
          <td>${data.courses.grades.CPlus.number?.toFixed(0)}</td>
          <td>${data.courses.grades.C.number?.toFixed(0)}</td>
          <td>${data.courses.grades.DPlus.number?.toFixed(0)}</td>
          <td>${data.courses.grades.D.number?.toFixed(0)}</td>
          <td>${data.courses.grades.F.number?.toFixed(0)}</td>
        </tr>
        <tr class="rowe">
          <td colspan="1"></td>
          <td>${data.courses.studentsPassed.percentage}%</td>
          <td>${data.courses.grades.APlus.percentage?.toFixed(0)}%</td>
          <td>${data.courses.grades.A.percentage?.toFixed(0)}%</td>
          <td>${data.courses.grades.BPlus.percentage?.toFixed(0)}%</td>
          <td>${data.courses.grades.B.percentage?.toFixed(0)}%</td>
          <td>${data.courses.grades.CPlus.percentage?.toFixed(0)}%</td>
          <td>${data.courses.grades.C.percentage?.toFixed(0)}%</td>
          <td>${data.courses.grades.DPlus.percentage?.toFixed(0)}%</td>
          <td>${data.courses.grades.D.percentage?.toFixed(0)}%</td>
          <td>${data.courses.grades.F.percentage?.toFixed(0)}%</td>
        </tr>
      </table>
    </div>

    <div class="cred">
  <h6 class ="credits">
  Prepared By: Dr Siraj Khan<br>
  PhD, MDS Pediatric Dentistry
</h6>


  </div>
  

  </div>
  `;
  var options = { format: "Letter" };

  const file = { content: reportCardHtml };

  try {
    const browser = await puppeteer.launch({
      args: [
        "--disable-setuid-sandbox",
        "--no-sandbox",
        "--single-process",
        "--no-zygote",
      ],
      executablePath:
        process.env.NODE_ENV === "production"
          ? process.env.PUPPETEER_EXECUTABLE_PATH
          : puppeteer.executablePath(),
    });
    const page = await browser.newPage();
    await page.setContent(reportCardHtml, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      landscape: true, // Set the orientation to landscape
      printBackground: true,
      margin: {
        // top: '10mm',
        right: "10mm",
        // bottom: '10mm',
        left: "10mm",
      },
    });

    await browser.close();

    const pdfPath = path.join(
      __dirname,
      "../reports",
      `${data?.name?.replace(/\s+/g, "")}ReportCard.pdf`
    );

    // Ensure the directory exists
    fs.mkdirSync(path.dirname(pdfPath), { recursive: true });

    fs.writeFileSync(pdfPath, pdfBuffer);
    console.log(`PDF generated: ${pdfPath}`);
    return pdfPath;
  } catch (err) {
    console.error("Error generating PDF:", err);
    return { error: err.message };
  }
}
const docker = new Docker();
const getContainerStats = async () => {
  const containers = await docker.listContainers();
  const stats = await Promise.all(containers.map(async (containerInfo) => {
    const container = docker.getContainer(containerInfo.Id);
    const statsStream = await container.stats({ stream: false });
    return {
      id: containerInfo.Id,
      name: containerInfo.Names[0],
      cpuUsage: statsStream.cpu_stats.cpu_usage.total_usage,
      memoryUsage: statsStream.memory_stats.usage,
      memoryLimit: statsStream.memory_stats.limit,
      networkIO: statsStream.networks,
    };
  }));
  return stats;
};
const reportsFolderPath = path.join(__dirname, '../reports');
const deleteAll =async()=>{
  try {
    // Ensure the reports folder exists
    await fse.ensureDir(reportsFolderPath);

    // Get stats before cleaning
    const statsBefore = await getFolderStats(reportsFolderPath);

    // Get container stats before cleaning
    const containerStatsBefore = await getContainerStats();

    // Empty the reports folder
    await fse.emptyDir(reportsFolderPath);

    // Get stats after cleaning
    const statsAfter = await getFolderStats(reportsFolderPath);

    // Get container stats after cleaning
    const containerStatsAfter = await getContainerStats();

    res.status(200).json({
      message: 'Reports folder cleaned successfully.',
      statsBefore,
      statsAfter,
      containerStatsBefore,
      containerStatsAfter
    });
  } catch (error) {
    console.error('Error cleaning reports folder:', error);
    res.status(500).send('Failed to clean reports folder.');
  }
}
async function generatePdf(req, res) {
  try {
    const { id } = req.params;
    const data = await Class.findById(id).populate("students");

    let items;
    let numberOfItems;
    let percentage;

    const result = [];
    var total = 0;

    Object.keys(data.questionSummary).forEach((category) => {
      const items = data.questionSummary[category];
      console.log("🚀 ~ Object.keys ~ items:", items);
      const numberOfItems = items.length;
      total += numberOfItems;
      const percentage = (numberOfItems / data.questionAnalysis.length) * 100;
      result.push({
        items,
        category,
        numberOfItems,
        percentage: percentage.toFixed(0), // Optional: format percentage to 2 decimal places
      });
      console.log(
        `Category: ${category}, Number of Items: ${numberOfItems}, Percentage: ${percentage.toFixed(
          0
        )}%`
      );
    });
    const updateData = {
      questionAnalysisData: {}
    };

    result.forEach((item) => {
      updateData.questionAnalysisData[item.category] = {
        number: item.numberOfItems,
        percentage: item.percentage
      };
    });
    const totalQuestions = 
    (updateData.questionAnalysisData["Difficult Question"]?.number || 0) +
    (updateData.questionAnalysisData["Good Question"]?.number || 0) +
    (updateData.questionAnalysisData["Easy Question"]?.number || 0) +
    (updateData.questionAnalysisData["Poor (Bad) Questions"]?.number || 0) +
    (updateData.questionAnalysisData["Very Difficult Question"]?.number || 0) +
    (updateData.questionAnalysisData["Very Easy Question"]?.number || 0);

  // Calculate Total Accepted
  const totalAcceptedNumber = 
    (updateData.questionAnalysisData["Difficult Question"]?.number || 0) +
    (updateData.questionAnalysisData["Good Question"]?.number || 0) +
    (updateData.questionAnalysisData["Easy Question"]?.number || 0);

  const totalAcceptedPercentage = totalQuestions > 0 ? 
    (totalAcceptedNumber / totalQuestions) * 100 : 0;

  // Calculate Total Rejected
  const totalRejectedNumber = 
    (updateData.questionAnalysisData["Poor (Bad) Questions"]?.number || 0) +
    (updateData.questionAnalysisData["Very Difficult Question"]?.number || 0) +
    (updateData.questionAnalysisData["Very Easy Question"]?.number || 0);

  const totalRejectedPercentage = totalQuestions > 0 ? 
    (totalRejectedNumber / totalQuestions) * 100 : 0;

  // Set the calculated values
  updateData.questionAnalysisData["Total Accepted"] = {
    number: totalAcceptedNumber,
    percentage: totalAcceptedPercentage
  };
  updateData.questionAnalysisData["Total Rejected"] = {
    number: totalRejectedNumber,
    percentage: totalRejectedPercentage
  };

  

    await Class.findByIdAndUpdate(id, updateData, { new: true });
    result.push({
      category: "Reliability",
      numberOfItems: data.kr20.toFixed(2), // Replace "value" with the actual KR2 value
    });

    let passedCount =
      data.FinalGrade.APlus.number +
      data.FinalGrade.A.number +
      data.FinalGrade.BPlus.number +
      data.FinalGrade.B.number +
      data.FinalGrade.CPlus.number +
      data.FinalGrade.C.number +
      data.FinalGrade.DPlus.number +
      data.FinalGrade.D.number;
    let failedCount = +data.FinalGrade.F.number;
    let totalStudents = passedCount + failedCount;

    const dbData = {
      college: data.college,
      university: data.university,
      name: data.nameOfCourse,
      gender: data.gender,
      academicYear: data.academicYear,
      department: data.department,

      level: data.level,

      creditHours: data.creditHours,
      grade: data.grade,
      average: data.average,

      courseCoordinator: data.courseCoordinator,

      semester: data.semester,
      items: result,
      courses: {
        code: data.courseCode,
        creditHour: data.creditHours,
        studentsNumber: totalStudents || "-",

        studentsAttended: totalStudents,
        studentsPassed: {
          number: passedCount ? passedCount : "-",
          percentage: ((passedCount / totalStudents) * 100).toFixed(0),
        },
        grades: {
          APlus: {
            number: data.FinalGrade.APlus.number,
            percentage: data.FinalGrade.APlus.percentage,
          },
          A: {
            number: data.FinalGrade.A.number,
            percentage: data.FinalGrade.A.percentage,
          },
          BPlus: {
            number: data.FinalGrade.BPlus.number,
            percentage: data.FinalGrade.BPlus.percentage,
          },
          B: {
            number: data.FinalGrade.B.number,
            percentage: data.FinalGrade.B.percentage,
          },
          CPlus: {
            number: data.FinalGrade.CPlus.number,
            percentage: data.FinalGrade.CPlus.percentage,
          },
          C: {
            number: data.FinalGrade.C.number,
            percentage: data.FinalGrade.C.percentage,
          },
          DPlus: {
            number: data.FinalGrade.DPlus.number,
            percentage: data.FinalGrade.DPlus.percentage,
          },
          D: {
            number: data.FinalGrade.D.number,
            percentage: data.FinalGrade.D.percentage,
          },
          F: {
            number: data.FinalGrade.F.number,
            percentage: data.FinalGrade.F.percentage,
          },
        },
      },
    };
    console.log("🚀 ~ generatePdf ~ dbData:", dbData);

    const pdfPath = await generateReportCardPDF(dbData);

    if (pdfPath.error) {
      // Handle error from generateReportCardPDF
      return res
        .status(500)
        .json({ message: "Error generating PDF", error: pdfPath.error });
    }

    // Send the generated PDF file as a response
    res.download(pdfPath, `${data.courseCode}_Item_Analysis_Report.pdf`);
  } catch (err) {
    // Catch unexpected errors
    console.error("Unexpected error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Function to create dbData
async function getDbData(req, res) {
  const { id } = req.params;
  const data = await Class.findById(id);

  let items;
  let numberOfItems;
  let percentage;

  const result = [];
  var total = 0;

  Object.keys(data.questionSummary).forEach((category) => {
    const items = data.questionSummary[category];
    console.log("🚀 ~ Object.keys ~ items:", items);
    const numberOfItems = items.length;
    total += numberOfItems;
    const percentage = (numberOfItems / data.questionAnalysis.length) * 100;
    result.push({
      items,
      category,
      numberOfItems,
      percentage: percentage?.toFixed(0), // Optional: format percentage to 2 decimal places
    });
    console.log(
      `Category: ${category}, Number of Items: ${numberOfItems}, Percentage: ${percentage?.toFixed(
        0
      )}%`
    );
  });

  result.push({
    category: "Reliability",
    numberOfItems: data?.kr20.toFixed(2), // Replace "value" with the actual KR2 value
  });

  let passedCount =
    data.FinalGrade.APlus.number +
    data.FinalGrade.A.number +
    data.FinalGrade.BPlus.number +
    data.FinalGrade.B.number +
    data.FinalGrade.CPlus.number +
    data.FinalGrade.C.number +
    data.FinalGrade.DPlus.number +
    data.FinalGrade.D.number;
  let failedCount = +data.FinalGrade.F.number;
  let totalStudents = passedCount + failedCount;



  const dbData = {
    college: data.college,
    university: data.university,
    name: data.nameOfCourse,
    academicYear: data.academicYear,

    level: data.level,

    creditHours: data.creditHours,
    grade: data.grade,
    average: data.average,

    courseCoordinator: data.courseCoordinator,

    semester: data.semester,
    items: result,
    courses: {
      code: data.courseCode,
      creditHour: data.creditHours,
      studentsNumber: totalStudents,

      studentsAttended: data.studentsAttended ? data.studentsAttended : "-",
      studentsPassed: {
        number: passedCount ? passedCount : "-",
        percentage: ((passedCount / totalStudents) * 100)?.toFixed(0),
      },
      grades: {
        APlus: {
          number: data.FinalGrade.APlus.number,
          percentage: data.FinalGrade.APlus.percentage,
        },
        A: {
          number: data.FinalGrade.A.number,
          percentage: data.FinalGrade.A.percentage,
        },
        BPlus: {
          number: data.FinalGrade.BPlus.number,
          percentage: data.FinalGrade.BPlus.percentage,
        },
        B: {
          number: data.FinalGrade.B.number,
          percentage: data.FinalGrade.B.percentage,
        },
        CPlus: {
          number: data.FinalGrade.CPlus.number,
          percentage: data.FinalGrade.CPlus.percentage,
        },
        C: {
          number: data.FinalGrade.C.number,
          percentage: data.FinalGrade.C.percentage,
        },
        DPlus: {
          number: data.FinalGrade.DPlus.number,
          percentage: data.FinalGrade.DPlus.percentage,
        },
        D: {
          number: data.FinalGrade.D.number,
          percentage: data.FinalGrade.D.percentage,
        },
        F: {
          number: data.FinalGrade.F.number,
          percentage: data.FinalGrade.F.percentage,
        },
      },
    },
  };
  console.log("🚀 ~ generatePdf ~ dbData:", dbData);
  console.log("🚀 ~ getDbData ~ dbData:", dbData);

  return res.status(200).json({
    data: dbData,
  });
}

module.exports = { generatePdf, getDbData ,deleteAll};
