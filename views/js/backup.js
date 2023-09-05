const fs = require('fs');
const spawn = require('child_process').spawn;
btnBackup.addEventListener("click", () => {
  const dumpFileName = `${Math.round(Date.now() / 1000)}.dump.sql`;

  const writeStream = createWriteStream(dumpFileName);

  const dump = spawn("mysqldump", ["-u", "root", "root", "fady"]);

  const btnBackup = document.getElementById("backup");

  dump.stdout
    .pipe(writeStream)
    .on("finish", function () {
      alert("completed");
      console.log("Completed");
    })
    .on("error", function (err) {
      alert(err);   
      console.log(err);
    });
});
