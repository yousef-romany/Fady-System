module.exports = function (app, connection) {
  app.get("/mix", (req, res) => {
    let sql =
      "SELECT * FROM PRODUCT; SELECT NAMEMATRAIL FROM rawmaterials;SHOW COLUMNS FROM secretmix;SELECT * FROM secretmix";
    connection.query(sql, (err, result) => {
      if (err) throw res.send("error in database");

      res.render("./partials/mix", {
        nameProduct: result[0],
        RAWMATRAILS: result[1],
        nameColumns: result[2].slice(2, 1000),
        getMaxs: result[3],
      });
      console.log(result[1])
    });
  });
  app.post("/MixSecrets", (req, res) => {
    let keys = Object.keys(req.body);
    let values = Object.values(req.body).slice(1, 1000);
    let nameValue = req.body["NAMEPRODUCT"];
    let sql = `INSERT INTO secretmix VALUES (null,${nameValue}, ${values} );`;
    console.log(sql);
    connection.query(sql, (err, result) => {
      if (err) {
        res.send("error in database");
        console.log(err.errno);
        console.log(result);
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
    console.log(sql);
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
    console.log(sql);
    connection.query(sql, (err, result) => {
      if (err) {
        res.send("error in database");
        console.log(err);
      }
      res.redirect("/mix");
    });
  });
};
// for select ( form-select mb-3 )
// for input ( form-control )
// for buttons ( btn btn-primary btn-lg )
