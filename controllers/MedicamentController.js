var oracledb = require("oracledb");

// Use body parser to parse JSON body

var connAttrs = {
  user: "GESTIONPHARMACIE",
  password: "khalil",
  connectString:
    "(DESCRIPTION =(LOAD_BALANCE = ON)(FAILOVER = ON)(ADDRESS =(PROTOCOL = TCP)(HOST = localhost)(PORT = 1521))(ADDRESS = (PROTOCOL = TCP)(HOST = localhost)(PORT=1521))(CONNECT_DATA=(SERVICE_NAME=XE)(FAILOVER_MODE=(TYPE=SELECT)(METHOD = BASIC))))",
};
module.exports = {
  get: (req, res) => {
    "use strict";

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

      connection.execute(
        `SELECT * FROM MEDICAMENT WHERE DENOMINATION like '%${req.query.s}%'`,
        {},
        {
          outFormat: oracledb.OBJECT, // Return the result as Object
        },
        function (err, result) {
          if (err) {
            res.set("Content-Type", "application/json");
            res.status(500).send(
              JSON.stringify({
                status: 500,
                message: "Error getting the MEDICAMENT",
                detailed_message: err.message,
              })
            );
          } else {
            res.contentType("application/json").status(200);
            res.send(JSON.stringify(result.rows));
          }
          // Release the connection
          connection.release(function (err) {
            if (err) {
              console.error(err.message);
            } else {
              console.log("GET /MEDICAMENT : Connection released");
            }
          });
        }
      );
    });
  },

  post: (req, res) => {
    "use strict";
    if ("application/json" !== req.get("Content-Type")) {
      res
        .set("Content-Type", "application/json")
        .status(415)
        .send(
          JSON.stringify({
            status: 415,
            message: "Wrong content-type. Only application/json is supported",
            detailed_message: null,
          })
        );
      return;
    }
    oracledb.getConnection(connAttrs, function (err, connection) {
      if (err) {
        // Error connecting to DB
        res
          .set("Content-Type", "application/json")
          .status(500)
          .send(
            JSON.stringify({
              status: 500,
              message: "Error connecting to DB",
              detailed_message: err.message,
            })
          );
        return;
      }
      connection.execute(
        "INSERT INTO MEDICAMENT (DENOMINATION, FORM, DATEAMM, PRIX) VALUES" +
          "(:DENOMINATION, :FORM, :DATEAMM, :PRIX) ",
        [req.body.DENOMINATION, req.body.FORM, req.body.DATEAMM, req.body.PRIX],
        {
          autoCommit: true,
          outFormat: oracledb.OBJECT, // Return the result as Object
        },
        function (err, result) {
          if (err) {
            // Error
            res.set("Content-Type", "application/json");
            res.status(400).send(
              JSON.stringify({
                status: 400,
                message:
                  err.message.indexOf("ORA-00001") > -1
                    ? "MEDICAMENT already exists"
                    : "Input Error",
                detailed_message: err.message,
              })
            );
          } else {
            // Successfully created the resource
            res.status(201).set("Location", "/MEDICAMENT").end();
          }
          // Release the connection
          connection.release(function (err) {
            if (err) {
              console.error(err.message);
            } else {
              console.log("POST /MEDICAMENT : Connection released");
            }
          });
        }
      );
    });
  },

  put: (req, res) => {
    "use strict";

    if ("application/json" !== req.get("Content-Type")) {
      res
        .set("Content-Type", "application/json")
        .status(415)
        .send(
          JSON.stringify({
            status: 415,
            message: "Wrong content-type. Only application/json is supported",
            detailed_message: null,
          })
        );
      return;
    }

    oracledb.getConnection(connAttrs, function (err, connection) {
      if (err) {
        // Error connecting to DB
        res
          .set("Content-Type", "application/json")
          .status(500)
          .send(
            JSON.stringify({
              status: 500,
              message: "Error connecting to DB",
              detailed_message: err.message,
            })
          );
        return;
      }

      var statement = "",
        bindValues = {};
      if (req.body.ID) {
        statement += "ID = :ID";
        bindValues.ID = req.body.ID;
      }
      if (req.body.DENOMINATION) {
        statement += "DENOMINATION = :DENOMINATION";
        bindValues.DENOMINATION = req.body.DENOMINATION;
      }
      if (req.body.FORM) {
        if (statement) statement = statement + ", ";
        statement += "FORM = :FORM";
        bindValues.FORM = req.body.FORM;
      }
      if (req.body.DATEAMM) {
        if (statement) statement = statement + ", ";
        statement += "DATEAMM = :DATEAMM";
        bindValues.DATEAMM = req.body.DATEAMM;
      }
      if (req.body.PRIX) {
        if (statement) statement = statement + ", ";
        statement += "PRIX = :PRIX";
        bindValues.PRIX = req.body.PRIX;
      }

      statement += " WHERE ID = :ID";
      bindValues.ID = req.params.ID;
      statement = "UPDATE MEDICAMENT SET " + statement;

      connection.execute(
        statement,
        bindValues,
        {
          autoCommit: true,
          outFormat: oracledb.OBJECT, // Return the result as Object
        },
        function (err, result) {
          if (err || result.rowsAffected === 0) {
            // Error
            res.set("Content-Type", "application/json");
            res.status(400).send(
              JSON.stringify({
                status: 400,
                message: err ? "Input Error" : "MEDICAMENT doesn't exist",
                detailed_message: err ? err.message : "",
              })
            );
          } else {
            // Resource successfully updated. Sending an empty response body.
            res.status(204).end();
          }
          // Release the connection
          connection.release(function (err) {
            if (err) {
              console.error(err.message);
            } else {
              console.log(
                "PUT MEDICAMENT/update/" +
                  req.params.ID +
                  " : Connection released "
              );
            }
          });
        }
      );
    });
  },
};
