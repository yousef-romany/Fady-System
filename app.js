const express = require("express");
const app = express();
const router = express.Router();
let path = require("path");
const publicPath = path.join(__dirname, "./views");
const livereload = require("livereload");
const liveReloadServer = livereload.createServer();
const connectLivereload = require("connect-livereload");
let reload = require("express-reload");
const db = require("mysql");
const { connect } = require("http2");
const { get } = require("http");
const { response } = require("express");
const { render } = require("ejs");
app.use(connectLivereload());
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});
app.use(express.urlencoded({ extended: true }));
app.use(express.static(publicPath));
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use("/", router);
app.listen(process.env.port || 3000);
console.log("Web Server is listening at port " + (process.env.port || 3000));

//------------------------------------------------------------------------------------------------------------------------
/* 
  sql connection 
*/
let connection = db.createConnection({
  host: "localhost",
  user: "root",
  database: "fady",
  password: "",
  multipleStatements: true,
});

connection.connect(function (err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }
  console.log("connected as id " + connection.threadId);
});

//------------------------------------------------------------------------------------------------------------------------

app.get("/", (request, response) => {
  response.render("pages-sign-in");
});
app.get("/notification-page", (request, response) => {
  response.render("notification-page");
});

app.get("/pages-sign-in", (request, response) => {
  response.render("pages-sign-in");
});
app.get("/pages-profile", (request, response) => {
  response.send("<a href='/index'>Back</a>");
});

app.get("/charts-chartjs", function (request, response) {
  response.render("charts-chartjs");
});

// start login authontacition

app.post("/Login", (req, res) => {
  const login = {
    username: req.body.email,
    pass: req.body.password,
  };

  let sql = `SELECT * FROM Users WHERE UserName LIKE "${login.username}" AND Password LIKE "${login.pass}" ;`;
  connection.query(sql, (err, result) => {
    let a = [];
    if (result.length === a.length) {
      console.log(err);
      res.redirect("/");
    } else {
      console.log(result);
      res.redirect("/index");
    }
  });
});

// end login authontacition

//-------------------------------- Start index  ---------------------------------------------

/*

connection.query('SELECT ?; SELECT ?', [1, 2], function(err, results) {
  if (err) throw err;

  // `results` is an array with one element for every statement in the query:
  console.log(results[0]); // [{1: 1}]
  console.log(results[1]); // [{2: 2}]
});

*/

app.get("/index", (req, res) => {
  let sql =
    "SELECT COUNT(nameEm) AS CounterEm FROM Emplyers ; SELECT COUNT(nameOrder) AS CounterOrder FROM Orderr; SELECT optionOrder , nameOrder , numberOrder, amountOrder , idOrder , money , nameSetting ,TimeInOrder FROM Orderr a INNER JOIN SettingPro l ON a.optionOrder = l.price; SELECT money FROM Orderr ;SELECT SUM(money) as NUMBBBER FROM Orderr;SELECT COUNT(namePro) as LenghtOfPROO FROM Prodect WHERE PagePro = 3 ; SELECT nameOrder FROM Orderr GROUP BY nameOrder; SELECT SUM(money) as NUMBBBER , nameOrder FROM Orderr GROUP BY nameOrder; ";
  connection.query(sql, [1, 2], (error, result) => {
    if (error) throw error;
    res.render("index", {
      Data1: result[0],
      Data2: result[1],
      Data3: result[2],
      Data4: result[3],
      Data5: result[4],
      Data6: result[5],
      Data7: result[6],
      Data8: result[7],
    });
  });
});

//-------------------------------- end index  ---------------------------------------------

//-----------------------------------------------------------------------------
app.get("/Employers", (req, res) => {
  let sql = "SELECT * FROM Emplyers";
  connection.query(sql, (err, result, fields) => {
    if (err) throw err;
    res.render("Employers", { Data: result });
  });
});

