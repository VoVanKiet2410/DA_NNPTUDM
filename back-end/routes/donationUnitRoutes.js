const express = require("express");
const router = express.Router();
const donationUnitController = require("../controllers/DonationUnitController");

router.get("/", donationUnitController.getAllUnits);
router.get("/:id", donationUnitController.getUnitById);
router.post("/", donationUnitController.createUnit);
router.put("/:id", donationUnitController.updateUnit);
router.delete("/:id", donationUnitController.deleteUnit);

module.exports = router;
