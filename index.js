var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var oracledb = require("oracledb");

let session = { ID: 1 };

// Use body parser to parse JSON body
app.use(bodyParser.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  next();
});

var connAttrs = {
  user: "GESTIONPHARMACIE",
  password: "khalil",
  connectString:
    "(DESCRIPTION =(LOAD_BALANCE = ON)(FAILOVER = ON)(ADDRESS =(PROTOCOL = TCP)(HOST = localhost)(PORT = 1521))(ADDRESS = (PROTOCOL = TCP)(HOST = localhost)(PORT=1521))(CONNECT_DATA=(SERVICE_NAME=XE)(FAILOVER_MODE=(TYPE=SELECT)(METHOD = BASIC))))",
};

const MedicamentRoute = require("./routes/Medicament");
app.use("/Medicament", MedicamentRoute);

const StockRoute = require("./routes/Stock");
app.use("/Stock", StockRoute);

const userRoute = require("./routes/User");
app.use("/User", userRoute);

const commandeRoute = require("./routes/Commande");
app.use("/Commande", commandeRoute);

app.post("/login", function (req, res, next) {
  oracledb.getConnection(connAttrs, function (err, connection) {
    if (err) {
      // Error connecting to DB
      res.set("Content-Type", "application/json");
      res.status(500).send(
        JSON.stringify({
          status: 500,
          message: "Error connecting to DB",
          detailed_message: err.message,
        })
      );
      return;
    }
    //ALTER USER sidney
    //IDENTIFIED BY second_2nd_pwd
    //DEFAULT TABLESPACE example;

    connection.execute(
      `SELECT * FROM UTILISATEUR WHERE EMAIL = '${req.body.email}' AND PASSWORDD = '${req.body.password}' `,
      {},
      {
        outFormat: oracledb.OBJECT, // Return the result as Object
      },
      function (err, result) {
        if (err) {
          res.contentType("application/json").status(200);
          res.send(JSON.stringify(err.message + " " + motdepasse));
        } else {
          res.contentType("application/json").status(200);
          if (result.rows.length != 0) {
            session.ID = result.rows[0].ID_USER;
            res.send(
              JSON.stringify({ exist: true, ID_USER: result.rows[0].ID_USER })
            );
          } else {
            res.send(JSON.stringify({ exist: false, ID: null }));
          }
        }
        // Release the connection
        connection.release(function (err) {
          if (err) {
            console.error(err.message);
          } else {
            console.log("POST /sendTablespace : Connection released");
          }
        });
      }
    );
  });
});

app.get("/session", (req, res) => {
  console.log(session);
  res.send(JSON.stringify(session));
});

var server = app.listen(4000, function () {
  "use strict";

  var host = server.address().address,
    port = server.address().port;

  console.log(" Server is listening at http://%s:%s", host, port);
});