app.post("/allEmployer", (req, res) => {
  const Item = {
    Name: req.body.Name,
    Number: req.body.Number,
    id: req.body.Id,
    Add: req.body.Address,
  };

  let sql = `INSERT INTO Emplyers ( 	nameEm ,  	NationalIdEm  ,AddressEm ,numberEm  ) VALUES ( '${Item.Name}' , '${Item.id}' , '${Item.Add}' , '${Item.Number}')`;
  connection.query(sql, (err, result) => {
    if (err) throw err;
    console.log("2 record inserted");
  });
  res.redirect("/Employers");
});

app.post("/delete-employer/:id", (req, res) => {
  let id = req.params["id"];
  let sql = `DELETE FROM Emplyers WHERE idEmployer = '${id}'`;
  connection.query(sql, (err, result, fields) => {
    if (err) throw err;
    res.redirect("/Employers");
  });
});

//-----------------------------------------------------------------------------

//-------------------------------- start storage1 , storage2  ---------------------------------------------

app.get("/Storage", (request, response) => {
  let sql =
    "SELECT  idPro , namePro , amountPro , nameSetting FROM  `Prodect` a LEFT JOIN SettingPro l ON a.namePro = l.price WHERE NOT PagePro='3' ORDER BY PagePro DESC ; SELECT * FROM SettingPro";

  connection.query(sql, (err, result, fields) => {
    if (err) throw err;
    response.render("Storage", { Data: result[0], Data2: result[1] });
    console.log(result);
  });
});

app.post("/AddInStorage", (req, res) => {
  const Item = {
    Name: req.body.Name,
    Number: req.body.Number,
  };
  let sql = `INSERT INTO Prodect (namePro, amountPro , PagePro) VALUES ( '${Item.Name}' , '${Item.Number}' , "2") ;  `;
  connection.query(sql, (err, result) => {
    if (err) throw err;
    console.log("good");
  });
  res.redirect("/Storage");
});

app.post("/ChangeInProdect/:id", (req, res) => {
  let idd = req.params["id"];

  let body = {
    number: req.body.Number,
  };

  let sql = `UPDATE Prodect SET amountPro  = ${body.number} WHERE idPro = ${idd} `;

  connection.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result.affectedRows + " record(s) updated" + idd);
    res.redirect("/Storage");
  });
});

/*

update DemoTable set Score=Score-2 where Score > 30;
SELECT column_name(s)
FROM table_name
WHERE EXISTS
(SELECT column_name FROM table_name WHERE condition); 
*/

app.post("/deleteProdect/:id", (req, res) => {
  let id = req.params["id"];
  let sql = `DELETE FROM Prodect WHERE idPro = '${id}'`;
  connection.query(sql, (err, result) => {
    if (err) throw err;
    console.log("Number of records deleted: " + result.affectedRows);
    res.redirect("/Storage");
  });
});

app.get("/Storage2", (request, response) => {
  let sql =
    "SELECT namePro , amountPro FROM Prodect WHERE NOT PagePro='1' AND NOT PagePro='2' GROUP BY namePro";
  connection.query(sql, function (err, result, fields) {
    if (err) throw err;
    response.render("Storage2", { Data: result });
  });
});

app.post("/AddStorage2", (request, response) => {
  const Item = {
    Name: request.body.Name,
    Number: request.body.Number,
  };
  let sql = `INSERT INTO Prodect (namePro, amountPro , PagePro) VALUES ( '${Item.Name}' , '${Item.Number}' , "3")`;
  connection.query(sql, (err, result) => {
    if (err) throw err;
    console.log("2 record inserted");
    response.redirect("/Storage2");
  });
});

//-------------------------------- end storage1 , storage2  ---------------------------------------------

//-------------------------------- start order  ---------------------------------------------

app.get("/order-page", (request, response) => {
  let sql =
    "SELECT optionOrder , nameOrder , numberOrder, amountOrder , idOrder , money , nameSetting ,TimeInOrder FROM Orderr a INNER JOIN SettingPro l ON a.optionOrder = l.price;";
  connection.query(sql, (error, result) => {
    if (error) throw error;
    response.render("order-page", { Data: result });
  });
});

