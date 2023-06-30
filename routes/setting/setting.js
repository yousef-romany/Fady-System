module.exports = function (app, connection) {
  app.get("/setting-page", (req, res) => {
    let sql = "SELECT * FROM rawmaterials;";
    connection.query(sql, (err, result) => {
      if (err) throw res.send("error in database");
      res.render("./partials/setting", { nameMeterials: result });
    });
  });

  app.post("/newRawMaterials", (req, res) => {
    let data = {
      name: req.body.NameMeterials,
      math: req.body.MathMeterials,
      limit: req.body.MINMeterials,
    };
    let sql = `INSERT INTO rawmaterials (NAMEMATRAIL, math, limitNotification) VALUES ("${data.name}", "${data.math}", ${data.limit});
    ALTER TABLE secretmix ADD \`${data.name}\` INT;
    `;
    connection.query(sql, (err, result) => {
      if (err) {
        console.log(err);
        res.send("error in database");
      }
      res.redirect("/setting-page");
    });
  });
  app.get("/getMath/:id", (req, res) => {
    let sql = `SELECT math FROM rawmaterials WHERE ID = ${req.params["id"]}`;
    connection.query(sql, (error, result) => {
      res.json(result);
    });
  });
  app.post("/ADDMatrailINSTORAGE", (req, res) => {
    let data = {
      select: req.body.SelectMeterials,
      amount: req.body.AmountMeterials,
      price: req.body.PriceMeterials,
      date: req.body.DateMeterials,
    };
    let sql = `
    INSERT INTO storagerawmatrail (IDMATRAIL, AMOUNTMATRAIL) 
    VALUES (${data.select},${data.amount})
    ON DUPLICATE KEY UPDATE AMOUNTMATRAIL = AMOUNTMATRAIL + ${ data.amount };
    INSERT INTO pricerawmatrail (IDMATRAIL,PRICEMATRAIL,DATEMATRAIL)
    VALUES (${data.select},${data.price},"${data.date}")
    `
  
    connection.query(sql, (err, result) => {
      if (err) {
        res.send("error in database");
        console.log(err);
      }
      res.redirect("/setting-page");
    });
  });
  app.post("/deleteRawMatrail", (req, res) => {
    let data = {
      select: req.body.SelectMeterials,
    };
    let sql = `
    DELETE FROM rawmaterials WHERE NAMEMATRAIL = "${data.select}";
    ALTER TABLE secretmix DROP COLUMN \`${data.select}\`;`;
    connection.query(sql, (err, result) => {
      if (err) {
        res.send("error in database");
        console.log(err);
      }
      res.redirect("/setting-page");
    });
  });
  app.get("/roleRawMatrail", (req, res) => {
    let sql = `
    SELECT NAMEMATRAIL FROM rawmaterials; SHOW COLUMNS FROM secretmix;`;
    connection.query(sql, (err, result) => {
      if (err) {
        res.send("error in database");
        console.log(err);
      }
      res.json({ data: result[0], columns: result[1] });
    });
  });
  app.post("/EmptyTable", (req, res) => {
    let sql = "TRUNCATE TABLE secretmix;";
    connection.query(sql, (err, result) => {
      if (err) throw res.send("error in database");
      console.log("empty table");
      res.redirect("/setting-page");
    });
  });
};
