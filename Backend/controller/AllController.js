const db = require('../config/db');


// GLobarl
exports.getShape = (req, res) => {
    db.query("SELECT * FROM SHAPE ORDER BY SID", (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: "Faild to fetch Shape" });
        } else {
            res.status(200).json(result);
        }
    });
}

exports.getCut = (req, res) => {
    db.query("SELECT * FROM CUT ORDER BY CID", (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: "Faild to fetch Cut" });
        } else {
            res.status(200).json(result);
        }
    });
}

exports.getColor = (req, res) => {
    db.query("SELECT * FROM color ORDER BY CID", (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: "Faild to fetch Color" });
        } else {
            res.status(200).json(result);
        }
    });
}

exports.getClarity = (req, res) => {
    db.query("SELECT * FROM clarity ORDER BY CID", (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: "Faild to fetch Clarity" });
        } else {
            res.status(200).json(result);
        }
    });
}

exports.getFL = (req, res) => {
    db.query("SELECT * FROM fl", (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: "Faild to fetch FL" });
        } else {
            res.status(200).json(result);
        }
    });
}


// Diamond Stock Routes
exports.addDiamondStock = (req, res) => {
    const { barcode, kapan, lot, tag, certificate, weight, shape, color, clarity, cut, pol, sym, length, width, price, finalprice, party, due } = req.body;
    const query = `INSERT INTO diamond_stock 
        (BARCODE, KAPAN, PACKET, TAG, CERTIFICATE_NUMBER, WEIGHT, SHAPE, COLOR, CLARITY, CUT, POLISH, SYMMETRY, LENGTH, WIDTH, PRICE_PER_CARAT, FINAL_PRICE, PARTY, DUE)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
    // ON DUPLICATE KEY UPDATE
    db.query(query, [barcode, kapan, lot, tag, certificate, weight, shape, color, clarity, cut, pol, sym, length, width, price, finalprice, party, due], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: "Failed to add diamond stock" });
        } else {
            res.status(201).json({ message: "Diamond stock added successfully", id: result.insertId });
        }
    });
}

exports.updateStock = (req, res) => {
    const { id } = req.params;
    const { party } = req.body;
    if (!party) {
        return res.status(400).json({ message: "Party is required." });
    }
    console.log("Updating diamond stock with ID:", id, "to party:", party);
    const query = "UPDATE diamond_stock SET STATUS = 'HOLD', PARTY = ? WHERE ID = ?";
    db.query(query, [party, id], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: "Failed to update diamond stock" });
        } else if (result.affectedRows === 0) {
            res.status(404).json({ error: "Diamond stock not found" });
        } else {
            res.status(200).json({ message: "Diamond stock Hold successfully" });
        }
    });
}

exports.deleteSell = (req, res) => {
    const { id } = req.params;
    console.log("Deleting diamond stock with ID:", id);
    const query = `DELETE FROM diamond_stock WHERE ID = ?`;
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: "Failed to delete diamond stock" });
        } else if (result.affectedRows === 0) {
            res.status(404).json({ error: "Diamond stock not found" });
        } else {
            res.status(200).json({ message: "Diamond stock deleted successfully" });
        }
    });
}