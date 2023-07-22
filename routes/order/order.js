module.exports = function (app, connection, upload) {
  app.get("/order-page", (request, response) => {
    let sql =
      "SELECT * FROM product;SELECT * FROM fady.storageproduct; SELECT product.NAME_PRODUCT , orders.ID , orders.IMG , orders.AMOUNT, orders.PRICE, orders.TYPEOFBUY, orders.LASTDATINBUY, orders.dateNow FROM orders INNER JOIN product ON orders.IDPRODUCT = product.ID;";
    connection.query(sql, (error, result) => {
      if (error) {
        console.log(error);
        response.send("error in database");
      }
      response.render("./partials/order-page", {
        products: result[0],
        amountProducts: result[1],
        orders: result[2],
      });
    });
  });

  app.post("/AddOrder", upload.single("Img"), (req, res) => {
    let data = {
      Img: req.file.buffer.toString("base64"),
      IDPRODUCT: req.body.want,
      amount: req.body.amount,
      total: req.body.total,
      type: req.body.type,
      dateNow: req.body.dateNow,
      date: req.body.date || "true",
      tel: req.body.tel
    };
    let sql = `
      INSERT INTO orders (IMG, AMOUNT, PRICE, TYPEOFBUY, LASTDATINBUY, IDPRODUCT, dateNow, tel) VALUES ("${data.Img}", ${data.amount}, ${data.total}, "${data.type}", "${data.date}", ${data.IDPRODUCT}, "${data.dateNow}", "${ data.tel }" );
      UPDATE storageproduct set AMOUNT = AMOUNT - ${data.amount} WHERE IDPRODUCT = ${data.IDPRODUCT};
    `;
    connection.query(sql, (error, result) => {
      if (error) {
        console.log(error);
        res.send("error in database");
      }
      res.redirect("/order-page");
    });
  });
  app.post("/deleteOrder/:id", (req, res) => {
    let data = {
      ID: req.params["id"],
    };
    let sql = `
      DELETE FROM orders WHERE ID = ${data.ID} ;
    `;
    connection.query(sql, (error, result) => {
      if (error) {
        console.log(error);
        res.send("error in database");
      }
      res.redirect("/order-page");
    });
  });

  app.post("/SubmitOrder/:id", (req, res) => {
    let data = {
      ID: req.params["id"],
      status: "true"
    };
    let sql = `
      UPDATE orders set LASTDATINBUY = "${ data.status }", TYPEOFBUY="two" WHERE ID = ${ data.ID };
    `;
    connection.query(sql, (error, result) => {
      if (error) {
        console.log(error);
        res.send("error in database");
      }
      res.redirect("/order-page");
    });
  });
};
