const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");

router.get("/", UserController.get);
router.get("/:id", UserController.getById);
router.post("/add", UserController.post);
router.put("/update/:ID_USER", UserController.put);
router.delete("/delete/:id", UserController.delete);

module.exports = router;
