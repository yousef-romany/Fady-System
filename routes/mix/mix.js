module.exports = function (app, connection) {
  app.get("/mix", (req, res) => {
    let sql = `
    SELECT 
    product.ID, product.NAME_PRODUCT 
    FROM product
    WHERE 
    product.ID NOT IN (
      SELECT secretmix.NAMEPRODUCT FROM secretmix WHERE product.ID = secretmix.NAMEPRODUCT
    );
      SELECT NAMEMATRAIL FROM rawmaterials order By ID;
      SHOW COLUMNS FROM secretmix;
      SELECT product.NAME_PRODUCT, secretmix.*  
		FROM product
		RIGHT JOIN secretmix ON product.ID = secretmix.NAMEPRODUCT;`;
    connection.query(sql, (err, result) => {
      if (err) throw res.send("error in database");

      res.render("./partials/mix", {
        nameProduct: result[0],
        RAWMATRAILS: result[1],
        nameColumns: result[2].slice(2, 1000),
        getMaxs: result[3],
      });
    });
  });
  app.post("/MixSecrets", (req, res) => {
    let keys = Object.keys(req.body);
    let values = Object.values(req.body).slice(1, 1000);
    let nameValue = req.body["NAMEPRODUCT"];
    let sql = `
    INSERT INTO secretmix VALUES (null,${nameValue}, ${values} );
    `;
    connection.query(sql, (err, result) => {
      if (err) {
        res.send("error in database");
        console.log(err.errno);
      }
      res.redirect("/mix");
    });
  });
  app.post("/UpdateMixSecrets/:id/:name", (req, res) => {
    let id = req.params["id"];
    let name = req.params["name"];
    let keys = Object.keys(req.body);
    let values = Object.values(req.body);
    let sql = `DELETE FROM secretmix WHERE ID = ${id}; INSERT INTO secretmix VALUES (null,"${name}", ${values} );`;
    connection.query(sql, (err, result) => {
      if (err) {
        res.send("error in database");
        console.log(err);
      }
      res.redirect("/mix");
    });
  });
  app.post("/deleteMix/:id", (req, res) => {
    let id = req.params["id"];
    let sql = `DELETE FROM secretmix WHERE ID = ${id};`;
    connection.query(sql, (err, result) => {
      if (err) {
        res.send("error in database");
        console.log(err);
      }
      res.redirect("/mix");
    });
  });
};
