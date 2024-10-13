require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require('fs');
const path = require('path');
const cron = require('node-cron');
const multer = require("multer");
const { google } = require('googleapis');
const xlsx = require("xlsx");
const { uploadFile,  getstudentData,  createClass, getFinalResult, handleCollegeSubmit } = require("./controllers/excelFile");

const mongoose = require('mongoose');
const cors = require("cors");

const { deleteAllData, deleteData } = require("./controllers/dev");
const connectDB = require("./db");
const { generate, generatePdf, getDbData, deleteAll } = require("./controllers/pdf");
const { getGrades } = require("./controllers/grading");
const { getReportsByRoleAndEmail } = require("./controllers/get.controllers");
const User = require("./models/usermodel");
const { generateFinalReport, generateReportCardPDF, previewReportCard, getFinalReport } = require("./controllers/finalReport");
const app = express();
const port = 3003;
app.use(bodyParser.json());


app.use(cors({
  origin: '*'
}));



connectDB();

app.get("/", (req, res) => {
  res.json({ message: "pong working" });
});
app.get('/wake-up', async (req, res) => {
  try {
    // Perform any necessary operations to wake up the server

    res.status(200).send({ message: 'Server is awake' });
  } catch (err) {
    console.error("Error waking up server:", err);
    res.status(500).send({ error: err.message });
  }
});


// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/');
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//     cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
//   },
// });
const storage = multer.memoryStorage();

// Initialize multer with the configured storage
const upload = multer({ storage: storage });





app.use("/auth", authRoutes);

// ********************************************************************************************
// Dev

app.delete("/cleanClass", deleteAllData);
// ********************************************************************************************

app.post("/createClass/:id", createClass );

app.post("/upload/:id", upload.single("file"), uploadFile);
app.get('/getStudent/:id',getstudentData )
app.get('/getReportsByRoleAndEmail', async (req, res) => {
  try {
    console.log('Request query:', req.query);
    const { role, email } = req.query;
    if (!role || !email) {
      console.error('Missing required parameters');
      throw new Error('Bad request');
    }
    const reports = await User.findOne({ email: req.query.email })
    .populate('reports')
    .exec();
    res.json(reports);
  } catch (error) {
    console.error('Error:', error);
    res.status(400).json({ error: 'Bad request' });
  }
});


app.get('/getInstructors', async (req, res) => {
  try {
    const instructors = await User.find({ role: 'teacher' }).populate({
      path: 'reports',
      populate: { path: 'user' },
    });
    res.json(instructors);
  } catch (error) {
    console.error('Error:', error);
    res.status(400).json({ error: 'Bad request' });
  }
});

// app.get('/calculateRes', calculateResult)

// app.get('/getResultData', getResultData);

// app.get('/finalgrade', getGrades)

app.get('/calculate/:id', getFinalResult)

app.get('/pdfData/:id', getDbData)
app.get('/generate/:id', generatePdf);

app.delete('/delete-class/:id',deleteData)


app.post('/finalReportCard', generateFinalReport);
app.get('/getFinalReport/:id', getFinalReport);

///**Preview */
app.post('/previewReportCard/:id', previewReportCard);
///**Preview */

///***get final report card PDF*/
app.get('/generateReportCardPDF/:id', generateReportCardPDF);

app.delete('/delete-all-data', deleteAll);
///***get final report card */

const uploadsDir = path.join(__dirname, 'uploads');
const folderPath = path.join(__dirname, './uploads');

const deleteFiles = () => {



if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.error(`Error reading directory: ${err.message}`);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(folderPath, file);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(`Error deleting file ${file}: ${err.message}`);
        } else {
          console.log(`Deleted file: ${file}`);
        }
      });
    });
  });
};

// Schedule the cron job to run every day at midnight
// cron.schedule('0 0 * * *', () => {
//   console.log('Running cron job to delete files...');
//   // deleteFiles();
// });

// const createBackup = (backupPath) => {
//   return new Promise((resolve, reject) => {
//     const backupDir = path.join(__dirname, backupPath);
//     const command = `mongodump --uri="mongodb+srv://testing:UOxBuZW2IC0kmuNl@cluster0.0z1ua.mongodb.net/?retryWrites=true&w=majority" --out=${backupDir}`;

//     exec(command, (error, stdout, stderr) => {
//       if (error) {
//         console.error(`Error creating backup: ${error.message}`);
//         reject(error);
//       } else {
//         console.log(`Backup created successfully: ${stdout}`);
//         resolve(stdout);
//       }
//     });
//   });
// };
// cron.schedule('0 0 * * *', async () => {
//   console.log('Running cron job to delete files and create backup...');
//   // deleteFiles();
//   try {
//     await createBackup('./backups');
//   } catch (error) {
//     console.error('Error during backup creation:', error);
//   }
// });
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
