const express = require("express");
const router = express.Router();
const CommandeController = require("../controllers/CommandeController");

router.get("/", CommandeController.get);
router.get("/last", CommandeController.getlast);
router.get("/Medicaments/:id", CommandeController.getMed);
router.get("/User/:id", CommandeController.getUser);
router.post("/add", CommandeController.post);
router.post("/addVente", CommandeController.postVente);
router.put("/update/:id", CommandeController.put);
router.delete("/delete/:id", CommandeController.delete);

module.exports = router;
