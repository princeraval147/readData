const db = require("../config/db");
const express = require("express");
const router = express.Router();
const {
    getClarity, getColor, getCut, getFL, getShape,
    addDiamondStock, deleteSell,
    updateStock,
    addSell,
    uploadExcel,
    getDiamondStock,
    register,
    // approve,
    login,
    shareApi,
    SharedAPI,
    apiDiamondStock
} = require("../controller/AllController");
const authenticateToken = require('../middleware/authMiddleware');
const authenticateHeader = require('../middleware/authenticateHeader');

router.get("/api/diamond-stock", authenticateHeader, apiDiamondStock);

// user register/login
router.post("/api/auth/register", register);
// router.post("/api/auth/approve", approve);
router.post("/api/auth/login", login);

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

// Share API
router.post("/api/share-api", authenticateToken, shareApi);
router.get("/api/shared-api-data", authenticateToken, SharedAPI);


module.exports = router;