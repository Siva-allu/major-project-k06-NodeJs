var express = require('express');
var router = express.Router();
const { Client } = require('pg')

var conString = "pg://aezutnhcjblues:c08fd9af4f437cf57c09f1a86444e5cbd69080088cfb9913016a74df68b57ddf@ec2-44-199-9-102.compute-1.amazonaws.com:5432/d28opbrh5a49a0?sslmode=true"
const client = new Client({
  user: 'aezutnhcjblues',
  host: 'ec2-44-199-9-102.compute-1.amazonaws.com',
  database: 'd28opbrh5a49a0',
  password: 'c08fd9af4f437cf57c09f1a86444e5cbd69080088cfb9913016a74df68b57ddf',
  port: 5432,
  ssl: {
    rejectUnauthorized: false,
  },
})
client.connect(function (err) {
  if (err) throw err;
  console.log("Database Connected!");
});

router.get('/login', async function (req, res) {
  const { username, password } = req.query;
  try {
    const data = await client.query(`SELECT * FROM users WHERE username= $1;`, [username])
    const user = data.rows;
    if (user.length === 0) {
      res.status(400).json({
        message: "User is not registered, Sign Up first",
      });
    }
    else {
      if (password === user[0].password) {
        res.status(200).json({
          message: 'success'
        });
      }
      else {
        res.status(400).json({
          message: "Enter Correct Password"
        });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Database error occurred while signing in!", //Database connection error
    });
  };
});


router.get('/getAllChemicals', async function (req, res) {
 try {
   const data = await client.query(`select * from chemical;`);
   const chemicalData = data.rows;
   res.status(200).send(chemicalData);
 } catch (error) {
  console.log(error);
  res.status(500).json({
    message: "Database error occurred while signing in!", //Database connection error
  });
 }

});
router.get('/getAllChemicalNames', async function (req, res) {
  try {
    const data = await client.query(`select chemical_name from chemical;`);
    const chemicalData = data.rows;
    res.status(200).send(chemicalData);
  } catch (error) {
   console.log(error);
   res.status(500).json({
     message: "Database error occurred while signing in!", //Database connection error
   });
  }
 
 });

router.get('/getPhysicalStates', async function (req, res) {
  try {
    const data = await client.query(`select physical_state from units;`);
    const chemicalData = data.rows;
    
    res.status(200).send(chemicalData);
  } catch (error) {
   console.log(error);
   res.status(500).json({
     message: "Database error occurred while signing in!", //Database connection error
   });
  }
 });

module.exports = router;
