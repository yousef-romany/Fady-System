module.exports = function (app, connection) {
    app.get("/accounts", (req, res) => {
        res.render("./partials/accounts")
    });
    app.get("/accounts/:name/:date/:dataYears", (req, res) => {
        let sql = `
            SHOW COLUMNS FROM ${ req.params["name"] };
            SELECT * FROM ${ req.params["name"] } WHERE month(dateNow) = ${ req.params["date"] } AND year(dateNow) = ${ req.params["dataYears"] };
        `;
        connection.query(sql, (err, result) => {
            if(err) {
                console.log(err)
                res.send(err)
            }
            res.json({column: result[0], data: result[1] });
        });
    });
};