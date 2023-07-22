module.exports = function (app, connection) {
  app.get("/accounts", (req, res) => {
    res.render("./partials/accounts");
  });
  app.get("/accounts/:name/:date/:dataYears", (req, res) => {
    let sql = `
            SHOW COLUMNS FROM ${req.params["name"]};
            SELECT * FROM ${req.params["name"]} WHERE month(dateNow) = ${req.params["date"]} AND year(dateNow) = ${req.params["dataYears"]};
        `;
    connection.query(sql, (err, result) => {
      if (err) {
        console.log(err);
        res.send(err);
      }
      res.json({ column: result[0], data: result[1] });
    });
  });
  app.get("/orderAccounts/:date/:dataYears", (req, res) => {
    let sql = `
            SHOW COLUMNS FROM  orders;
            SELECT Orders.*, product.NAME_PRODUCT
            FROM Orders
            LEFT JOIN product ON orders.IDPRODUCT = product.ID
            WHERE month(dateNow) = ${req.params["date"]} AND year(dateNow) = ${req.params["dataYears"]} AND LASTDATINBUY = "true" ;
        `;
    connection.query(sql, (err, result) => {
      if (err) {
        console.log(err);
        res.send(err);
      }
      res.json({ column: result[0], data: result[1] });
    });
  });
  app.get("/orderCatch/:date/:dataYears", (req, res) => {
    let sql = `
            SHOW COLUMNS FROM Catch;
            SELECT catch.* , emplyers.IMGID FROM catch
            LEFT JOIN emplyers ON catch.IDEMPLOYER = emplyers.ID
            WHERE month(dateNow) = ${req.params["date"]} AND year(dateNow) = ${req.params["dataYears"]};
        `;
    connection.query(sql, (err, result) => {
      if (err) {
        console.log(err);
        res.send(err);
      }
      res.json({ column: result[0], data: result[1] });
    });
  });
  app.get("/preCatch/:date/:dataYears", (req, res) => {
    let sql = `
            SHOW COLUMNS FROM presence;
            SELECT emplyers.* , presence.* FROM presence
            LEFT JOIN emplyers ON presence.ID_EMPLOYER = emplyers.ID
            WHERE month(dateNow) = ${req.params["date"]} AND year(dateNow) = ${req.params["dataYears"]} AND presence.CHECKBOX = "on" AND presence.TYPESALLARY = "يومى";
        `;
    connection.query(sql, (err, result) => {
      if (err) {
        console.log(err);
        res.send(err);
      }
      res.json({ column: result[0], data: result[1] });
    });
  });

  app.get("/RawCatch/:date/:dataYears", (req, res) => {
    let sql = `
        SHOW COLUMNS FROM pricerawmatrail;
        SELECT pricerawmatrail.* , rawmaterials.NAMEMATRAIL FROM pricerawmatrail
        LEFT JOIN rawmaterials ON pricerawmatrail.IDMATRAIL = rawmaterials.ID
        WHERE month(dateNow) = ${req.params["date"]} AND year(dateNow) = ${req.params["dataYears"]};`;

    connection.query(sql, (err, result) => {
      if (err) {
        console.log(err);
        res.send(err);
      }
      res.json({ column: result[0], data: result[1] });
    });
  });
};
