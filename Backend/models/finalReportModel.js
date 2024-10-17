const mongoose = require("mongoose");
const Student = require("./student");
const { number } = require("mathjs");
const { title } = require("process");

const finalReportSchema = new mongoose.Schema({
  semester: { type: String, required: true },
  year: { type: String, required: true },
  gender: { type: String, required: true },
  course_Observations: {

    "GOOD": [
      {

        course_code: { type: String, required: true },
        course_name: { type: String, required: true },
        gender: { type: String, required: true },
      }
    ],


    "AVERAGE": [
      {

        course_code: { type: String, required: true },
        course_name: { type: String, required: true },
        gender: { type: String, required: true },
      }
    ],


    "POOR":
      [
        {

          course_code: { type: String, required: true },
          course_name: { type: String, required: true },
          gender: { type: String, required: true },
        }
      ]
  },




  levelTable: [


    {
      level: { type: String, required: true },
      classId: [{ type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true }],

      levelAverage: {
        "Poor (Bad) Questions": {
          number: { type: Number },
          percentage: { type: Number },
        },
        "Very Difficult Question": {
          number: { type: Number },
          percentage: { type: Number },
        },
        "Difficult Question": {
          number: { type: Number },
          percentage: { type: Number },
        },
        "Good Question": {
          number: { type: Number },
          percentage: { type: Number },
        },
        "Easy Question": {
          number: { type: Number },
          percentage: { type: Number },
        },
        "Very Easy Question": {
          number: { type: Number },
          percentage: { type: Number },
        },
        "Total Accepted": {
          number: { type: Number },
          percentage: { type: Number },
        },
        "Total Rejected": {
          number: { type: Number },
          percentage: { type: Number },
        },
        "kr20Average": { type: Number },
      }

    },

  ],

  CourseNameTable: [


    {
      CourseName: { type: String, required: true },
      classId: [{ type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true }],

      levelAverage: {
        "Poor (Bad) Questions": {
          number: { type: Number },
          percentage: { type: Number },
        },
        "Very Difficult Question": {
          number: { type: Number },
          percentage: { type: Number },
        },
        "Difficult Question": {
          number: { type: Number },
          percentage: { type: Number },
        },
        "Good Question": {
          number: { type: Number },
          percentage: { type: Number },
        },
        "Easy Question": {
          number: { type: Number },
          percentage: { type: Number },
        },
        "Very Easy Question": {
          number: { type: Number },
          percentage: { type: Number },
        },
        "Total Accepted": {
          number: { type: Number },
          percentage: { type: Number },
        },
        "Total Rejected": {
          number: { type: Number },
          percentage: { type: Number },
        },
        "kr20Average": { type: Number },
      }

    },

  ],



});

finalReportSchema.pre('save', async function (next) {
  const finalReport = this;

  for (const level of finalReport.levelTable) {
    const classIds = level.classId;

    // Fetch all questionAnalysisData for the respective classIds
    const classes = await mongoose.model('Class').find({
      _id: { $in: classIds }
    });

    const counters = {
      "Poor (Bad) Questions": { number: 0, percentage: 0 },
      "Very Difficult Question": { number: 0, percentage: 0 },
      "Difficult Question": { number: 0, percentage: 0 },
      "Good Question": { number: 0, percentage: 0 },
      "Easy Question": { number: 0, percentage: 0 },
      "Very Easy Question": { number: 0, percentage: 0 },
      "Total Accepted": { number: 0, percentage: 0 },
      "Total Rejected": { number: 0, percentage: 0 },
    };
    let totalKR20 = 0;
// Calculate totals
classes.forEach(classDoc => {
  const questionAnalysisData = classDoc.questionAnalysisData;
  for (const key in counters) {
    if (questionAnalysisData[key]) {
      counters[key].number += questionAnalysisData[key].number || 0;
      counters[key].percentage += questionAnalysisData[key].percentage || 0;
    }
  }
  totalKR20 += classDoc.kr20 || 0;
});
const totalEntries = classes.length;
for (const key in counters) {
  if (totalEntries > 0) {
    counters[key].number = (counters[key].number / totalEntries).toFixed(2);
    counters[key].percentage = (counters[key].percentage / totalEntries).toFixed(2);
  }
}
const kr20Average = totalEntries > 0 ? (totalKR20 / totalEntries).toFixed(2) : 0;

// Update levelAverage
level.levelAverage = { ...counters, kr20Average };
  }

  next();
});
finalReportSchema.pre('save', async function (next) {
  const finalReport = this;

  const calculateAverages = async (table, averageField) => {
    for (const entry of table) {
      const classIds = entry.classId.map(id => new mongoose.Types.ObjectId(id));

      // Fetch all Class documents for the respective classIds
      const classes = await mongoose.model('Class').find({
        _id: { $in: classIds }
      });

      const counters = {
        "Poor (Bad) Questions": { number: 0, percentage: 0 },
        "Very Difficult Question": { number: 0, percentage: 0 },
        "Difficult Question": { number: 0, percentage: 0 },
        "Good Question": { number: 0, percentage: 0 },
        "Easy Question": { number: 0, percentage: 0 },
        "Very Easy Question": { number: 0, percentage: 0 },
        "Total Accepted": { number: 0, percentage: 0 },
        "Total Rejected": { number: 0, percentage: 0 },
      };

      let totalKR20 = 0;


      classes.forEach(classDoc => {
        const questionAnalysisData = classDoc.questionAnalysisData;
        for (const key in counters) {
          if (questionAnalysisData[key]) {
            counters[key].number += questionAnalysisData[key].number || 0;
            counters[key].percentage += questionAnalysisData[key].percentage || 0;
          }
        }
        totalKR20 += classDoc.kr20 || 0;
      });
      
      const totalEntries = classes.length;
      for (const key in counters) {
        if (totalEntries > 0) {
          counters[key].number = (counters[key].number / totalEntries).toFixed(2);
          counters[key].percentage = (counters[key].percentage / totalEntries).toFixed(2);
        }
      }
      
      // Calculate kr20Average
      const kr20Average = totalEntries > 0 ? (totalKR20 / totalEntries).toFixed(2) : 0;
      

      // Update average field
      entry[averageField] = { ...counters, kr20Average };
    }
  };

  await calculateAverages(finalReport.levelTable, 'levelAverage');
  await calculateAverages(finalReport.CourseNameTable, 'levelAverage');

  next();
});


module.exports = mongoose.model("FinalReport", finalReportSchema);