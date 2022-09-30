const mysql = require("mysql2");
const config = require("../conf/config.json");

var pool_app = mysql.createPool(config.db.local_app);
var pool_edge = mysql.createPool(config.db.local_edge);
var pool_bypass = mysql.createPool(config.db.bypass_testdb);

// Database asynchronous operation, encapsulated in a Promise
let query = function (type, sql, values) {
  return new Promise((resolve, reject) => {
    var pool;
    if (type == "edge") {
      pool = pool_edge;
    } else if (type == "bypass") {
      pool = pool_bypass;
    } else {
      pool = pool_app;
    }

    pool.getConnection(function (err, connection) {
      if (err) {
        reject(err);
      } else {
        connection.query(sql, values, (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
          connection.release();
        });
      }
    });
  });
};

module.exports = { query };
