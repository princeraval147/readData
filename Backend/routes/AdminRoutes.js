const express = require('express');
const router = express.Router();
const controller = require('../controller/AdminController');
const authenticateToken = require('../middleware/authMiddleware');

router.get("/check", authenticateToken, controller.checkAdmin);
router.get("/total-users", controller.totalUsers);
router.get("/total-stocks", controller.totalStocks);
router.get("/all-users", controller.AllUsers);
router.post("/approve-user", authenticateToken, controller.ApproveUsers);
router.post("/deactivate-user", authenticateToken, controller.DeactivateUsers);
router.get("/stock-by-user", authenticateToken, controller.getStockByUser);

module.exports = router;
