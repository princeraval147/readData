const express = require('express');
const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Base paths
const sourceDir = path.join('E:', 'Work', 'BhaktiGems', 'Sarin');
const doneDir = path.join(sourceDir, 'Done');
const errorDir = path.join(sourceDir, 'Error');

// ✅ MySQL connection 
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "test",
    multipleStatements: true
})

db.connect((err) => {
    if (err) {
        console.error('MySQL connection error:', err);
        return;
    }
    console.log('Connected to MySQL');
});


app.use(cors());
// app.use(express.json());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));



app.get('/csv/:filename', (req, res) => {
    const filename = req.params.filename.trim();
    const filePath = path.join(sourceDir, filename);

    fs.readFile(filePath, 'utf8', (readErr, data) => {
        if (readErr) {
            console.error('Error reading file:', readErr.message);

            // Try to move to Error folder
            const errorPath = path.join(errorDir, filename);
            fs.rename(filePath, errorPath, (moveErr) => {
                if (moveErr) {
                    console.error('Failed to move file to Error:', moveErr.message);
                } else {
                    console.log(`File moved to Error/: ${filename}`);
                }
            });

            return res.status(500).json({ error: 'Failed to read CSV, moved to Error' });
        }

        // Success: send file and move to Done
        res.send(data);

        setTimeout(() => {
            const donePath = path.join(doneDir, filename);
            fs.rename(filePath, donePath, (moveErr) => {
                if (moveErr) {
                    console.error('Failed to move file to Done:', moveErr.message);
                } else {
                    console.log(`File moved to Done/: ${filename}`);
                }
            });
        }, 1000);
    });
});

app.get('/csv-files', (req, res) => {
    const sourceDir = path.join('E:', 'Work', 'BhaktiGems', 'Sarin');

    fs.readdir(sourceDir, (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read folder' });
        }

        const csvFiles = files.filter(file => file.toLowerCase().endsWith('.csv'));
        res.json(csvFiles);
    });
});

// ✅ API to save CSV data
app.post('/api/save-csv', (req, res) => {
    const csvData = req.body.data;
    if (!Array.isArray(csvData) || csvData.length === 0) {
        return res.status(400).json({ message: 'No data to insert' });
    }

    // Customize this based on your database schema
    const insertQuery = `
        INSERT INTO planning (TAG, USERNAME, STONENAME, KAPAN, PACKET, ROUGHWGT, PARTWGT, POLISHWGT, COLOR, SHAPE, CLARITY, CUT, EX1, EX2, PRICEPERCARAT, PRICEDISCOUNT, VALUENOCOMMA, LENGTH, WIDTH, TOTALPRICE, TOTALPOLISHWGT, TOTALPARTUSAGE) VALUES ?
    `;

    const values = csvData.map(row => [
        row['Tag'],
        row['CurrentUserName'],
        row['StoneName'],
        row['Kapan'],
        row['Packet'],
        row['ROUGHWEIGHT'],
        row['PartWeight'],
        row['PolishWeight'],
        row['Color'],
        row['ShapeName'],
        row['Clarity'],
        row['CutGrade'],
        row['EX'],
        row['EX'],
        row['PricePerCaratNoComma'],
        row['PriceDiscount'],
        row['ValueNoComma'],
        row['Length'],
        row['Width'],
        row['TotalPriceNoComma'],
        row['TotalPolishWeight'],
        row['TotalPartUsage'],
    ]);
    console.log('Column count:', 17);
    console.log('First row value count:', values[0].length);

    db.query(insertQuery, [values], (err, result) => {
        if (err) {
            console.error('Insert error:', err);
            return res.status(500).json({ message: 'DB insert failed' });
        }
        res.json({ message: `Inserted ${result.affectedRows} rows` });
    });
});

// EXCEL Data 
app.post('/api/upload-excel', async (req, res) => {
    const data = req.body[0];
    // console.log("Data = ", req.body[0]);
    console.log("Object Keys Length:", Object.keys(data).length);
    console.log("Object Keys:", Object.keys(data));
    console.log("Object Values Length:", Object.values(data).length);
    console.log("Object Values:", Object.values(data));

    if (!Array.isArray(data) || data.length === 0) {
        return res.status(400).json({ message: 'No data received' });
    }

    // try {

    const insertQuery = `
    INSERT INTO DIAMOND_STOCK (
        STOCK, KAPAN, PACKET, TAG, STOCKID, AVAILABILITY, SHAPE, WEIGHT,
        COLOR, CLARITY, CUT, POLISH, SYMMETRY, FLUORESCENCE_INTENSITY,
        LENGTH, WIDTH, HEIGHT, SHADE, MILKY, EYE_CLEAN, LAB, REPORT_NO,
        LOCATION, COUNTRY, GROWTH_TYPE, PRICE_PER_CARAT, DEPTH_PERCENT, TABLE_PERCENT, FANCY_COLOR, FANCY_COLOR_INTENSITY,
        DIAMOND_VIDEO, DIAMOND_IMAGE
        ) VALUES ?
        `;

    const values = data.map(item => [
        item["STOCK"] || '',
        item["Kapan"] || '',
        item["Packet"] || '',
        item["Tag"] || '',
        item["StockID"] || '',
        item["Availability"] || '',
        item["Shape"] || '',
        item["Weight"] || 0,
        item["Color"] || '',
        item["Clarity"] || '',
        item["Cut"] || '',
        item["Polish"] || '',
        item["Symmetry"] || '',
        item["Fluorescence Intensity"] || '',
        item["Length"] || 0,
        item["Width"] || 0,
        item["Height"] || 0,
        item["Shade"] || '',
        item["MILKY"] || '',
        item["Eye Clean"] || '',
        item["Lab"] || '',
        item["Report"] || '',
        item["City"] || '',
        item["Country"] || '',
        item["Growth Type"] || '',
        item["Price Per Carat"] || 0,
        item["Depth_Percentage"] || 0,
        item["Table_Percentage"] || 0,
        item["Fancy Color"] || 0,
        item["Fancy Color Intensity"] || 0,
        item["Diamond Video"] || '',
        item["Diamond Image"] || ''
    ]);
    // console.log('Received data:', values);
    console.log('Column Count:', values[0].length);

    //     await db.query(insertQuery, [values]);
    //     res.json({ message: 'Data inserted successfully' });
    // } catch (err) {
    //     console.error(err);
    //     res.status(500).json({ message: 'Database error' });
    // }

    db.query(insertQuery, [values], (err, result) => {
        if (err) {
            console.error('Insert error:', err);
            return res.status(500).json({ message: 'DB insert failed' });
        }
        res.json({ message: `Inserted ${result.affectedRows} rows` });
    });
});


// [doneDir, errorDir].forEach(dir => {
//     if (!fs.existsSync(dir)) {
//         fs.mkdirSync(dir);
//     }
// });

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

