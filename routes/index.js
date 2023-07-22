module.exports = function (app, connection) {
  //-------------------------------- Start index  ---------------------------------------------
  app.get("/index", (req, res) => {
    let sql =
      "SELECT * FROM Emplyers;SELECT * FROM PRODUCT;SELECT * FROM rawmaterials;SELECT SUM(AMOUNTMATRAIL) AS TOTAL FROM storagerawmatrail";
    connection.query(sql, (error, result) => {
      if (error) throw error;
      res.render("partials/indexPartials", {
        Employers: result[0],
        Products: result[1],
        RawMatrails: result[2],
        RawMatrailsSotarge: result[3],
      });
    });
  });

  //-------------------------------- end index  ---------------------------------------------
};
