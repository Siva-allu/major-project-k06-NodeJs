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

 router.get('/labDetails', async function (req, res) {
  try {
    const data = await client.query(`select * from lab;`);
    const chemicalData = data.rows;
    res.status(200).send(chemicalData);
  } catch (error) {
   console.log(error);
   res.status(500).json({
     message: "Database error occurred while signing in!", //Database connection error
   });
  }
 });

 router.get('/getAllUsers', async function (req, res) {
  try {
    const data = await client.query(`select * from users;`);
    const chemicalData = data.rows;
    res.status(200).send(chemicalData);
  } catch (error) {
   console.log(error);
   res.status(500).json({
     message: "Database error occurred while signing in!", //Database connection error
   });
  }
 });

 router.get('/deptDetails', async function (req, res) {
  try {
    const data = await client.query(`select * from department;`);
    const chemicalData = data.rows;
    res.status(200).send(chemicalData);
  } catch (error) {
   console.log(error);
   res.status(500).json({
     message: "Database error ", //Database connection error
   });
  }
 });

 router.get('/labNames', async function (req, res) {
  try {
    const data = await client.query(`select lab_name from lab;`);
    const chemicalData = data.rows;
    res.status(200).send(chemicalData);
  } catch (error) {
   console.log(error);
   res.status(500).json({
     message: "Database error occurred while signing in!", //Database connection error
   });
  }
 });

 router.get('/registerUser', async function (req, res) {
  const { first_name,last_name,email,mobile,username,password,user_type,lab_name } = req.query;
  //console.log(username);
  try {
    const lab_id_query = await client.query(`SELECT lab_id FROM LAB WHERE lab_name=$1`,[lab_name]);
    const lab_id = lab_id_query.rows[0].lab_id
    const result = await client.query(`insert into users(first_name,last_name,email,mobile,username,password,user_type,lab_id)
       values($1,$2,$3,$4,$5,$6,$7,$8);`, [first_name,last_name,email,mobile,username,password,user_type,lab_id]);
    res.status(200).send({
      message:"User Successfully Created."
    })
  } catch (err) {
    //console.log(err);
    res.status(500).json({
      message: "Database error occurred while signing in!", //Database connection error
    });
  };
});

router.get('/removeDepartment', async function (req, res) {
  const { dept_name } = req.query;
  //console.log(username);
  try {
    
    const result = await client.query(`DELETE FROM department where dept_name=$1`, [dept_name]);
    res.status(200).send({
      message:"Department Successfully Removed."
    })
  } catch (err) {
    //console.log(err);
    res.status(500).json({
      message: "Database error occurred while signing in!", //Database connection error
    });
  };
});

router.get('/addDepartment', async function (req, res) {
  const { dept_name } = req.query;
  //console.log(username);
  try {
    const check = await client.query(`select dept_name from department where dept_name=$1`,[dept_name]);
    const flag = check.rows;
    if(flag.length !=0){
      res.status(200).send({
        message:"Department Already Exists."
      })
    }
    else{
    const result = await client.query(`insert into department(dept_name) values($1);`, [dept_name]);
    res.status(200).send({
      message:"Department Successfully Created."
    })}
  } catch (err) {
    //console.log(err);
    res.status(500).json({
      message: "Database error occurred while signing in!", //Database connection error
    });
  };
});


router.get('/addQuantity', async function (req, res) {
  const { chemical_name, quantity,lab_name } = req.query;
  console.log(chemical_name);
  console.log(quantity);
  console.log(lab_name);
  // try {
    
  // } catch (err) {
  //   console.log(err);
  //   res.status(500).json({
  //     message: "Database error occurred while signing in!", //Database connection error
  //   });
  // };
});


module.exports = router;
