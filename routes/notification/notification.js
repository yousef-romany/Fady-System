module.exports = function (app, connection) {
    app.get("/notificationAlert", (req, res) => {
        let sql = "SELECT * FROM rawmaterials right JOIN storagerawmatrail ON rawmaterials.ID = storagerawmatrail.IDMATRAIL;";
        connection.query(sql , (error, result) => {
            if(error) {
                console.log(error)
                res.send("error in database");
            }
            res.json(result);
        });
    });
};