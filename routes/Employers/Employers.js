module.exports = function (app, connection, upload) {
  // start employer section
  app.get("/Employers", (req, res) => {
    let sql = "SELECT * FROM Emplyers";
    connection.query(sql, (err, result, fields) => {
      if (err) throw err;
      res.render("./partials/employers", { Data: result });
    });
  });

  app.post("/allEmployer", upload.single("ImgID"), (req, res) => {
    const Item = {
      ImgID: req.file.buffer.toString("base64"),
      Number: req.body.Number,
      typeOfEmployer: req.body.typeOfEmployer,
      sallary: req.body.sallary,
    };
    console.log(req.file)
    console.log(Item.ImgID)
    let sql = `
    INSERT INTO Emplyers ( 	IMGID ,  	NUMBERPHONE  ,SALLARY ,TYPESALLARY  ) VALUES ( '${Item.ImgID}' , ${Item.Number} , ${Item.sallary} , '${Item.typeOfEmployer}')`;
    connection.query(sql, (err, result) => {
      if (err) throw err;
      res.redirect("/Employers");
    });
  });

  app.post("/delete-employer/:id", (req, res) => {
    let id = req.params["id"];
    let sql = `DELETE FROM Emplyers WHERE ID = '${id}'`;
    connection.query(sql, (err, result, fields) => {
      if (err) {
        console.log(err);
        res.send("error in database");
      }
      res.redirect("/Employers");
    });
  });
  app.post("/presence/:id/:typeEmployer/:sallary", (req, res) => {
    const data = {
      id: req.params["id"],
      typeEmployer: req.params["typeEmployer"],
      sallary: req.params["sallary"],
      date: req.body.date,
      CHECKBOX: req.body.chackBox || "off",
    };

    const sql = `
      INSERT INTO presence (ID_EMPLOYER, dateNow, TYPESALLARY, SALLARY_EMPLOYER, CHECKBOX) 
        VALUES (${data.id}, "${data.date}", "${data.typeEmployer}", ${data.sallary}, "${data.CHECKBOX}")
        ON DUPLICATE KEY UPDATE CHECKBOX = "${data.CHECKBOX}";
      `;
    connection.query(sql, (err, result) => {
      if (err) throw res.send("error in database");
      res.redirect("/Employers");
    });
  });
  app.post("/catch/:id/:typeEmployer/:sallary", (req, res) => {
    const data = {
      id: req.params["id"],
      sallary: req.params["sallary"],
      date: req.body.date,
    };

    const sql = `INSERT INTO catch (IDEMPLOYER , dateNow , SALLAERY) 
        VALUES (${data.id}, "${data.date}", ${data.sallary})`;
    connection.query(sql, (err, result) => {
      if (err) throw res.send("error in database");
      res.redirect("/Employers");
    });
  });
  app.get("/getEmployerData/:id", (req, res) => {
    const id = req.params["id"];
    const sql = `SELECT * FROM presence WHERE ID_EMPLOYER = ${id}`;
    connection.query(sql, (err, result) => {
      if (err) throw res.send("error in database");
      res.json(result);
    });
  });
  app.post("/DeletePresnce/:id", (req, res) => {
    let sql = ` DELETE FROM presence WHERE ID = ${req.params["id"]} `;
    connection.query(sql, (err, result) => {
      if (err) throw res.send("error in database");
      res.redirect("/Employers");
    });
  });
  app.get("/getById/:date/:dataYears", (req, res) => {
    let sql = `
      SELECT * FROM presence
        WHERE month(dateNow) = ${req.params["date"]} AND year(dateNow) = ${req.params["dataYears"]} ;
    `;
    connection.query(sql, (err, result) => {
      if(err) {
        res.send("error in database")
        console.log(err)
      } 
      res.json(result);
    });
  });
  // end employer section
};
