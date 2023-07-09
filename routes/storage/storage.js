module.exports = function (app, connection) {
  app.get("/Storage", (req, res) => {
    let sql = `
    SELECT storageproduct.IDPRODUCT, storageproduct.AMOUNT , product.ID , product.NAME_PRODUCT
    FROM storageproduct
    LEFT JOIN product
    ON storageproduct.IDPRODUCT = product.ID
    ORDER BY storageproduct.IDPRODUCT;
    SELECT storagerawmatrail.IDMATRAIL , storagerawmatrail.AMOUNTMATRAIL , rawmaterials.ID , rawmaterials.NAMEMATRAIL
    FROM storagerawmatrail
    LEFT JOIN rawmaterials
    ON storagerawmatrail.IDMATRAIL = rawmaterials.ID;
    `;
    connection.query(sql , (error, result) => {
      if(error) {
        console.log(error)
        res.send("error in database")
      } 
      
      res.render("./partials/storage", { dataProduct: result[0], dataRawMatrail: result[1] });
    });
  });
};