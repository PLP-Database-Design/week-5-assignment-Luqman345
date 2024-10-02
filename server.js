const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());

//Database connection
const db = mysql.createConnection({
    host:process.env.DB_HOST,
    user:process.env.DB_USERNAME,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_NAME
});

db.connect(err =>{
    if (err) {
        console.error('Database connection failed:' + err.stack);
        return;
    }
    console.log('Connected to database');
});

//Question 1:Retrieve all patients
app.get('/patients',(req,res) => {
    const query = 'SELECT patient_id,first_name,last_name,date_of_birth FROM patients';
    db.query(query,(err,results) => {
        if (err) {
          return res.status(500).json({error:err.message});
        }
        res.json(results);
    });
});

//Question 2:Retrive all providers
app.get('/providers',(req,res) => {
    const query ='SELECT first_name,last_name,provider_specialty FROM providers';
    db.query(query,(err,results) => {
        if(err) {
            return res.status(500).json({error:err.message});
        }
        res.json(results);
    });
});

// Question 3:Filter patients by first name
app.get('/patients/filter', (req,res) =>{
    const firstName = req.query.first_name;
    const query = 'SELECT patient_id,first_name,last_name,date_of_birth FROM patients WHERE first_name = ?';
    db.query(query,[firstName], (err,results) =>{
        if(err) {
            return res.status(500).json({error:err.message});
        }
        res.json(results);
    });
});

//Question 4:Retrive all providers by specialty
app.get('/providers/filter', (req,res) =>{
    const specialty = req.query.specialty;
    const query = 'SELECT first_name,last_name,provider_specialty FROM providers  WHERE provider_specialty = ?';
    db.query(query,[specialty], (err,results) => {
        if(err) {
            return res.status(500).json({error:err.message});
        }
        res.json(results);
    });
});

//listen to the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
