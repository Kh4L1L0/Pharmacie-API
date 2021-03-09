var oracledb = require("oracledb");

// Use body parser to parse JSON body

const addCommande = (res, req) => {};

var connAttrs = {
  user: "GESTIONPHARMACIE",
  password: "khalil",
  connectString:
    "(DESCRIPTION =(LOAD_BALANCE = ON)(FAILOVER = ON)(ADDRESS =(PROTOCOL = TCP)(HOST = localhost)(PORT = 1521))(ADDRESS = (PROTOCOL = TCP)(HOST = localhost)(PORT=1521))(CONNECT_DATA=(SERVICE_NAME=XE)(FAILOVER_MODE=(TYPE=SELECT)(METHOD = BASIC))))",
};
module.exports = {
  getlast: (req, res) => {
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
        `SELECT max(ID_COMMANDE) as "ID" FROM COMMANDE`,
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
                message: "Error getting the user profile",
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
              console.log("GET /countries : Connection released");
            }
          });
        }
      );
    });
  },

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
        `SELECT COMMANDE.ID_COMMANDE , UTILISATEUR.NOM_PRENOM ,COMMANDE.ID_USER , COMMANDE.DATE_COMMANDE , SUM(MEDICAMENT.PRIX * VENTE.QUANTITY) AS "PrixTotal"
FROM MEDICAMENT ,COMMANDE ,VENTE ,UTILISATEUR
WHERE MEDICAMENT.ID = VENTE.ID AND VENTE.ID_COMMANDE = COMMANDE.ID_COMMANDE AND UTILISATEUR.ID_USER = COMMANDE.ID_USER
GROUP BY COMMANDE.ID_COMMANDE , COMMANDE.DATE_COMMANDE ,COMMANDE.ID_USER ,UTILISATEUR.NOM_PRENOM`,
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
                message: "Error getting the user profile",
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
              console.log("GET /countries : Connection released");
            }
          });
        }
      );
    });
  },

  getMed: (req, res) => {
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
        `SELECT MEDICAMENT.ID , DENOMINATION , PRIX ,  VENTE.QUANTITY FROM VENTE , MEDICAMENT , COMMANDE WHERE VENTE.ID_COMMANDE = COMMANDE.ID_COMMANDE AND  VENTE.ID  = MEDICAMENT.ID AND COMMANDE.ID_COMMANDE = :id `,
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
                message: "Error getting the user profile",
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
              console.log("GET /countries : Connection released");
            }
          });
        }
      );
    });
  },
  getUser: (req, res) => {
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
        `select C.ID_COMMANDE , C.DATE_COMMANDE , SUM(M.PRIX * V.QUANTITY)as "PrixTotal" 
FROM MEDICAMENT M ,COMMANDE C ,VENTE V
Where M.ID = V.ID and V.ID_COMMANDE = C.ID_COMMANDE and C.ID_USER = :id
Group by C.ID_COMMANDE , C.DATE_COMMANDE`,
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
                message: "Error getting the user profile",
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
              console.log("GET /countries : Connection released");
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
        "INSERT INTO Commande (ID_USER, DATE_COMMANDE ) values (:id_user,sysdate)",
        [req.body.ID_USER],
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
                    ? "User already exists"
                    : "Input Error",
                detailed_message: err.message,
              })
            );
          } else {
            // Successfully created the resource
            connection.execute(
              "select ID_COMMANDE FROM COMMANDE WHERE ID_COMMANDE = (SELECT MAX(ID_COMMANDE) FROM COMMANDE",
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
                      message: "Error getting the user profile",
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
                    console.log("GET /countries : Connection released");
                  }
                });
              }
            );

            res.status(201).set("Location", "/country").end();
          }
          // Release the connection
          connection.release(function (err) {
            if (err) {
              console.error(err.message);
            } else {
              console.log("POST /countries : Connection released");
            }
          });
        }
      );
    });

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
        `SELECT ID_COMMANDE FROM COMMANDE WHERE ID_COMMANDE = (SELECT MAX(ID_COMMANDE) FROM COMMANDE)`,
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
                message: "Error getting the user profile",
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
              console.log("GET /countries : Connection released");
            }
          });
        }
      );
    });
  },

  postVente: (req, res) => {
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
        "INSERT INTO VENTE  values (:ID_COMMANDE , :ID , :QUANTITY)",
        [req.body.ID_COMMANDE, req.body.ID, req.body.QUANTITY],
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
              console.log("POST /countries : Connection released");
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
      var updateStatement = function buildUpdateStatement(req) {
        "use strict";
        var statement = "",
          bindValues = {};
        if (req.body.deptno) {
          statement += "deptno = :deptno";
          bindValues.deptno = req.body.deptno;
        }
        if (req.body.dname) {
          if (statement) statement = statement + ", ";
          statement += "dname = :dname";
          bindValues.dname = req.body.dname;
        }
        if (req.body.LOC) {
          if (statement) statement = statement + ", ";
          statement += "LOC = :LOC";
          bindValues.LOC = req.body.LOC;
        }

        statement += " WHERE deptno = :deptno";
        bindValues.deptno = req.params.deptno;
        statement = "UPDATE DEPT SET " + statement;

        return {
          statement: statement,
          bindValues: bindValues,
        };
      };
      connection.execute(
        updateStatement.statement,
        updateStatement.bindValues,
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
                message: err ? "Input Error" : "User doesn't exist",
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
                "PUT /updatecountry/" +
                  req.params.deptno +
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
        `BEGIN DELETECOMMANDE(:id); END;`,
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
