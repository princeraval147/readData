const db = require("../config/db");
const express = require("express");
const router = express.Router();
const {
    getClarity, getColor, getCut, getFL, getShape,
    addDiamondStock, deleteSell,
    updateStock,
    addSell,
    uploadExcel,
    getDiamondStock
} = require("../controller/AllController");

const authenticateToken = require('../middleware/authMiddleware');


// GLobal Routes
router.get("/api/shape", getShape);
router.get("/api/cut", getCut);
router.get("/api/color", getColor);
router.get("/api/clarity", getClarity);
router.get("/api/fl", getFL);

// Diamond Stock Routes
router.get("/api/get-diamondstock", authenticateToken, getDiamondStock);
router.post("/api/upload-excel", authenticateToken, uploadExcel);
router.post("/api/add-diamondstock", authenticateToken, addDiamondStock);
router.put("/api/update-status/:id", updateStock);
router.delete("/api/delete-stock/:id", deleteSell);
router.post("/api/add-sell", addSell);



module.exports = router;