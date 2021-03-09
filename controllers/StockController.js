var oracledb = require("oracledb");

// Use body parser to parse JSON body

let updateStock = (res, req, ID, QUANTITY) => {
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
    if (QUANTITY) {
      statement += "QUANTITY = :QUANTITY";
      bindValues.QUANTITY = QUANTITY;
    }
    statement += " WHERE ID = :ID";
    bindValues.ID = ID;
    statement = "UPDATE stock SET " + statement;

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
              "PUT MEDICAMENT/update/" + ID + " : Connection released "
            );
          }
        });
      }
    );
  });
};

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
        "SELECT ID , QUANTITY ,DENOMINATION  FROM stock NATURAL JOIN MEDICAMENT",
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
        "INSERT INTO STOCK VALUES " + "(:ID,:QUANTITY) ",
        [req.body.ID, req.body.QUANTITY],
        {
          autoCommit: true,
          outFormat: oracledb.OBJECT, // Return the result as Object
        },
        function (err, result) {
          if (err) {
            // Error
            if (err.message.indexOf("ORA-00001") > -1) {
              updateStock(res, req, req.body.ID, req.body.QUANTITY);
            }
            res.set("Content-Type", "application/json");
            res.status(400).send(
              JSON.stringify({
                status: 400,
                message:
                  err.message.indexOf("ORA-00001") > -1
                    ? "User already exists"
                    : "Input Error",
                detailed_message: err.message,
              })
            );
          } else {
            // Successfully created the resource
            res.status(201).set("Location", "/country").end();
          }
          // Release the connection
          connection.release(function (err) {
            if (err) {
              console.error(err.message);
            } else {
              console.log("POST /STOCK : Connection released");
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
      if (req.body.QUANTITY) {
        statement += "QUANTITY = :QUANTITY";
        bindValues.QUANTITY = req.body.QUANTITY;
      }
      statement += " WHERE ID = :ID";
      bindValues.ID = req.params.ID;
      statement = "UPDATE stock SET " + statement;

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

  delete: (req, res) => {
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
        "DELETE FROM stock WHERE ID = :ID",
        [req.params.id],
        {
          autoCommit: true,
          outFormat: oracledb.OBJECT,
        },
        function (err, result) {
          if (err || result.rowsAffected === 0) {
            // Error
            res.set("Content-Type", "application/json");
            res.status(400).send(
              JSON.stringify({
                status: 400,
                message: err ? "Input Error" : "User doesn't exist",
                detailed_message: err ? err.message : "",
              })
            );
          } else {
            // Resource successfully deleted. Sending an empty response body.
            res.status(204).end();
          }
          // Release the connection
          connection.release(function (err) {
            if (err) {
              console.error(err.message);
            } else {
              console.log(
                "DELETE /deletecountry/" +
                  req.params.deptno +
                  " : Connection released"
              );
            }
          });
        }
      );
    });
  },
};
