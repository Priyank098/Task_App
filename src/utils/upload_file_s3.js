const fs = require('fs');
const AWS = require('aws-sdk');
const {sendurl} = require("./sendMail")

const s3 = new AWS.S3({
    accessKeyId: 'AKIA3XN4RXKPFRU44QP2',
    secretAccessKey: 'WL3brWgoQLkoglcJow6OwvN1356hoQ6WrI1YkKkJ'
});
// const fileName = './ExcelFile/excel.xlsx';
// const fileName = './dummy_data/excel3.xlsx';

const uploadFile = (file,email) => {
    // console.log(fileName);
    // fs.readFile(fileName, (err, data) => {
    //     if (err) throw err;
        const params = {
          Bucket: 'my-new-bucket-excel', 
          Key: `excel-file.xlsx${Date.now()}`,
          Body: file
        };
        s3.upload(params, async(s3Err, data) => {
          if (s3Err) throw s3Err
          console.log(`File uploaded successfully at ${data.Location}`)
          await sendurl(email,data.Location)
        });
       }

module.exports = uploadFile

// uploadFile();