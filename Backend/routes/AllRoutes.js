const db = require("../config/db");
const express = require("express");
const router = express.Router();
const {
    getClarity,
    getColor, getCut, getFL, getShape,
    addDiamondStock, deleteSell,
    updateStock,
    addSell,
    uploadExcel,
    getDiamondStock,
    register,
    login,
    shareApi,
    SharedAPI,
    apiDiamondStock,
    ShowSellData,
    ShowHoldsData,
    forgotPassword,
    deleteAllStock,
    checkAdmin,
    totalUsers,
    totalStocks,
    PendingUsers,
    ApproveUsers,
    getStockByUser,
    updateApiStatus,
    updateApiStock,
    unholdApiStock,
    updateApiShares,
    sellViaAPI,
    addApiStock,
    holdApiStock,
    AllDiamonds,
    filterDiamonds,
    getDiamondDetails
} = require("../controller/AllController");
const authenticateToken = require('../middleware/authMiddleware');
const authenticateHeader = require('../middleware/authenticateHeader');


// user register / login
router.post("/api/auth/register", register);
router.post("/api/auth/login", login);
router.post("/api/auth/forgot-password", forgotPassword);

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
router.delete("/api/delete-all-stock", authenticateToken, deleteAllStock);
router.post("/api/add-sell", authenticateToken, addSell);

// Share API
router.post("/api/share-api", authenticateToken, shareApi);
router.get("/api/shared-api-data", authenticateToken, SharedAPI);
router.put("/api/update-api-share/:id", updateApiShares);
// router.put("/api/update-api-status/:id", updateApiStatus); // isActive

// share API Stock
router.get("/api/diamond-stock", authenticateHeader, apiDiamondStock);
router.put("/api/hold-stock", authenticateHeader, holdApiStock);
router.put("/api/unhold-stock", authenticateHeader, unholdApiStock);
router.post("/api/sell-stock", authenticateHeader, sellViaAPI);
router.post("/api/add-stock", authenticateHeader, addApiStock);
router.post("/api/update-stock", authenticateHeader, updateApiStock);



// Reports
router.get("/api/sell_data", authenticateToken, ShowSellData);
router.get("/api/hold_data", authenticateToken, ShowHoldsData);

// Admin Panel
router.get("/api/admin/check", authenticateToken, checkAdmin);
router.get("/api/admin/total-users", totalUsers);
router.get("/api/admin/total-stocks", totalStocks);
router.get("/api/admin/pending-users", PendingUsers);
router.post("/api/admin/approve-user", authenticateToken, ApproveUsers)
router.get("/api/admin/stock-by-user", authenticateToken, getStockByUser);




// Diamonds
router.get("/api/all-diamonds", AllDiamonds);
router.post("/api/filter-diamonds", filterDiamonds);
router.get("/api/diamond/:id", getDiamondDetails);





module.exports = router;