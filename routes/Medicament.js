const express = require("express");
const router = express.Router();
const MedicamentController=require('../controllers/MedicamentController')

router.get('/',MedicamentController.get);
router.post('/add',MedicamentController.post);
router.put('/update/:ID',MedicamentController.put);

module.exports=router;