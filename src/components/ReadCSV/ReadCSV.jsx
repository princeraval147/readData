import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import Axios from 'axios';

const ReadCSV = () => {
    const [csvFiles, setCsvFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState('');
    const [csvData, setCsvData] = useState([]);
    const [error, setError] = useState(null);

    // Fetch list of available CSV files
    useEffect(() => {
        fetch('http://localhost:5000/csv-files')
            .then(res => res.json())
            .then(setCsvFiles)
            .catch(err => console.error('Failed to load CSV file list:', err));
    }, []);

    function generateTags(count) {
        const tags = [];
        const A_CHAR_CODE = 'A'.charCodeAt(0);
        for (let i = 0; i < count; i++) {
            let tag = '';
            let n = i;
            do {
                tag = String.fromCharCode(A_CHAR_CODE + (n % 26)) + tag;
                n = Math.floor(n / 26) - 1;
            } while (n >= 0);
            tags.push(tag);
        }
        return tags;
    }



    const customHeaders = [
        'CurrentUserName',
        'StoneName',
        'Kapan',
        'Packet',
        'ROUGHWEIGHT',
        'PartWeight',
        'PolishWeight',
        'Color',
        'ShapeName',
        'Clarity',
        'CutGrade',
        'EX',
        'EX',
        'PricePerCaratNoComma',
        'PriceDiscount',
        'ValueNoComma',
        'Length',
        'Width',
        'TotalPriceNoComma',
        'TotalPolishWeight',
        'TotalPartUsage',
    ];


    const handleFileLoad = () => {
        if (!selectedFile) return;

        fetch(`http://localhost:5000/csv/${selectedFile}`)
            .then(res => {
                if (!res.ok) throw new Error('File not found or failed to read');
                return res.text();
            })
            .then((csvText) => {
                const parsed = Papa.parse(csvText, {
                    header: false,
                    skipEmptyLines: true,
                });

                const rawData = parsed.data;

                if (!rawData.length) {
                    setCsvData([]);
                    return;
                }

                // 🟡 Truncate at first row where PartWeight (index 3) is missing
                const validData = [];
                for (const row of rawData) {
                    if (!row[3] || row[3].trim() === '') break;
                    validData.push(row);
                }

                if (!validData.length) {
                    setCsvData([]);
                    return;
                }

                const tags = generateTags(validData.length);

                const dataWithHeaders = validData.map((row, index) => {
                    // const obj = {};
                    const obj = { Tag: tags[index] }; // Add tag as first column
                    // Now manually map row data to expected fields
                    obj['CurrentUserName'] = row[0] ?? '';
                    obj['StoneName'] = (row[1] ?? '').replace(/\s+/g, '-');
                    const [kapan, packet] = obj['StoneName'].split('-');
                    obj['Kapan'] = kapan ?? '';
                    obj['Packet'] = packet ?? '';
                    obj['ROUGHWEIGHT'] = row[2] ?? '';
                    obj['PartWeight'] = row[3] ?? '';
                    obj['PolishWeight'] = row[4] ?? '';
                    obj['Color'] = row[5] ?? '';
                    obj['ShapeName'] = row[6] ?? '';
                    obj['Clarity'] = row[7] ?? '';
                    obj['CutGrade'] = row[8] ?? '';
                    obj['EX1'] = row[9] ?? '';
                    obj['EX2'] = row[10] ?? '';
                    obj['PricePerCaratNoComma'] = row[11] ?? '';
                    obj['PriceDiscount'] = row[12] ?? '';
                    obj['ValueNoComma'] = row[13] ?? '';
                    obj['Length'] = row[14] ?? '';
                    obj['Width'] = row[15] ?? '';
                    obj['TotalPriceNoComma'] = row[16] ?? '';
                    obj['TotalPolishWeight'] = row[17] ?? '';
                    obj['TotalPartUsage'] = row[18] ?? '';
                    return obj;
                });

                setCsvData(dataWithHeaders);
                setError(null);
            })
            .catch(err => {
                console.error('Error reading CSV:', err);
                setCsvData([]);
            });
    };

    const saveToDatabase = async () => {
        try {
            await Axios.post('http://localhost:5000/api/save-csv', { data: csvData });
            alert("Data saved successfully!");
        } catch (error) {
            console.error('Error saving to database:', error);
        }
    };




    return (
        <>

            <div style={{ padding: '20px' }}>
                <h2>Read CSV File</h2>

                <div style={{ marginBottom: '10px' }}>
                    <label>Select File: </label>
                    <select value={selectedFile} onChange={e => setSelectedFile(e.target.value)}>
                        <option value="">-- Choose a CSV file --</option>
                        {csvFiles.map((file, idx) => (
                            <option key={idx} value={file}>{file}</option>
                        ))}
                    </select>
                    <button onClick={handleFileLoad} disabled={!selectedFile} style={{ marginLeft: '10px' }}>
                        Load File
                    </button>
                    <br />
                    <button onClick={saveToDatabase} type='button' disabled={!csvData.length}>
                        Save
                    </button>
                </div>

                {error && <div style={{ color: 'red' }}>Error: {error}</div>}

                {csvData.length > 0 && (
                    <table border="1" cellPadding="5">
                        <thead>
                            <tr>
                                {csvData.length > 0 &&
                                    Object.keys(csvData[0]).map((col, i) => (
                                        <th key={i}>{col}</th>
                                    ))}
                                {/* {Object.keys(csvData[0]).map((col, i) => (
                                <th key={i}>{col}</th>
                            ))} */}
                            </tr>
                        </thead>
                        <tbody>
                            {csvData.map((row, i) => (
                                <tr key={i}>
                                    {Object.values(row).map((val, j) => (
                                        <td key={j}>{val}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </>
    );
};

export default ReadCSV;
