const db = require("../config/db");
const express = require("express");
const router = express.Router();
const {
    getClarity, getColor, getCut, getFL, getShape,
    addDiamondStock, deleteSell,
    updateStock
} = require("../controller/AllController");


// GLobal Routes
router.get("/api/shape", getShape);
router.get("/api/cut", getCut);
router.get("/api/color", getColor);
router.get("/api/clarity", getClarity);
router.get("/api/fl", getFL);

// Diamond Stock Routes
router.post("/api/add-diamondstock", addDiamondStock);
router.put("/api/update-status/:id", updateStock);
router.delete("/api/delete-stock/:id", deleteSell);



module.exports = router;