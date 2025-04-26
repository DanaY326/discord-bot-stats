const sql = require("msnodesqlv8");

const connection = "server=.;Database=Messages;Trusted_Connection=yes;Driver={SQL Server Native Client 11.0}";
const query = "SELECT * from Messages";

sql.query(connectString, query, (err, rows) => {
    console.log(rows);
})