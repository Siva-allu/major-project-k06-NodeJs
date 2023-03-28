var express = require('express');
var router = express.Router();
var pg = require('pg')
const cors = require("cors");
router.use(cors());
//PostgreSQL



var conString = "postgres://tndgeykf:iloSBvPS3CbPtryGydIvs5iWKAkZxuGG@tiny.db.elephantsql.com/tndgeykf?idleTimeoutmillis=1000"
var client=new pg.Client(conString);
client.connect(function (err) {
  if (err) throw err;
  console.log("PostgreSQL Database Connected!");
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
      console.log(user[0].user_type);
      if (password === user[0].password) {
        res.status(200).json({
          message: 'success',
          user_type: user[0].user_type,
          user_id:user[0].user_id
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
    message: "Database error", //Database connection error
  });
 }

});
router.get('/getAllChemicalNames', async function (req, res) {
  try {
    const data = await client.query(`select chemical_id,chemical_name from chemical;`);
    const chemicalData = data.rows;
    res.status(200).send(chemicalData);
  } catch (error) {
   console.log(error);
   res.status(500).json({
     message: "Database error ", //Database connection error
   });
  }
 
 });

 router.get('/getChemicalNames', async function (req, res) {
  try {
    const data = await client.query(`select chemical_name from chemical;`);
    const chemicalData = data.rows;
    res.status(200).send(chemicalData);
  } catch (error) {
   console.log(error);
   res.status(500).json({
     message: "Database error ", //Database connection error
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
     message: "Database error", //Database connection error
   });
  }
 });

 router.get('/labDetails', async function (req, res) {
  try {
    const data = await client.query(`select * from lab;`);
    const chemicalData = data.rows;
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    res.status(200).send(chemicalData);
  } catch (error) {
   console.log(error);
   res.status(500).json({
     message: "Database error ", //Database connection error
   });
  }
 });
 router.get('/labDetailsUtil', async function (req, res) {
  const {dept_id}=req.query;
  console.log(dept_id)
  try {
    const data = await client.query(`select * from lab where dept_id=$1;`,[dept_id]);
    const chemicalData = data.rows;
    res.status(200).send(chemicalData);
  } catch (error) {
   console.log(error);
   res.status(500).json({
     message: "Database error ", //Database connection error
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
     message: "Database error ", //Database connection error
   });
  }
 });

 router.get('/deptDetails', async function (req, res) {
  try {
    const data = await client.query(`select * from department;`);
    const chemicalData = data.rows;
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
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
     message: "Database error ", //Database connection error
   });
  }
 });

 router.get('/getStock',async function (req,res){
  const {chemical_name}=req.query;
  try{
    const chemical_id_query = await client.query(`SELECT chemical_id from chemical where chemical_name=$1;`,[chemical_name]);
    const chemical_id = chemical_id_query.rows[0].chemical_id;
    const stockDataQuery = await client.query(`select * from stock where chemical_id=$1`,[chemical_id]);
    const stockData = stockDataQuery.rows;
    console.log(stockDataQuery.rows);
    res.status(200).send(stockData);
  }catch (err) {
    //console.log(err);
    res.status(500).json({
      message: "Database error ", //Database connection error
    });
  };


 })

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
      message: "Database error ", //Database connection error
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
      message: "Database error ", //Database connection error
    });
  };
});

router.get('/removeUser', async function (req, res) {
  const { user_name } = req.query;
  //console.log(username);
  try {
    
    const result = await client.query(`DELETE FROM users where username=$1`, [user_name]);
    res.status(200).send({
      message:"User Successfully Removed."
    })
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Database error ", //Database connection error
    });
  };
});

router.get('/removeLab', async function (req, res) {
  const { lab_name } = req.query;
  //console.log(username);
  try {
    
    const result = await client.query(`DELETE FROM lab where lab_name=$1`, [lab_name]);
    res.status(200).send({
      message:"Lab Successfully Removed."
    })
  } catch (err) {
    //console.log(err);
    res.status(500).json({
      message: "Database error ", //Database connection error
    });
  };
});

router.get('/addDepartment', async function (req, res) {
  const { dept_name } = req.query;
  //console.log(username);
  try {
    const check = await client.query(`select dept_name from department where dept_name=$1;`,[dept_name]);
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
      message: "Database error ", //Database connection error
    });
  };
});


router.get('/addLab', async function (req, res) {
  const { lab_name,room_no,dept_name } = req.query;
  //console.log(username);
  try {
    const check = await client.query(`select lab_name from lab where lab_name=$1;`,[lab_name]);
    const flag = check.rows;
    if(flag.length !=0){
      res.status(200).send({
        message:"Lab Already Exists."
      })
    }
    else{
    const dept_id_data = await client.query(`select dept_id from department where dept_name=$1;`,[dept_name]);
    const dept_id=dept_id_data.rows[0]["dept_id"]
    console.log(dept_id);
    const result = await client.query(`insert into lab(lab_name,room_no,dept_id) values($1,$2,$3);`, [lab_name,room_no,dept_id]);
    res.status(200).send({
      message:"Lab Successfully Created."
    })}
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Database error ", //Database connection error
    });
  };
});

router.get('/getUnits',async function(req,res){
  const {chemical_name}=req.query;
  try {
    const data = await client.query(`select unit from units where physical_state=(select physical_state from chemical where chemical_name = $1);`,[chemical_name]);
    const chemicalData = data.rows;
  
    res.status(200).send(chemicalData);
  } catch (error) {
   console.log(error);
   res.status(500).json({
     message: "Database error ", //Database connection error
   });
  }

});