app.get("/detailOrder", (request, response) => {
  let sql = "SELECT * FROM SettingPro";
  connection.query(sql, (err, result, fields) => {
    if (err) throw err;
    response.render("detailOrder", { Data: result });
  });
});

app.post("/AddOrder", (req, res) => {
  let Item = {
    Name: req.body.Name,
    options: req.body.options,
    amount: req.body.amount,
    Number: req.body.Number,
    TimeIn: req.body.TimeIn,
    money: req.body.money,
  };

  let sql = `INSERT INTO Orderr (nameOrder, optionOrder , amountOrder , TimeInOrder ,numberOrder , money) VALUES ( '${Item.Name}' ,'${Item.options}' ,'${Item.amount}' ,'${Item.TimeIn}' , '${Item.Number}' ,  '${Item.money}'); `;
  connection.query(sql, (err, result) => {
    if (err) throw err;
    res.redirect("/order-page");
  });
});

app.post("/DeleteOrder/:id", (req, res) => {
  let id = req.params["id"];
  let sql = `DELETE FROM Orderr WHERE idOrder = '${id}'`;
  connection.query(sql, (err, result) => {
    if (err) throw err;
    console.log("Number of records deleted: " + result.affectedRows);
    res.redirect("/order-page");
  });
});
//-------------------------------- end order  ---------------------------------------------

//-------------------------------- start setting  ---------------------------------------------

app.get("/setting-page", (request, response) => {
  let sql = "SELECT * FROM `SettingPro` ; SELECT * FROM `Users` ; SELECT * FROM `matrail`;";
  connection.query(sql, (error, result) => {
    if (error) throw error;
    response.render("setting-page", { Data1: result[0] , Data2: result[1] , Data3: result[2] });


  });
});

app.post("/settingProdact", (req, res) => {

  let sql2 = "SHOW COLUMNS  FROM `SettingPro`";

  connection.query(sql2, (err, result) => { 
  
    if (err) throw err;



    let Item = {
    
      Name: req.body.Name,
    
      price: req.body.Number,
    
      limad: req.body.limad ,
      
    };
      Object.values(result).forEach( ( val ) => { 

        if (val.Field == "idOption") {
          let string = val.Field ;
          string.replace("idOption" , "");
        } else if (val.Field == "nameSetting") {
          let element = val.Field;
          Item["Name"] = `req.body.${ element }`; 
        } else if (val.Field == "price") {
          let element = val.Field;
          Item["price"] = `req.body.${ element }`; 
        } else if (val.Field == "limad") {
          let element = val.Field;
          Item["limad"] = `req.body.${ element }`; 
        } else {
          let element = val.Field;
          Item[element] = `req.body.${ element }`; 
          
        }
      });

    

    



  
  



      let arr = [];
      Object.keys(Item).forEach((val) => {
        let value = val; 
        arr.push(value);
      });
      
      arr.forEach((item) => {
        item
      });
      

      let mid = Object.keys(Item).forEach((val) => {
        `${ val  } ,`
      });

      let comm = Object.values(Item).forEach((val) => {
        `${ val  } ,`
      });

      
      
      let sql = `
      INSERT INTO SettingPro (
          ${mid}
        ) VALUES (
          ${comm}
        ) `;
        
        
        




  connection.query(sql,
     (err, result) => { 
  
    if (err) throw err;
  
  
    res.redirect("/setting-page");
  
  });
});

});


app.post("/MatAdd" , (req , res) => {

  let Item = {
    name: req.body.nameMat,
    amount: req.body.amountMat,
  };
  let sql = `INSERT INTO matrail (name, amount ) VALUES ( '${Item.name}' , '${Item.amount}'); ALTER TABLE SettingPro ADD ${ Item.name } INT NOT NULL ;`;
  connection.query(sql, (err, result) => {
    if (err) throw err;
    console.log("2 record inserted");
    res.redirect("/setting-page");
  });

});

app.post("/deleteMat/:id" , (req , res) => {
  let id = req.params["id"];
  let sql = `DELETE FROM matrail WHERE name = '${id}' ; ALTER TABLE SettingPro DROP ${id} ;`;
  connection.query(sql, (err, result) => {
    if (err) throw err;
  });
  res.redirect("/setting-page");
});





