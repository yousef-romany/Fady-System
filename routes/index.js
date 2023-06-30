module.exports = function (app , connection) {
//-------------------------------- Start index  ---------------------------------------------
app.get("/index", (req, res) => {
    // let sql =
    //   "SELECT COUNT(nameEm) AS CounterEm FROM Emplyers ; SELECT COUNT(nameOrder) AS CounterOrder FROM Orderr; SELECT optionOrder , nameOrder , numberOrder, amountOrder , idOrder , money , nameSetting ,TimeInOrder FROM Orderr a INNER JOIN SettingPro l ON a.optionOrder = l.price; SELECT money FROM Orderr ;SELECT SUM(money) as NUMBBBER FROM Orderr;SELECT COUNT(namePro) as LenghtOfPROO FROM Prodect WHERE PagePro = 3 ; SELECT nameOrder FROM Orderr GROUP BY nameOrder; SELECT SUM(money) as NUMBBBER , nameOrder FROM Orderr GROUP BY nameOrder; ";
    // connection.query(sql, [1, 2], (error, result) => {
    //   if (error) throw error;
      
    // });
    res.render("partials/indexPartials", {
      Data1: [1,2,3],
      Data2: [1,2,3],
      Data3: [1,2,3],
      Data4: [1,2,3],
      Data5: [1,2,3],
      Data6: [1,2,3],
      Data7: [1,2,3],
      Data8: [1,2,3],
    });
  });
  
  //-------------------------------- end index  ---------------------------------------------
};