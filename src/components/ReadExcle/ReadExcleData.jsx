import React, { useState, useEffect } from 'react'
import * as XLSX from "xlsx";
import Axios from 'axios';

const ReadExcleData = () => {

    const [data, setData] = useState([]);

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = (evt) => {
            // Parse data
            const bstr = evt.target.result;
            const workbook = XLSX.read(bstr, { type: "binary" });

            // Get first worksheet name
            const sheetName = workbook.SheetNames[0];
            // Get worksheet
            const worksheet = workbook.Sheets[sheetName];
            // Convert to JSON
            const jsonData = XLSX.utils.sheet_to_json(worksheet, {
                header: 1,
                defval: "",
                raw: false, // process cell formats
                blankrows: false // ignore fully blank rows
            });

            setData(jsonData);
        };

        reader.readAsBinaryString(file);
    };

    const headerMapping = {
        'STOCK_ID': 'STOCKID',
        'REPORT_': 'REPORT_NO',
        'TABLE_': 'TABLE_PERCENT',
        'DEPTH_': 'DEPTH_PERCENT',
        'PRICE_PER_CARAT': 'PRICE_PER_CARAT',
        'EYE_CLEAN': 'EYE_CLEAN',
        'FLUORESCENCE_INTENSITY': 'FLUORESCENCE_INTENSITY',
        'DIAMOND_VIDEO': 'DIAMOND_VIDEO',
        'DIAMOND_IMAGE': 'DIAMOND_IMAGE',
        'GROWTH_TYPE': 'GROWTH_TYPE',
        'FANCY_COLOR_INTENSITY': 'FANCY_COLOR_INTENSITY',
        'FANCY_COLOR': 'FANCY_COLOR',
    };

    function normalizeKey(header) {
        const cleanedKey = header
            .trim()
            .replace(/\s+/g, '_')
            .replace(/[^a-zA-Z0-9_]/g, '') // Remove non-alphanumeric (e.g., #, %, @)
            .toUpperCase();


        return headerMapping[cleanedKey] || cleanedKey;
    }

    function convertToObjects(rows) {
        const headers = rows[0].map(normalizeKey); // Normalize headers
        const dataRows = rows.slice(1);

        return dataRows.map(row => {
            const obj = {};
            headers.forEach((key, index) => {
                // obj[key] = row[index] || '';
                if (key && key.trim() !== '') { // ✅ skip empty keys
                    obj[key] = row[index] || '';
                }
            });
            return obj;
        });
    }

    const uploadData = async () => {
        const sendToDB = convertToObjects(data);
        console.log("Data to be sent to DB: ", sendToDB[0]);
        try {
            const res = await Axios.post('http://localhost:5000/api/upload-excel', sendToDB);
            alert(res.data.message);
        } catch (error) {
            console.error("inrernal Error : ", error);
            alert("Upload failed");
        }
    };





    return (
        <>
            <h1>Read Data from Excel</h1>

            <div>
                <h2>Upload Excel File</h2>
                <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
                <button onClick={uploadData} disabled={data.length === 0}>Upload to DB</button>
                <br />
                <h3>Excel Data:</h3>
                <table border="1">
                    <tbody>
                        {data.map((row, index) => (
                            <tr key={index}>
                                {Object.keys(data[0]).map((col, colIndex) => (
                                    <td key={colIndex}>{row[col]}</td>
                                ))}

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default ReadExcleData
