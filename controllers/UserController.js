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
        `SELECT ID_USER , NOM_PRENOM,EMAIL,TEL,PASSWORDD,TYPE,IMAGE FROM UTILISATEUR`,
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

  getById: (req, res) => {
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
        "SELECT NOM_PRENOM,EMAIL,TEL,PASSWORDD,TYPE,IMAGE FROM UTILISATEUR WHERE ID_USER = :ID_USER",
        [req.params.id],
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
            res.send(JSON.stringify(result.rows[0]));
          }
          // Release the connection
          connection.release(function (err) {
            if (err) {
              console.error(err.message);
            } else {
              console.log("GET /User : Connection released");
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
        " INSERT INTO UTILISATEUR(NOM_PRENOM,EMAIL,TEL,PASSWORDD,TYPE,IMAGE) VALUES" +
          "(:NOM_PRENOM, :EMAIL, :TEL, :PASSWORDD, :TYPE , :IMAGE) ",
        [
          req.body.NOM_PRENOM,
          req.body.EMAIL,
          req.body.TEL,
          req.body.PASSWORDD,
          req.body.TYPE,
          req.body.IMAGE,
        ],
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
      if (req.body.ID_USER) {
        statement += "ID_USER = :ID_USER";
        bindValues.ID_USER = req.body.ID_USER;
      }
      if (req.body.NOM_PRENOM) {
        statement += "NOM_PRENOM = :NOM_PRENOM";
        bindValues.NOM_PRENOM = req.body.NOM_PRENOM;
      }
      if (req.body.EMAIL) {
        if (statement) statement = statement + ", ";
        statement += "EMAIL = :EMAIL";
        bindValues.EMAIL = req.body.EMAIL;
      }
      if (req.body.TEL) {
        if (statement) statement = statement + ", ";
        statement += "TEL = :TEL";
        bindValues.TEL = req.body.TEL;
      }
      if (req.body.TYP) {
        if (statement) statement = statement + ", ";
        statement += `"TYPE" = :TYPE`;
        bindValues.TYP = req.body.TYPE;
      }
      if (req.body.EMAIL) {
        if (statement) statement = statement + ", ";
        statement += "passwordd = :passwordd";
        bindValues.passwordd = req.body.passwordd;
      }

      statement += " WHERE ID_USER = :ID_USER";
      bindValues.ID_USER = req.params.ID_USER;
      statement = "UPDATE utilisateur SET " + statement;

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
        " BEGIN DELETEUSER(:ID); END;",
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
