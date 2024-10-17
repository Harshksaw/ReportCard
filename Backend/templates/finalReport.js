const finalReportModel = require("../models/finalReportModel");

function formatSemesterData(data) {
  console.log("🚀 ~ formatSemesterData ~ data:", data);

  const semesterMapping = {
    "First Semester": "1st",
    "Second Semester": "2nd",
    "Third Semester": "3rd",
    "Fourth Semester": "4th",
    "Fifth Semester": "5th",
    "Sixth Semester": "6th",
    "Seventh Semester": "7th",
    "Eighth Semester": "8th",
  };

  const semester = semesterMapping[data.semester];

  // Split the academic year and construct the full year range
  const [startYear, endYearShort] = data.academicYear.split("-");
  const endYear = startYear.slice(0, 2) + endYearShort; // Construct the full end year

  return `${semester} Semester, (${startYear}-${endYear})`;
}
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}
function template1(data) {
  return `
        <div style="page-break-after: always; width:100%;height:90vh; flex: 1; display: flex;">
          <div  
            style="flex-direction: column; justify-content: center; background-color: #b8d3ef; border: 6px solid #1C4A7A; padding: 10px; margin: 5px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
              <div style="display: flex; justify-content: space-between; align-items: center;background-color:#fff; border:2px solid #000;
              padding: 10px; border-radius: 10px; margin-bottom: 20px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              ">
          <div style="font-size: 12px; font-weight: bold; gap: 5px; text-align: center;">
  <ul style="display: flex; flex-direction: column; list-style-type: none; align-items: center;">
    <li class="spacing">KINGDOM OF SAUDI ARABIA</li>
    <li class="spacing">Ministry of Education</li>
    <li class="spacing">${data?.university || "Najran University"}</li>
    <li class="spacing">Faculty of Dentistry</li>
  </ul>
</div>
            <img src="https://res.cloudinary.com/dkijovd6p/image/upload/v1725480428/t50opxpqoofrimbd3yxi.png" alt="University Logo" style="width: 75px; height: 75px;">
            <img src="https://res.cloudinary.com/dkijovd6p/image/upload/t_hii/o3jtksywnmrppxs9o9yt.jpg" alt="University Logo" style="width: 125px; height: 75px;">
          </div>
  
  
  
        <div style="font-size: 12px;
           font-weight: bold; gap: 5px; border:1px solid #000;
      flex: 1; display: flex;
      height: 80%;
            display:grid; grid-template-columns: repeat(2, 1fr); background-color:#fff;
             grid-column-gap: 10px; padding-horizontal:5px; position: relative;">
                 <div style="position: absolute; top: 0; bottom: 0; left: 50%; width: 1px; background-color: #000;"></div>
      <ul style="display: flex; flex-direction: column; list-style-type: disc;">
          <li style="margin-bottom: 5px;"> <h3 style="color: blue;">Good Exams (KR20 > 0.80)</h3></li>
          ${data?.course_Observations?.GOOD?.map(
            (exam) =>
              `<li style="margin-bottom: 5px;  margin-left:10px;">${
                exam.course_name
              }, ${exam.course_code} (${capitalizeFirstLetter(
                exam.gender
              )})</li>`
          ).join("")}
      </ul>
      <ul style="display: flex; flex-direction: column; list-style-type: disc;">
          <li style="margin-bottom: 5px;"> <h3 style="color: green;">Exam Quality where KR20 remains within the accepted range (KR20= 0.70-0.79)</h3></li>
          ${data?.course_Observations?.AVERAGE?.map(
            (exam) =>
              `<li style="margin-bottom: 5px;  margin-left:10px;">${
                exam.course_name
              }, ${exam.course_code} (${capitalizeFirstLetter(
                exam.gender
              )})</li>`
          ).join("")}
      </ul>
      <ul style="display: flex; flex-direction: column; list-style-type: disc;">
          <li style="margin-bottom: 5px;"> <h3 style="color: red;">Exam Quality where KR20 value is below the accepted range (KR20= <0.70)</h3></li>
          ${data?.course_Observations?.POOR?.map(
            (exam) =>
              `<li style="margin-bottom: 5px; margin-left:10px;">${
                exam.course_name
              }, ${exam.course_code} (${capitalizeFirstLetter(
                exam.gender
              )})</li>`
          ).join("")}
      </ul>
  </div>
  
          </div>
        </div>
      `;
}
function calculateKR20Average(classIds) {
  const totalKR20 = classIds.reduce(
    (sum, classData) => sum + classData.kr20,
    0
  );
  return totalKR20 / classIds.length;
}
let isFirstTemplate2 = true;
function template2(data) {
  const sortedLevelTable = data.levelTable.sort((a, b) => a.level - b.level);
  // console.log("🚀 ~ template2 ~ data", data.levelTable, typeof data.levelTable)
  return sortedLevelTable
    .map((levelData) => {
      console.log(
        "🚀 ~ .map ~ levelData:",
        levelData.levelAverage["Total Rejected"].number
      );

      const kr20Average = calculateKR20Average(levelData.classId);
      const header = isFirstTemplate2
        ? "<h2>Level and Course wise item analysis</h2>"
        : "";
      isFirstTemplate2 = false;
      return `

      <div style="page-break-after: always;  width:100%;height:90vh;  max-height: 1122px; padding: 2px; box-sizing: border-box;">

      <div style="display:flex; flex-direction:column; justify-content:center; text-align:center; font-weight:600; font-size:18px;margin:10px;">

        ${header}
        </div>
        <div style="flex-direction: column; justify-content: center; background-color: #b8d3ef; border: 6px solid #1C4A7A; padding: 10px; margin: 0; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">

          <div style="display: flex; justify-content: space-between; align-items: center; background-color:#fff; border:2px solid #000;
            padding: 10px; border-radius: 10px; margin-bottom: 20px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
         <div style="font-size: 12px; font-weight: bold; gap: 5px; text-align: center;">
  <ul style="display: flex; flex-direction: column; list-style-type: none; align-items: center;">
    <li class="spacing">KINGDOM OF SAUDI ARABIA</li>
    <li class="spacing">Ministry of Education</li>
    <li class="spacing">${data?.university || "Najran University"}</li>
    <li class="spacing">Faculty of Dentistry</li>
  </ul>
</div>
            <img src="https://res.cloudinary.com/dkijovd6p/image/upload/v1725480428/t50opxpqoofrimbd3yxi.png" alt="University Logo" style="width: 75px; height: 75px;">
            <img src="https://res.cloudinary.com/dkijovd6p/image/upload/t_hii/o3jtksywnmrppxs9o9yt.jpg" alt="University Logo" style="width: 125px; height: 75px;">
          </div>

          <table class="leveltable"  style=" width:100%;  border-collapse: collapse; border:2px solid #000; background-color:#fff">
           <thead>
  <tr>
    <th colspan="32" style="background-color:#e8f1a0; text-align:center; padding: 10px;">
      <h3 style="color: #000; font-weight:bold; font-size:18px; margin: 0;"> Level ${
        levelData.level
      }</h3>
    </th>
    <th colspan="68" style="text-align:center; padding: 10px;">
      <h3 style="color:#000; font-weight:bold; font-size:18px; margin: 0;">${formatSemesterData(
        levelData.classId[0]
      )}</h3>
    </th>
  </tr>
</thead>
            <tbody id="tableData">

             <tr>
    <th  colspan="5" style="padding: 2px; word-wrap: break-word; white-space: normal; vertical-align: top;">N</th>
    <th colspan="27" style="padding: 2px; word-wrap: break-word; white-space: normal; vertical-align: top;">Course Title & Course Code</th>
    <th colspan="5" style="padding: 2px; word-wrap: break-word; white-space: normal; vertical-align: top;">${"  "}</th>
    <th style="padding: 2px; word-wrap: break-word; white-space: normal; vertical-align: top;">Difficult Question</th>
    <th style="padding: 2px; word-wrap: break-word; white-space: normal; vertical-align: top;">Good Question</th>
    <th style="padding: 2px; word-wrap: break-word; white-space: normal; vertical-align: top;">Easy Question</th>
    <th style="padding: 2px; word-wrap: break-word; white-space: normal; vertical-align: top; background-color:#cdf1d1;">Total Accepted</th>
    <th style="padding: 2px; word-wrap: break-word; white-space: normal; vertical-align: top;">Very Easy Question</th>
    <th style="padding: 2px; word-wrap: break-word; white-space: normal; vertical-align: top;">Very Difficult Question</th>
    <th style="padding: 2px; word-wrap: break-word; white-space: normal; vertical-align: top;">Poor (Bad) Questions</th>
    <th style="padding: 2px; word-wrap: break-word; white-space: normal; vertical-align: top;background-color:#f6dddd;">Total Rejected</th>
    <th style="padding: 2px; word-wrap: break-word; white-space: normal; vertical-align: top;">KR 20</th>
  </tr>
              ${levelData.classId
                .map(
                  (classData, classIndex) => `
                    <tr>
                      <td  colspan="5" rowspan="2" style="padding: 10px;">${
                        classIndex + 1
                      }</td>
                      <td colspan="27" rowspan="2" style="padding: 10px 5px 20px 5px;">${
                        classData.nameOfCourse
                      }
                      (${capitalizeFirstLetter(classData.gender)})  
                      </td>
                      <td style="padding: 5px;" colspan="5">N</td>
                      <td style="padding: 2px;">${(
                        classData.questionAnalysisData["Difficult Question"]
                          ?.number || 0
                      )?.toFixed(2)}</td>
                      <td style="padding: 2px;">${
                        classData.questionAnalysisData["Good Question"]
                          ?.number || 0
                      }</td>
                      <td style="padding: 2px;">${
                        classData.questionAnalysisData["Easy Question"]
                          ?.number || 0
                      }</td>
                      <td style="padding: 2px;background-color:#cdf1d1;">${
                        classData.questionAnalysisData["Total Accepted"]
                          ?.number || 0
                      }</td>
                      <td style="padding: 2px;">${
                        classData.questionAnalysisData["Very Easy Question"]
                          ?.number || 0
                      }</td>
                      <td style="padding: 2px;">${
                        classData.questionAnalysisData[
                          "Very Difficult Question"
                        ]?.number || 0
                      }</td>
                      <td style="padding: 2px;">${
                        classData.questionAnalysisData["Poor (Bad) Questions"]
                          ?.number || 0
                      }</td>
                      <td style="padding: 2px;background-color:#f6dddd">${
                        (
                          classData.questionAnalysisData["Total Rejected"]
                            .number || 0
                        )?.toFixed(2) || 0
                      }</td>
                      <td rowspan="2" style="padding: 2px;">${
                        Number(classData.kr20)?.toFixed(2) || 0
                      }</td>
                    </tr>
                    <tr>
                      <td style="padding: 2px;" colspan="5" >%</td>
                      <td style="padding: 2px;">${
                        classData.questionAnalysisData["Difficult Question"]
                          ?.percentage || "0"
                      }%</td>
                      <td style="padding: 2px;">${
                        classData.questionAnalysisData["Good Question"]
                          ?.percentage || 0
                      }%</td>
                      <td style="padding: 2px;">${
                        classData.questionAnalysisData["Easy Question"]
                          ?.percentage || 0
                      }%</td>
                      <td style="padding: 2px;background-color:#cdf1d1; ">${
                        classData.questionAnalysisData["Total Accepted"]
                          ?.percentage || 0
                      }%</td>
                      <td style="padding: 2px;">${
                        classData.questionAnalysisData["Very Easy Question"]
                          ?.percentage || 0
                      }%</td>
                      <td style="padding: 2px;">${
                        classData.questionAnalysisData[
                          "Very Difficult Question"
                        ]?.percentage || 0
                      }%</td>
                      <td style="padding: 2px;">${
                        classData.questionAnalysisData["Poor (Bad) Questions"]
                          ?.percentage || 0
                      }%</td>
                      <td style="padding: 2px;background-color:#f6dddd;">${(
                        classData.questionAnalysisData["Total Rejected"]
                          .percentage || 0
                      )?.toFixed(2)}%</td>
                    </tr>
                  `
                )
                .join("")}


                         <tr>
                         
                <td rowspan="3" colspan="32" style="padding: 10px; font-weight: bold; ">Average</td>
                <td style="padding: 5px;" colspan="5">N</td>
                <td style="padding: 2px;">${levelData.levelAverage[
                  "Difficult Question"
                ].number?.toFixed(2)}</td>
                <td style="padding: 2px;">${levelData.levelAverage[
                  "Good Question"
                ].number?.toFixed(2)}</td>
                <td style="padding: 2px;">${levelData.levelAverage[
                  "Easy Question"
                ].number?.toFixed(2)}</td>
                <td style="padding: 2px;background-color:#cdf1d1;">${levelData.levelAverage[
                  "Total Accepted"
                ].number?.toFixed(2)}</td>
                <td style="padding: 2px;">${levelData.levelAverage[
                  "Very Easy Question"
                ].number?.toFixed(2)}</td>
                <td style="padding: 2px;">${levelData.levelAverage[
                  "Very Difficult Question"
                ].number?.toFixed(2)}</td>
                <td style="padding: 2px;">${levelData.levelAverage[
                  "Poor (Bad) Questions"
                ].number?.toFixed(2)}</td>
                <td style="padding: 2px;background-color:#f6dddd;">${
                  levelData.levelAverage["Total Rejected"].number
                }</td>
                <td rowspan="2" colspan="5" style="padding: 2px;">${kr20Average?.toFixed(
                  2
                )}</td>
              </tr>
              <tr>
                <td style="padding: 5px;" colspan="5">%</td>
                <td style="padding: 2px;">${levelData.levelAverage[
                  "Difficult Question"
                ].percentage?.toFixed(2)}%</td>
                <td style="padding: 2px;">${levelData.levelAverage[
                  "Good Question"
                ].percentage?.toFixed(2)}%</td>
                <td style="padding: 2px;">${levelData.levelAverage[
                  "Easy Question"
                ].percentage?.toFixed(2)}%</td>
                <td style="padding: 2px;background-color:#cdf1d1;">${levelData.levelAverage[
                  "Total Accepted"
                ].percentage?.toFixed(2)}%</td>
                <td style="padding: 2px;">${levelData.levelAverage[
                  "Very Easy Question"
                ].percentage?.toFixed(2)}%</td>
                <td style="padding: 2px;">${levelData.levelAverage[
                  "Very Difficult Question"
                ].percentage?.toFixed(2)}%</td>
                <td style="padding: 2px;">${levelData.levelAverage[
                  "Poor (Bad) Questions"
                ].percentage?.toFixed(2)}%</td>
                <td style="padding: 0px;background-color:#f6dddd;">${
                  levelData.levelAverage["Total Rejected"].percentage || 0
                }%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
    })
    .join("");
}

function template3(data) {
  return data.CourseNameTable.map((levelData) => {
    const kr20Average = calculateKR20Average(levelData.classId);

    return `
        <div style="page-break-after: always;  width:100%;height:90vh;  max-height: 1122px; padding: 2px; box-sizing: border-box;">
          <div style="flex-direction: column; justify-content: center; background-color: #b8d3ef; border: 6px solid #1C4A7A; padding: 10px; margin: 0; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
  
            <div style="display: flex; justify-content: space-between; align-items: center; background-color:#fff; border:2px solid #000;
              padding: 10px; border-radius: 10px; margin-bottom: 20px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <div style="font-size: 12px; font-weight: bold; gap: 5px; text-align: center;">
  <ul style="display: flex; flex-direction: column; list-style-type: none; align-items: center;">
    <li class="spacing">KINGDOM OF SAUDI ARABIA</li>
    <li class="spacing">Ministry of Education</li>
    <li class="spacing">${data?.university || "Najran University"}</li>
    <li class="spacing">Faculty of Dentistry</li>
  </ul>
</div>
              <img src="https://res.cloudinary.com/dkijovd6p/image/upload/v1725480428/t50opxpqoofrimbd3yxi.png" alt="University Logo" style="width: 75px; height: 75px;">
              <img src="https://res.cloudinary.com/dkijovd6p/image/upload/t_hii/o3jtksywnmrppxs9o9yt.jpg" alt="University Logo" style="width: 125px; height: 75px;">
            </div>
  
            <table class="leveltable"  style=" width:100%;  border-collapse: collapse; border:2px solid #000; background-color:#fff">
            <thead>
              <tr>
                <th colspan="35" style="background-color:#e8f1a0; text-align:center; padding: 10px;">
                  <h3 style="color: #000; font-weight:bold; font-size:18px; margin: 0;">${
                    levelData.CourseName
                  }</h3>
                </th>
                <th colspan="65" style="text-align:center; padding: 10px;">
                  <h3 style="color:#000; font-weight:bold; font-size:18px; margin: 0;">${formatSemesterData(
                    levelData.classId[0]
                  )}</h3>
                </th>
              </tr>
            </thead>
              <tbody id="tableData">
  
               <tr>
      <th style="padding: 2px; word-wrap: break-word; white-space: normal; vertical-align: top;">N</th>
      <th colspan="30" style="padding: 2px; word-wrap: break-word; white-space: normal; vertical-align: top;">Course Title & Course Code</th>
      <th colspan="5" style="padding: 2px; word-wrap: break-word; white-space: normal; vertical-align: top;">${"  "}</th>
      <th style="padding: 2px; word-wrap: break-word; white-space: normal; vertical-align: top;">Difficult Question</th>
      <th style="padding: 2px; word-wrap: break-word; white-space: normal; vertical-align: top;">Good Question</th>
      <th style="padding: 2px; word-wrap: break-word; white-space: normal; vertical-align: top;">Easy Question</th>
      <th style="padding: 2px; word-wrap: break-word; white-space: normal; vertical-align: top; background-color:#cdf1d1;">Total Accepted</th>
      <th style="padding: 2px; word-wrap: break-word; white-space: normal; vertical-align: top;">Very Easy Question</th>
      <th style="padding: 2px; word-wrap: break-word; white-space: normal; vertical-align: top;">Very Difficult Question</th>
      <th style="padding: 2px; word-wrap: break-word; white-space: normal; vertical-align: top;">Poor (Bad) Questions</th>
      <th style="padding: 2px; word-wrap: break-word; white-space: normal; vertical-align: top;background-color:#f6dddd;">Total Rejected</th>
      <th style="padding: 2px; word-wrap: break-word; white-space: normal; vertical-align: top;">KR 20</th>
    </tr>
                ${levelData.classId
                  .map(
                    (classData, classIndex) => `
                      <tr>
                        <td rowspan="2" style="padding: 10px;">${
                          classIndex + 1
                        }</td>
                      <td colspan="30" rowspan="2" style="padding: 10px 5px 20px 5px;">${`${
                        classData.nameOfCourse
                      } (${capitalizeFirstLetter(classData.gender)})`}</td>
                        <td style="padding: 5px;" colspan="5">N</td>
                        <td style="padding: 2px;">${
                          classData.questionAnalysisData["Difficult Question"]
                            ?.number || "0"
                        }</td>
                        <td style="padding: 2px;">${
                          classData.questionAnalysisData["Good Question"]
                            ?.number || 0
                        }</td>
                        <td style="padding: 2px;">${
                          classData.questionAnalysisData["Easy Question"]
                            ?.number || 0
                        }</td>
                        <td style="padding: 2px;background-color:#cdf1d1;">${
                          classData.questionAnalysisData["Total Accepted"]
                            ?.number || 0
                        }</td>
                        <td style="padding: 2px;">${
                          classData.questionAnalysisData["Very Easy Question"]
                            .number || 0
                        }</td>
                        <td style="padding: 2px;">${
                          classData.questionAnalysisData[
                            "Very Difficult Question"
                          ]?.number || 0
                        }</td>
                        <td style="padding: 2px;">${
                          classData.questionAnalysisData["Poor (Bad) Questions"]
                            ?.number || 0
                        }</td>
                        <td style="padding: 2px;background-color:#f6dddd">${
                          classData.questionAnalysisData["Total Rejected"]
                            ?.number || 0
                        }</td>
                        <td rowspan="2" style="padding: 2px;">${
                          classData.kr20?.toFixed(2) || 0
                        }</td>
                      </tr>
                      <tr>
                        <td style="padding: 2px;" colspan="5" >%</td>
                        <td style="padding: 2px;">${
                          classData.questionAnalysisData["Difficult Question"]
                            ?.percentage || "0"
                        }%</td>
                        <td style="padding: 2px;">${
                          classData.questionAnalysisData["Good Question"]
                            ?.percentage || 0
                        }%</td>
                        <td style="padding: 2px;">${
                          classData.questionAnalysisData["Easy Question"]
                            ?.percentage || 0
                        }%</td>
                        <td style="padding: 2px;background-color:#cdf1d1; ">${
                          classData.questionAnalysisData["Total Accepted"]
                            ?.percentage || 0
                        }%</td>
                        <td style="padding: 2px;">${
                          classData.questionAnalysisData["Very Easy Question"]
                            ?.percentage || 0
                        }%</td>
                        <td style="padding: 2px;">${
                          classData.questionAnalysisData[
                            "Very Difficult Question"
                          ]?.percentage || 0
                        }%</td>
                        <td style="padding: 2px;">${
                          classData.questionAnalysisData["Poor (Bad) Questions"]
                            ?.percentage || 0
                        }%</td>
                        <td style="padding: 2px;background-color:#f6dddd;">${
                          classData.questionAnalysisData["Total Rejected"]
                            ?.percentage || 0
                        }%</td>
                      </tr>
                    `
                  )
                  .join("")}
                           <tr>
                           
                  <td rowspan="3" colspan="32" style="padding: 10px; font-weight: bold; ">Average</td>
                  <td style="padding: 5px;" colspan="4">N</td>
                  <td style="padding: 2px;">${levelData.levelAverage[
                    "Difficult Question"
                  ].number?.toFixed(2)}</td>
                  <td style="padding: 2px;">${levelData.levelAverage[
                    "Good Question"
                  ].number?.toFixed(2)}</td>
                  <td style="padding: 2px;">${levelData.levelAverage[
                    "Easy Question"
                  ].number?.toFixed(2)}</td>
                  <td style="padding: 2px;background-color:#cdf1d1;">${
                    levelData.levelAverage["Total Accepted"].number
                  }</td>
                  <td style="padding: 2px;">${
                    levelData.levelAverage["Very Easy Question"].number
                  }</td>
                  <td style="padding: 2px;">${
                    levelData.levelAverage["Very Difficult Question"].number
                  }</td>
                  <td style="padding: 2px;">${
                    levelData.levelAverage["Poor (Bad) Questions"].number
                  }</td>
                  <td style="padding: 2px;background-color:#f6dddd;">${
                    levelData.levelAverage["Total Rejected"].number
                  }</td>
                  <td rowspan="2" colspan="5" style="padding: 2px;">${kr20Average?.toFixed(
                    2
                  )}</td>
                </tr>
                <tr>
                  <td style="padding: 5px;" colspan="4">%</td>
                  <td style="padding: 2px;">${
                    levelData.levelAverage["Difficult Question"].percentage
                  }%</td>
                  <td style="padding: 2px;">${
                    levelData.levelAverage["Good Question"].percentage
                  }%</td>
                  <td style="padding: 2px;">${
                    levelData.levelAverage["Easy Question"].percentage
                  }%</td>
                  <td style="padding: 2px;background-color:#cdf1d1;">${
                    levelData.levelAverage["Total Accepted"].percentage
                  }%</td>
                  <td style="padding: 2px;">${
                    levelData.levelAverage["Very Easy Question"].percentage
                  }%</td>
                  <td style="padding: 2px;">${
                    levelData.levelAverage["Very Difficult Question"].percentage
                  }%</td>
                  <td style="padding: 2px;">${
                    levelData.levelAverage["Poor (Bad) Questions"].percentage
                  }%</td>
                  <td style="padding: 2px;background-color:#f6dddd;">${
                    levelData.levelAverage["Total Rejected"].percentage
                  }%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      `;
  }).join("");
}
function template4(data) {
  let totalDifficultQuestions = 0;
  let totalGoodQuestions = 0;
  let totalEasyQuestions = 0;
  let totalAccepted = 0;
  let totalVeryEasyQuestions = 0;
  let totalVeryDifficultQuestions = 0;
  let totalPoorQuestions = 0;
  let totalRejected = 0;
  let totalKR20 = 0;
  let levelCount = data.levelTable.length;

  // Aggregate data
  data.levelTable.forEach((levelData) => {
    totalDifficultQuestions +=
      levelData.levelAverage["Difficult Question"]?.number || 0;
    totalGoodQuestions += levelData.levelAverage["Good Question"]?.number || 0;
    totalEasyQuestions += levelData.levelAverage["Easy Question"]?.number || 0;
    totalAccepted += levelData.levelAverage["Total Accepted"]?.number || 0;
    totalVeryEasyQuestions +=
      levelData.levelAverage["Very Easy Question"]?.number || 0;
    totalVeryDifficultQuestions +=
      levelData.levelAverage["Very Difficult Question"]?.number || 0;
    totalPoorQuestions +=
      levelData.levelAverage["Poor (Bad) Questions"]?.number || 0;
    totalRejected += levelData.levelAverage["Total Rejected"]?.number || 0;
    totalKR20 += levelData.levelAverage.kr20Average || 0;
  });

  // Calculate average KR 20
  // Calculate total number of questions
  let totalQuestions =
    totalDifficultQuestions +
    totalGoodQuestions +
    totalEasyQuestions +
    totalAccepted +
    totalVeryEasyQuestions +
    totalVeryDifficultQuestions +
    totalPoorQuestions +
    totalRejected;

  // Generate HTML
  let averageKR20 = totalKR20 / levelCount;
  const courseCount = data.CourseNameTable.length;

  // Generate HTML
  let summaryHTML = `
    <style>
      .template4 th {
        padding: 4px;
        word-wrap: break-word;
        white-space: normal;
        vertical-align: top;
      }
      .template4 th td {
      padding: 2px;
      }
    </style>
        <div style="page-break-after: always;  width:100%;height:90vh;  max-height: 1122px; padding: 2px; box-sizing: border-box;">
          <div style="flex-direction: column; justify-content: center; background-color: #b8d3ef; border: 6px solid #1C4A7A; padding: 10px; margin: 0; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
  
            <div style="display: flex; justify-content: space-between; align-items: center; background-color:#fff; border:2px solid #000;
              padding: 10px; border-radius: 10px; margin-bottom: 20px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <div style="font-size: 12px; font-weight: bold; gap: 5px; text-align: center;">
  <ul style="display: flex; flex-direction: column; list-style-type: none; align-items: center;">
    <li class="spacing">KINGDOM OF SAUDI ARABIA</li>
    <li class="spacing">Ministry of Education</li>
    <li class="spacing">${data?.university || "Najran University"}</li>
    <li class="spacing">Faculty of Dentistry</li>
  </ul>
</div>
              <img src="https://res.cloudinary.com/dkijovd6p/image/upload/v1725480428/t50opxpqoofrimbd3yxi.png" alt="University Logo" style="width: 75px; height: 75px;">
              <img src="https://res.cloudinary.com/dkijovd6p/image/upload/t_hii/o3jtksywnmrppxs9o9yt.jpg" alt="University Logo" style="width: 125px; height: 75px;">
            </div>
  
            <table class="leveltable"  style=" width:100%;  border-collapse: collapse; border:2px solid #000; background-color:#fff">
       

                    <thead>
              <tr>
                <th colspan="38" style="background-color:#e8f1a0; text-align:center; padding: 10px;">
                  <h3 style="color: #000; font-weight:bold; font-size:18px; margin: 0;"> Report Summary </h3>
                </th>
                <th colspan="52" style="text-align:center; padding: 10px;">
                  <h3 style="color:#000; font-weight:bold; font-size:18px; margin: 0;">  ${formatSemesterData(
                    data?.CourseNameTable[0].classId[0]
                  )}</h3>
                </th>
              </tr>
            </thead>
    <tbody id="tableData template4">
       <tr>
        <th style="padding: 2px; word-wrap: break-word; white-space: normal; vertical-align: top;">N</th>
        <th colspan="30" style="padding: 2px; word-wrap: break-word; white-space: normal; vertical-align: top;">Levels</th>
        <th colspan="5" style="padding: 2px; word-wrap: break-word; white-space: normal; vertical-align: top;">${"  "}</th>
        <th style="padding: 2px; word-wrap: break-word; white-space: normal; vertical-align: top;">Difficult Question</th>
        <th style="padding: 2px; word-wrap: break-word; white-space: normal; vertical-align: top;">Good Question</th>
        <th style="padding: 2px; word-wrap: break-word; white-space: normal; vertical-align: top;">Easy Question</th>
        <th style="padding: 2px; word-wrap: break-word; white-space: normal; vertical-align: top; background-color:#cdf1d1;">Total Accepted</th>
        <th style="padding: 2px; word-wrap: break-word; white-space: normal; vertical-align: top;">Very Easy Question</th>
        <th style="padding: 2px; word-wrap: break-word; white-space: normal; vertical-align: top;">Very Difficult Question</th>
        <th style="padding: 2px; word-wrap: break-word; white-space: normal; vertical-align: top;">Poor (Bad) Questions</th>
        <th style="padding: 2px; word-wrap: break-word; white-space: normal; vertical-align: top;background-color:#f6dddd;">Total Rejected</th>
        <th style="padding: 2px; word-wrap: break-word; white-space: normal; vertical-align: top;">KR 20</th>
    </tr>
  `;

  data.levelTable.forEach((levelData, index) => {
    // console.log("🚀 ~ template4 ~ levelData", levelData);
    summaryHTML += `
<tr>
  <td style="padding: 2px;" rowspan="2">${index + 1}</td>
  <td colspan="30" style="padding: 2px;" rowspan="2">${levelData.level}</td>
  <td colspan="5" style="padding: 2px;">N</td>
  <td style="padding: 2px;">${
    levelData.levelAverage["Difficult Question"].number
  }</td>
  <td style="padding: 2px;">${
    levelData.levelAverage["Good Question"].number
  }</td>
  <td style="padding: 2px;">${
    levelData.levelAverage["Easy Question"].number
  }</td>
  <td style="padding: 2px;background-color:#cdf1d1;">${
    levelData.levelAverage["Total Accepted"].number
  }</td>
  <td style="padding: 2px;">${
    levelData.levelAverage["Very Easy Question"].number
  }</td>
  <td style="padding: 2px;">${
    levelData.levelAverage["Very Difficult Question"].number
  }</td>
  <td style="padding: 2px;">${
    levelData.levelAverage["Poor (Bad) Questions"].number
  }</td>
  <td style="padding: 2px;background-color:#f6dddd;">${
    levelData.levelAverage["Total Rejected"].number
  }</td>
  <td rowspan="2" style="padding: 2px"; >${levelData.levelAverage.kr20Average?.toFixed(
    2
  )}</td>
</tr>
<tr>
  <td colspan="5" style="padding: 2px;">%</td>
  <td style="padding: 2px;">${(
    (levelData.levelAverage["Difficult Question"].number / totalQuestions) *
    100
  )?.toFixed(2)}%</td>
  <td style="padding: 2px;">${(
    (levelData.levelAverage["Good Question"].number / totalQuestions) *
    100
  )?.toFixed(2)}%</td>
  <td style="padding: 2px;">${(
    (levelData.levelAverage["Easy Question"].number / totalQuestions) *
    100
  )?.toFixed(2)}%</td>
  <td style="padding: 2px;background-color:#cdf1d1;">${(
    (levelData.levelAverage["Total Accepted"].number / totalQuestions) *
    100
  )?.toFixed(2)}%</td>
  <td style="padding: 2px;">${(
    (levelData.levelAverage["Very Easy Question"].number / totalQuestions) *
    100
  )?.toFixed(2)}%</td>
  <td style="padding: 2px;">${(
    (levelData.levelAverage["Very Difficult Question"].number /
      totalQuestions) *
    100
  )?.toFixed(2)}%</td>
  <td style="padding: 2px;">${(
    (levelData.levelAverage["Poor (Bad) Questions"].number / totalQuestions) *
    100
  )?.toFixed(2)}%</td>
  <td style="padding: 2px;background-color:#f6dddd;">${(
    (levelData.levelAverage["Total Rejected"].number / totalQuestions) * 100 ||
    0
  )?.toFixed(2)}%</td>

</tr>
    `;
  });

  // Append summary rows
  summaryHTML += `
    <tr>
      <td rowspan="3" colspan="32" style="padding: 10px; font-weight: bold;">Average: Whole Exam</td>
      <td style="padding: 5px;" colspan="4">N</td>
      <td style="padding: 2px;">${totalDifficultQuestions}</td>
      <td style="padding: 2px;">${totalGoodQuestions}</td>
      <td style="padding: 2px;">${totalEasyQuestions}</td>
      <td style="padding: 2px;background-color:#cdf1d1;">${totalAccepted}</td>
      <td style="padding: 2px;">${totalVeryEasyQuestions}</td>
      <td style="padding: 2px;">${totalVeryDifficultQuestions}</td>
      <td style="padding: 2px;">${totalPoorQuestions}</td>
      <td style="padding: 2px;background-color:#f6dddd;">${totalRejected}</td>
      <td rowspan="3" colspan="5" style="padding: 2px;">${averageKR20?.toFixed(
        2
      )}</td>
    </tr>
    <tr>
      <td style="padding: 5px;" colspan="4">%</td>
      <td style="padding: 2px;">${(
        totalDifficultQuestions / courseCount
      )?.toFixed(2)}%</td>
      <td style="padding: 2px;">${(totalGoodQuestions / courseCount)?.toFixed(
        2
      )}%</td>
      <td style="padding: 2px;">${(totalEasyQuestions / courseCount)?.toFixed(
        2
      )}%</td>
      <td style="padding: 2px;background-color:#cdf1d1;">${(
        totalAccepted / courseCount
      )?.toFixed(2)}%</td>
      <td style="padding: 2px;">${(
        totalVeryEasyQuestions / courseCount
      )?.toFixed(2)}%</td>
      <td style="padding: 2px;">${(
        totalVeryDifficultQuestions / courseCount
      )?.toFixed(2)}%</td>
      <td style="padding: 2px;">${(totalPoorQuestions / courseCount)?.toFixed(
        2
      )}%</td>
      <td style="padding: 2px;background-color:#f6dddd;">${(
        totalRejected / courseCount
      )?.toFixed(2)}%</td>
    </tr>
`;

  // Close the table
  summaryHTML += `
     </tbody>
            </table>
        </div>
    </div>
  `;

  return summaryHTML;
}

function templateCourseNameTable(data) {
  const totalQuestions = data.totalQuestions || 0;
  const totalDifficultQuestions = data.totalDifficultQuestions || 0;
  const totalGoodQuestions = data.totalGoodQuestions || 0;
  const totalEasyQuestions = data.totalEasyQuestions || 0;
  const totalAccepted = data.totalAccepted || 0;
  const totalVeryEasyQuestions = data.totalVeryEasyQuestions || 0;
  const totalVeryDifficultQuestions = data.totalVeryDifficultQuestions || 0;
  const totalPoorQuestions = data.totalPoorQuestions || 0;
  const totalRejected = data.totalRejected || 0;
  const averageKR20 = data.averageKR20 || 0;
  const courseCount = data.CourseNameTable.length || 1;

  let summaryHTML = `
    <style>
      .templateCourseName th, .templateCourseName td {
        padding: 4px;
        word-wrap: break-word;
        white-space: normal;
        vertical-align: top;
      }
      .templateCourseName .highlight-accepted {
        background-color: #cdf1d1;
      }
      .templateCourseName .highlight-rejected {
        background-color: #f6dddd;
      }
    </style>
<div style="page-break-after: always;  width:100%;height:90vh;  max-height: 1122px; padding: 2px; box-sizing: border-box;">
          <div style="flex-direction: column; justify-content: center; background-color: #b8d3ef; border: 6px solid #1C4A7A; padding: 10px; margin: 0; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
  
            <div style="display: flex; justify-content: space-between; align-items: center; background-color:#fff; border:2px solid #000;
              padding: 10px; border-radius: 10px; margin-bottom: 20px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <div style="font-size: 12px; font-weight: bold; gap: 5px; text-align: center;">
  <ul style="display: flex; flex-direction: column; list-style-type: none; align-items: center;">
    <li class="spacing">KINGDOM OF SAUDI ARABIA</li>
    <li class="spacing">Ministry of Education</li>
    <li class="spacing">${data?.university || "Najran University"}</li>
    <li class="spacing">Faculty of Dentistry</li>
  </ul>
</div>
              <img src="https://res.cloudinary.com/dkijovd6p/image/upload/v1725480428/t50opxpqoofrimbd3yxi.png" alt="University Logo" style="width: 75px; height: 75px;">
              <img src="https://res.cloudinary.com/dkijovd6p/image/upload/t_hii/o3jtksywnmrppxs9o9yt.jpg" alt="University Logo" style="width: 125px; height: 75px;">
            </div>
  
            <table class="leveltable"  style=" width:100%;  border-collapse: collapse; border:2px solid #000; background-color:#fff">
       

                    <thead>
              <tr>
                <th colspan="38" style="background-color:#e8f1a0; text-align:center; padding: 10px;">
                  <h3 style="color: #000; font-weight:bold; font-size:18px; margin: 0;"> Report Summary </h3>
                </th>
                <th colspan="52" style="text-align:center; padding: 10px;">
                  <h3 style="color:#000; font-weight:bold; font-size:18px; margin: 0;">  ${formatSemesterData(
                    data?.CourseNameTable[0].classId[0]
                  )}</h3>
                </th>
              </tr>
            </thead>
    <tbody id="tableData template4">
       <tr>
        <th style="padding: 2px; word-wrap: break-word; white-space: normal; vertical-align: top;">N</th>
        <th colspan="30" style="padding: 2px; word-wrap: break-word; white-space: normal; vertical-align: top;">Levels</th>
        <th colspan="5" style="padding: 2px; word-wrap: break-word; white-space: normal; vertical-align: top;">${"  "}</th>
        <th style="padding: 2px; word-wrap: break-word; white-space: normal; vertical-align: top;">Difficult Question</th>
        <th style="padding: 2px; word-wrap: break-word; white-space: normal; vertical-align: top;">Good Question</th>
        <th style="padding: 2px; word-wrap: break-word; white-space: normal; vertical-align: top;">Easy Question</th>
        <th style="padding: 2px; word-wrap: break-word; white-space: normal; vertical-align: top; background-color:#cdf1d1;">Total Accepted</th>
        <th style="padding: 2px; word-wrap: break-word; white-space: normal; vertical-align: top;">Very Easy Question</th>
        <th style="padding: 2px; word-wrap: break-word; white-space: normal; vertical-align: top;">Very Difficult Question</th>
        <th style="padding: 2px; word-wrap: break-word; white-space: normal; vertical-align: top;">Poor (Bad) Questions</th>
        <th style="padding: 2px; word-wrap: break-word; white-space: normal; vertical-align: top;background-color:#f6dddd;">Total Rejected</th>
        <th style="padding: 2px; word-wrap: break-word; white-space: normal; vertical-align: top;">KR 20</th>
    </tr>
  `;

  // Iterate over each course and generate rows
  data.CourseNameTable.forEach((courseData, index) => {
    summaryHTML += `
<tr>
  <td style="padding: 2px;" rowspan="2">${index + 1}</td>
  <td colspan="30" style="padding: 2px;" rowspan="2">${
    courseData.CourseName
  }</td>
  <td colspan="5" style="padding: 2px;">N</td>
  <td style="padding: 2px;">${
    courseData.levelAverage["Difficult Question"].number
  }</td>
  <td style="padding: 2px;">${
    courseData.levelAverage["Good Question"].number
  }</td>
  <td style="padding: 2px;">${
    courseData.levelAverage["Easy Question"].number
  }</td>
  <td style="padding: 2px;background-color:#cdf1d1;">${
    courseData.levelAverage["Total Accepted"].number
  }</td>
  <td style="padding: 2px;">${
    courseData.levelAverage["Very Easy Question"].number
  }</td>
  <td style="padding: 2px;">${
    courseData.levelAverage["Very Difficult Question"].number
  }</td>
  <td style="padding: 2px;">${
    courseData.levelAverage["Poor (Bad) Questions"].number
  }</td>
  <td style="padding: 2px;background-color:#f6dddd;">${
    courseData.levelAverage["Total Rejected"].number
  }</td>
  <td rowspan="2" style="padding: 2px;">${courseData.levelAverage.kr20Average?.toFixed(
    2
  )}</td>
</tr>
<tr>
  <td colspan="5" style="padding: 2px;">%</td>

<td style="padding: 2px;">${courseData.levelAverage[
      "Difficult Question"
    ].percentage?.toFixed(2)}%</td>
<td style="padding: 2px;">${courseData.levelAverage[
      "Good Question"
    ].percentage?.toFixed(2)}%</td>
<td style="padding: 2px;">${courseData.levelAverage[
      "Easy Question"
    ].percentage?.toFixed(2)}%</td>
<td style="padding: 2px;background-color:#cdf1d1;">${courseData.levelAverage[
      "Total Accepted"
    ].percentage?.toFixed(2)}%</td>
<td style="padding: 2px;">${courseData.levelAverage[
      "Very Easy Question"
    ].percentage?.toFixed(2)}%</td>
<td style="padding: 2px;">${courseData.levelAverage[
      "Very Difficult Question"
    ].percentage?.toFixed(2)}%</td>
<td style="padding: 2px;">${courseData.levelAverage[
      "Poor (Bad) Questions"
    ].percentage?.toFixed(2)}%</td>
<td style="padding: 2px;background-color:#f6dddd;">${courseData.levelAverage[
      "Total Rejected"
    ].percentage?.toFixed(2)}%</td>

</tr>
    `;
  });

  // Append summary rows
  summaryHTML += `
    <tr>
      <td rowspan="3" colspan="32" style="padding: 10px; font-weight: bold;">Average: Whole exam</td>
      <td style="padding: 5px;" colspan="4">N</td>
      <td style="padding: 2px;">${totalDifficultQuestions}</td>
      <td style="padding: 2px;">${totalGoodQuestions}</td>
      <td style="padding: 2px;">${totalEasyQuestions}</td>
      <td style="padding: 2px;background-color:#cdf1d1;">${totalAccepted}</td>
      <td style="padding: 2px;">${totalVeryEasyQuestions}</td>
      <td style="padding: 2px;">${totalVeryDifficultQuestions}</td>
      <td style="padding: 2px;">${totalPoorQuestions}</td>
      <td style="padding: 2px;background-color:#f6dddd;">${totalRejected}</td>
      <td rowspan="2" colspan="5" style="padding: 2px;">${averageKR20?.toFixed(
        2
      )}</td>
    </tr>
    <tr>
      <td style="padding: 5px;" colspan="4">%</td>
      <td style="padding: 2px;">${(
        totalDifficultQuestions / courseCount
      )?.toFixed(2)}%</td>
      <td style="padding: 2px;">${(totalGoodQuestions / courseCount)?.toFixed(
        2
      )}%</td>
      <td style="padding: 2px;">${(totalEasyQuestions / courseCount)?.toFixed(
        2
      )}%</td>
      <td style="padding: 2px;background-color:#cdf1d1;">${(
        totalAccepted / courseCount
      )?.toFixed(2)}%</td>
      <td style="padding: 2px;">${(
        totalVeryEasyQuestions / courseCount
      )?.toFixed(2)}%</td>
      <td style="padding: 2px;">${(
        totalVeryDifficultQuestions / courseCount
      )?.toFixed(2)}%</td>
      <td style="padding: 2px;">${(totalPoorQuestions / courseCount)?.toFixed(
        2
      )}%</td>
      <td style="padding: 2px;background-color:#f6dddd;">${(
        totalRejected / courseCount
      )?.toFixed(2)}%</td>
    </tr>
`;

  // Close the table
  summaryHTML += `
     </tbody>
            </table>
        </div>
    </div>
  `;

  return summaryHTML;
}

module.exports = {
  template1,
  template2,
  template3,
  template4,
  templateCourseNameTable,
};