router.get('/addQuantity', async function (req, res) {
  var { chemical_name, quantity,lab_name,user_id } = req.query;
  quantity=Number(quantity);
  try {
    const chemical_id_data= await client.query(`select chemical_id from chemical where chemical_name=$1;`,[chemical_name]);
    const chemical_id=chemical_id_data.rows[0]["chemical_id"];
    const lab_id_data= await client.query(`select lab_id from lab where lab_name=$1;`,[lab_name]);
    const lab_id = lab_id_data.rows[0]["lab_id"];
    const check = await client.query(`select quantity from stock where chemical_id=$1 and lab_id=$2;`,[chemical_id,lab_id]);
    const flag = check.rows;
    
    if(flag.length ==0){
    const data = await client.query(`insert into stock values($1,$2,$3);`,[chemical_id,Number(quantity),lab_id]);
    await client.query(`insert into logs(lab_id,chemical_id,action_type,quantity,user_id) values($1,$2,'add',$3,$4)`,[lab_id,chemical_id,quantity,Number(user_id)]);
    console.log(typeof(quantity));
    res.status(200).send({
      message:"Stock Updated"
    })
    }
    else{
      const currentStock = Number(flag[0]["quantity"]);
      var newStock = currentStock+quantity;
      console.log(typeof(currentStock));
      console.log(typeof(quantity));

      const data = await client.query(`update stock set quantity = $1 where chemical_id=$2 and lab_id =$3;`,[Number(newStock),chemical_id,lab_id]);
      await client.query(`insert into logs(lab_id,chemical_id,action_type,quantity,user_id) values($1,$2,'add',$3,$4)`,[lab_id,chemical_id,quantity,Number(user_id)]);
      res.status(200).send({
        message:"Stock Updated"
      })

    }

    
  } catch (error) {
   console.log(error);
   res.status(500).json({
     message: "Database error ", //Database connection error
   });
  }
 
});

router.get('/removeQuantity', async function (req, res) {
  var { chemical_name, quantity,lab_name,user_id } = req.query;
  quantity=Number(quantity);
  try {
    const chemical_id_data= await client.query(`select chemical_id from chemical where chemical_name=$1;`,[chemical_name]);
    const chemical_id=chemical_id_data.rows[0]["chemical_id"];
    const lab_id_data= await client.query(`select lab_id from lab where lab_name=$1;`,[lab_name]);
    const lab_id = lab_id_data.rows[0]["lab_id"];
    const check = await client.query(`select quantity from stock where chemical_id=$1 and lab_id=$2;`,[chemical_id,lab_id]);
    const flag = check.rows;
    
    if(flag.length ==0){
    res.status(200).send({
      message:"Chemical not available in the lab."
    })
    }
    else{
      const currentStock = Number(flag[0]["quantity"]);
      var newStock = currentStock-quantity;
      const data = await client.query(`update stock set quantity = $1 where chemical_id=$2 and lab_id =$3;`,[Number(newStock),chemical_id,lab_id]);
      await client.query(`insert into logs(lab_id,chemical_id,action_type,quantity,user_id) values($1,$2,'remove',$3,$4)`,[lab_id,chemical_id,quantity,Number(user_id)]);
      res.status(200).send({
        message:"Stock Updated"
      })

    }

    
  } catch (error) {
   console.log(error);
   res.status(500).json({
     message: "Database error ", //Database connection error
   });
  }
 
});

router.get('/stock', (req, res) => {
  const sql = `
  SELECT c.chemical_name, s.quantity, l.lab_name, d.dept_name, u.unit
  FROM stock s
  JOIN chemical c ON s.chemical_id = c.chemical_id
  JOIN lab l ON s.lab_id = l.lab_id
  JOIN department d ON l.dept_id = d.dept_id
  JOIN units u ON c.physical_state = u.physical_state;
  `;

  client.query(sql, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send('An error occurred while retrieving stock.');
    } else {
      
      res.status(200).json(results.rows);
    }
  });
});

router.get('/logs', (req, res) => {
  const sql = `
  SELECT logs.log_id, lab.lab_name, chemical.chemical_name, logs.action_type, logs.quantity, units.unit, users.username, 
CAST(logs.timestamp AS DATE) as log_date, to_char(CAST(logs.timestamp AS TIME), 'HH:MI:SS AM') as log_time
FROM logs
JOIN lab ON logs.lab_id = lab.lab_id
JOIN chemical ON logs.chemical_id = chemical.chemical_id
JOIN users ON logs.user_id = users.user_id
JOIN units ON chemical.physical_state = units.physical_state;
  `;

  client.query(sql, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send('An error occurred while retrieving stock.');
    } else {
      
      res.status(200).json(results.rows);
    }
  });
});



//MongoDB 
const {MongoClient } = require("mongodb");
const uri= "mongodb+srv://221910311060:U62Bwuj0C0hiGyV4@cluster0.1jwtxul.mongodb.net/?retryWrites=true&w=majority";
const mongoClient= new MongoClient(uri);

router.get('/chemicalProperties',async function (req,res){
  var {chemicalId}=req.query
  let item= await mongoClient.db("Chemicals").collection("properties").findOne({cid: parseInt(chemicalId)});
  res.status(200).send(item);
})
// async function helper() {
// let item= await mongoClient.db("Chemicals").collection("properties").findOne({cid: 1});
// console.log(item);
// let updateItem= await mongoClient.db("Chemicals").collection("properties").updateOne({cid: 1},{
//   $set:{
//     precaution:"Water3"
//   }

// });
// console.log(updateItem);
// let updated= await mongoClient.db("Chemicals").collection("properties").findOne({cid: 1});
// console.log(updated);
// }
// helper();

















































module.exports = router;
