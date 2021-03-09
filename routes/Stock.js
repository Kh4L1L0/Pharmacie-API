const express = require("express");
const router = express.Router();
const StockController = require("../controllers/StockController");

router.get("/", StockController.get);
router.post("/add", StockController.post);
router.put("/update/:ID", StockController.put);
router.delete("/delete/:id", StockController.delete);

module.exports = router;
