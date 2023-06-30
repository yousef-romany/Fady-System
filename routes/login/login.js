module.exports = function (app, connection) {
  // start login authontacition

  app.post("/Login", (req, res) => {
    const login = {
      username: req.body.email,
      pass: req.body.password,
    };
    let sql = `SELECT * FROM Users WHERE userName LIKE "${login.username}" AND PASSWORDUSER LIKE "${login.pass}" ;`;
    connection.query(sql, (err, result) => {
      if (err) throw res.send("error in database");
      let a = [];
      if (result.length === a.length) {
        res.redirect("/");
      } else {
        res.redirect("/index");
      }
    });
  });

  // end login authontacition
};
