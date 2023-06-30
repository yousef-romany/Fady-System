module.exports = function (app, connection) {
  app.get("/Start", (request, response) => {
    let sql = "SELECT * FROM PRODUCT";
    connection.query(sql, (err, result) => {
      if (err) throw res.send("error in database");
      response.render("./partials/start", { products: result });
    });
  });

  app.post("/AddProduct", (req, res) => {
    let Item = {
      NAME: req.body.nameProduct,
    };
    let sql = `INSERT INTO PRODUCT (NAMEPRODUCT) VALUES ('${Item.NAME}')`;
    connection.query(sql, (err, result) => {
      if (err) throw res.send("error in database");
      res.redirect("/Start");
    });
  });

  app.post("/DeleteProduct", (req, res) => {
    let data = {
      selectOption: req.body.selectOption,
    };
    console.log(data.selectOption);
    let sql = `DELETE FROM product WHERE ID = ${data.selectOption}`;
    // DELETE FROM table_name WHERE condition;
    connection.query(sql, (err, result) => {
      if (err) {
        res.send("error in database");
        console.log(err);
      }
      res.redirect("/Start");
    });
  });
  app.post("/StorageProduct", (req, res) => {
    let data = {
      name: req.body.selectOption,
      amount: req.body.amount,
    };
    let sql = `
    INSERT INTO storageproduct (IDPRODUCT,AMOUNT) VALUES (${data.name}, ${data.amount})
    ON DUPLICATE KEY UPDATE AMOUNT = AMOUNT + ${data.amount};
    `;
    connection.query(sql, (err, result) => {
      if (err) {
        res.send("error in database");
        console.log(err);
      }
      res.redirect("/Start");
    });
  });
  app.get("/getMixSecret/:id", (req, res) => {
    let sql = `
      SELECT * FROM secretmix WHERE NAMEPRODUCT = ${req.params["id"]};
    `;
    connection.query(sql, (err, result) => {
      if (err) {
        console.log(err);
        res.send("error in database");
      }
      res.json(result);
    });
  });
  app.get("/notificationMixSecret/:name", (req, res) => {
    let sql = `
    SELECT storagerawmatrail.IDMATRAIL, storagerawmatrail.AMOUNTMATRAIL , rawmaterials.ID , rawmaterials.NAMEMATRAIL
    FROM storagerawmatrail
    LEFT JOIN rawmaterials
    ON storagerawmatrail.IDMATRAIL = rawmaterials.ID
    WHERE rawmaterials.NAMEMATRAIL = "${req.params["name"]}"
    ORDER BY storagerawmatrail.IDMATRAIL;
    `;
    connection.query(sql, (error, result) => {
      if (error) {
        console.log(error);
        res.send("error in database");
      }
      res.json(result);
    });
  });
  app.post("/munis/:id/:amount", (req, res) => {
    let sql = `
      UPDATE storagerawmatrail SET AMOUNTMATRAIL = AMOUNTMATRAIL - ${req.params["amount"]}
      WHERE IDMATRAIL = ${req.params["id"]};
    `;
    connection.query(sql, (err, result) => {
      if (err) {
        console.log(err);
        res.send("error in database");
      }
      res.json(result);
    });
  });
};
