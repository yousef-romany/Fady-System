module.exports = function (app, connection) {
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
}