app.post("/settingOption/:id", (req, res) => {
  let id = req.params["id"];
  let sql = `DELETE FROM SettingPro WHERE idOption = '${id}'`;
  connection.query(sql, (err, result) => {
    if (err) throw err;
  });
  res.redirect("/setting-page");
});

app.post("/SettingUser", (req, res) => {
  let Item = {
    user: req.body.userName,
    pass: req.body.pass,
  };
  let sql = `INSERT INTO Users (UserName, Password) VALUES ( '${Item.user}' ,'${Item.pass}')`;
  connection.query(sql, (err, result) => {
    if (err) throw err;
    console.log("2 record inserted");
    res.redirect("/setting-page");
  });
});

app.post("/SettingDELETEUser/:id", (req, res) => {
  let id = req.params["id"];
  let sql = `DELETE FROM Users WHERE UserId = '${id}'`;
  connection.query(sql, (err, result) => {
    if (err) throw err;
  });
  res.redirect("/setting-page");
});

//-------------------------------- end setting  ---------------------------------------------

//-------------------------------- start start  ---------------------------------------------

app.get("/Start", (request, response) => {
  let sql =
    "SELECT idPro ,amountPro ,PagePro ,nameSetting FROM Prodect a INNER JOIN SettingPro l ON a.namePro = l.price WHERE PagePro='1'";
  connection.query(sql, (error, results, fields) => {
    if (error) throw error;
    response.render("Start", { Data: results });
  });
});

app.get("/addStart", (req, res) => {
  let sql = "SELECT * FROM SettingPro";

  connection.query(sql, (error, result) => {
    if (error) throw error;

    res.render("startPage", { Data: result });
  });
});

app.post("/addStart", (req, res) => {
  let Item = {
    amount: req.body.amountStart,
    options: req.body.SelectStart,
  };
  let sql = `INSERT INTO Prodect (namePro, amountPro ,PagePro ) VALUES ( '${Item.options}' , '${Item.amount}' , "1")`;
  connection.query(sql, (err, result) => {
    if (err) throw err;
    console.log("2 record inserted");
    res.redirect("/addStart");
  });
});

app.post("/deleteStart/:id", (req, res) => {
  let i = req.params["id"];
  let sql = `DELETE FROM Prodect WHERE idPro = '${i}'`;
  connection.query(sql, (err, result) => {
    if (err) throw err;
    res.redirect("/Start");
  });
});

//-------------------------------- end start  ---------------------------------------------




/* 

  option
  |- price
  |-  
  |_ .
  -------------------
  
  storage


*/

app.post("/me" , (req ,res) => {
  let sql2 = "SHOW COLUMNS  FROM `SettingPro`";

  connection.query(sql2, (err, result) => { 
  
    if (err) throw err;
  
    console.log("-----------------------------------");

    let Item = {
    
      Name: req.body.Name,
    
      price: req.body.Number,
    
      limad: req.body.limad ,
      
    };
      Object.values(result).forEach( ( val ) => { 

        if (val.Field == "idOption") {
          let string = val.Field ;
          string.replace("idOption" , "");
        } else if (val.Field == "nameSetting") {
          let element = val.Field;
          Item["Name"] = `req.body.${ element }`; 
        } else if (val.Field == "price") {
          let element = val.Field;
          Item["price"] = `req.body.${ element }`; 
        } else if (val.Field == "limad") {
          let element = val.Field;
          Item["limad"] = `req.body.${ element }`; 
        } else {
          let element = val.Field;
          Item[element] = `req.body.${ element }`; 
          
        }
      });

  let arr = [];
  Object.values(Item).forEach((val) => {
    let value = val; 
    arr.push(value);
  });
  
  arr.forEach((item) => {
    console.log(`${item},`)
  })
  let values = arr.values(Item).forEach( ( item ) => {
    `${ item },`;
  });
  console.log(values);

  });

  res.redirect("/setting-page");
});