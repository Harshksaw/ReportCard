// controllers/reportController.js
const path = require("path");
const fs = require("fs");
const htmlPdf = require("html-pdf-node");
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

async function generateReportCardPDF(dbData) {
  const data = dbData;
  data.logo =
    "https://th.bing.com/th/id/OIP.4lkXDSyrWbwbMaksrBRfXwHaFg?w=219&h=180&c=7&r=0&o=5&pid=1.7";

    const reportCardHtml = ` <style>
    .report-card {
      width: 1000px; /* Square box dimension */
      height: 90%; /* Square box dimension */
      padding: 20px; /* Padding for the square box */
      display: flex;
      flex-direction: column;
      justify-content: center;
      background-color: #b8d3ef;
      border: 5px solid #000;
      border-style: double;
      -webkit-print-color-adjust: exact;
    }

    .report-card table {
      width: 100%;
      height: auto;
      border: 2px solid #000;
      border-spacing: 0;
      align-self: center;
    }

    .report-card th, .report-card td {
      border: 1px solid #000;
      padding: 10px;
    }

    .report-card th {
      background-color: #D9D9D9 !important;
      color: #000 !important;
      font-weight: bold;
    }

    .header-box, .info-box {
      padding: 10px;
      margin-bottom: 20px;
      text-align: center;
      border: 1px solid #000;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      gap: 20px;
    }

    .info-box {
      background-color: #D9D9D9;
      border: 1px solid #000;
      display: flex;
      justify-content: space-between;
    }

    .info-box .column {
      width: 48%;
    }

    .data-details {
      width: 100%;
    }

    .data-details td {
      font-size: 14px;
      font-weight: 600;
      text-align: center;
    }

    .data-details th {
      font-size: 18px;
    }

    .white {
      background-color: #D9D9D9;
    }

    table.maintable {
      background-color: white;
    }

    table.maintable td{
    text-align:center
    }

    .back {
      background-color: #fff;
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
      margin: 2px;
    }

    .spacing {
      margin-bottom: 10px;
    }

    .column p {
      font-size: 20px;
      font-weight: 600;
      text-align: center;
    }

    .per {
      width: 40px;
    }
      .comments{
       display: block; /* Ensures each comment is on a separate line */
  margin-bottom: 5px; /

  text-align: center;
      }
      .items{

  text-align: center;
      }
  .arabic-text {
  font-family: 'Amiri', serif;
  color: rgba(0, 0, 0, 0.5); /* Adjust the transparency as needed */
}
  .litt{

  font-family: 'Amiri', serif;
  color: rgba(0, 0, 0, 0.5); /* Adjust the transparency as needed */
}
  </style>

  <div class="report-card">
    <div class="header-box back">
      <div style="font-size: 20px; font-weight: bold; display: flex; flex-direction: row; gap: 2">
        <ul>
          <li class="spacing">KINGDOM OF SAUDI ARABIA</li>
          <li class="spacing">Ministry of Education</li>
          <li class="spacing">${data?.university || "Najran University"}</li>
          <li class="spacing">Faculty of Dentistry</li>
        </ul>
      </div>
      <img src="${data.logo}" alt="University Logo" style="width: 160px; height: 150px;">
      <div style="font-size: 20px; font-weight: bold; display: flex; flex-direction: row; gap: 2">
        <ul>
          <li class="spacing litt ">المملكة العربية السعودية</li>
          <li class="spacing litt">وزارة التعليم</li>
          <li class="spacing litt">جامعة نجران</li>
          <li class="spacing litt">كلية طب الأسنان</li>
        </ul>
      </div>
    </div>
    <div class="info-box back">
      <div class="column">
        <p>Course Name : ${data.name}</p>
        <p>Level : ${data.level}</p>
        <p>Credit Hours : ${data.creditHours}</p>
      </div>
      <div class="column">
        <p>Course Code : ${data.courses.code}</p>
        <p>Semester : ${data.semester}</p>
        <p>Course Coordinator : ${data.courseCoordinator}</p>
      </div>
    </div>
    <div class="items-table">
      <table class="maintable">
        <tr>
          <th class="white" style="width: 5%;">Serial No.</th>
          <th class="white" style="width: 15%;">Item Category</th>
          <th style="width: 25%;">Question No</th>
          <th style="width: 5%;">Total Questions</th>
          <th class="per" style="width: 5%;">%</th>
          <th style="width: 40%;">Comments/Recommendation</th>
        </tr>
        ${data.items
          .map((item, index) => {
            let comments = "";

            if (item.numberOfItems > 0) {
              if (item.category === "Poor (Bad) Questions") {
                comments = `
                  ● Discrimination value of this items are negative in value.
                  ● Discrimination value of this items are less than 0.20
                  ● All the items should be rejected.
                `;
              } else if (item.category === "Very Difficult Question") {
                comments = `
                  ● Keys of these items are needed to be checked.
                  ● Items should be rejected.
                `;
              } else if (item.category === "Difficult Question") {
                comments = `
                  ● Key of this item is also needed to be checked.
                `;
              } else if (item.category === "Good Question") {
                comments = `
                  ● Discrimination value of first raw items is accepted good.
                  ● Items could be stored in question bank for further use.
                `;
              } else if (item.category === "Easy Question") {
                comments = `
                  ● Item should be revised before re-use.
                `;
              } else if (item.category === "Very Easy Question") {
                comments = `
                  ● Items should be rejected or needed to be revised.
                `;
              } else {
                comments = `
                  ● No specific comments available.
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
                  <td colspan="3" style="white-space: nowrap; background-color: #f4e2dd; min-width: 160px; max-width: 160px; font-size: 16px; font-weight: 600; text-align: center;">KR20 = ${item.numberOfItems}</td>
                  <td class="white comments">● ${comments}</td>
                </tr>
              `;
            } else {
              return `
                <tr>
                  <td class="white">${index + 1}</td>
                  <td class="white">${item.category}</td>
                  <td style="word-wrap: break-word; min-width: 160px; max-width: 160px;">
                    ${item.items.map((subItem) => `<span class="spac">${subItem}</span>`).join(",")}
                  </td>
                  <td class="items">${item.numberOfItems > 0 ? item.numberOfItems : " "}</td>
                  <td>${item.percentage}</td>
                  <td class="comments">${comments}</td>
                </tr>
              `;
            }
          })
          .join("")}
      </table>
    </div>
    <div class="data-details maintable" style="margin-top: 20px;">
      <table class="bottom">
        <tr>
          <th>Course Code</th>

          <th>Students Attended</th>
          <th>Students Passed</th>
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
          <td>${data.courses.code}</td>

          <td>${data.courses.studentsAttended}</td>
          <td>${data.courses.studentsPassed.number}</td>
          <td>${data.courses.grades.APlus.number.toFixed(0)}</td>
          <td>${data.courses.grades.A.number.toFixed(0)}</td>
          <td>${data.courses.grades.BPlus.number.toFixed(0)}</td>
          <td>${data.courses.grades.B.number.toFixed(0)}</td>
          <td>${data.courses.grades.CPlus.number.toFixed(0)}</td>
          <td>${data.courses.grades.C.number.toFixed(0)}</td>
          <td>${data.courses.grades.DPlus.number.toFixed(0)}</td>
          <td>${data.courses.grades.D.number.toFixed(0)}</td>
          <td>${data.courses.grades.F.number.toFixed(0)}</td>
        </tr>
        <tr class="roww">
          <td colspan="4"></td>
          <td>${data.courses.studentsPassed.percentage}%</td>
          <td>${data.courses.grades.APlus.percentage.toFixed(0)}%</td>
          <td>${data.courses.grades.A.percentage.toFixed(0)}%</td>
          <td>${data.courses.grades.BPlus.percentage.toFixed(0)}%</td>
          <td>${data.courses.grades.B.percentage.toFixed(0)}%</td>
          <td>${data.courses.grades.CPlus.percentage.toFixed(0)}%</td>
          <td>${data.courses.grades.C.percentage.toFixed(0)}%</td>
          <td>${data.courses.grades.DPlus.percentage.toFixed(0)}%</td>
          <td>${data.courses.grades.D.percentage.toFixed(0)}%</td>
          <td>${data.courses.grades.F.percentage.toFixed(0)}%</td>
        </tr>
      </table>
    </div>
  </div>
  `;

  const options = { format: "A4" };
  const file = { content: reportCardHtml };

  try {
    const pdfBuffer = await htmlPdf.generatePdf(file, options);
    const pdfPath = path.join(
      __dirname,
      "../reports",
      `${data?.name?.replace(/\s+/g, "_")}_ReportCard.pdf`
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
      percentage: percentage.toFixed(0), // Optional: format percentage to 2 decimal places
    });
    console.log(
      `Category: ${category}, Number of Items: ${numberOfItems}, Percentage: ${percentage.toFixed(
        0
      )}%`
    );
  });

  result.push({
    category: "Reliability",
    numberOfItems: data?.kr20, // Replace "value" with the actual KR2 value
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
    name: data.className,

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
  console.log("🚀 ~ getDbData ~ dbData:", dbData);

  return res.status(200).json({
    data: dbData,
  });
}

module.exports = { generatePdf, getDbData };
