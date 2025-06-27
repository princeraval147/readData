import React, { useEffect, useState } from 'react'
import API from '../../API';
import styles from './ShareAPI.module.css'
import { Box, Button, Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';

const ShareAPI = () => {

    const [apiData, setAPIData] = useState([]);
    const fetchAPIHistory = async () => {
        try {
            const response = await API.get("/shared-api-data", { withCredentials: true });
            setAPIData(response.data);
        } catch (error) {
            console.error("Can't fetch shared API data : ", error);
        }
    }

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        difference: ""
    });
    const [status, setStatus] = useState(null); // success or error message
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { id, value } = e.target;
        const newValue = id === "email" ? value.toLowerCase() : value;
        setFormData(prev => ({
            ...prev,
            [id]: newValue
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // setStatus(null);

        const { name, email } = formData;
        if (!name || !email) {
            setStatus('Please fill the both name and email.');
            return;
        }

        setLoading(true);
        try {
            const response = await API.post("/share-api", formData, { withCredentials: true });
            setStatus(response.data.message || 'Email sent successfully!');
            fetchAPIHistory();
            setFormData({
                name: "",
                email: "",
                difference: ""
            })
        } catch (error) {
            setStatus('Failed to send email. Please try again.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAPIHistory();
    }, []);





    return (
        <>
            <Container maxWidth="sm">
                <form onSubmit={handleSubmit}>
                    <Box
                        sx={{
                            mt: 8,
                            p: 4,
                            border: '1px solid #ccc',
                            borderRadius: 2,
                            backgroundColor: '#fafafa',
                            boxShadow: 3,
                        }}
                    >
                        <Typography variant="h5" gutterBottom>
                            Share API via Email
                        </Typography>
                        <TextField
                            fullWidth
                            label="Name"
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                        <br />
                        <TextField
                            fullWidth
                            label="Email Id"
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="example@example.com"
                            required
                            sx={{ mt: 4 }}
                        />
                        <TextField
                            fullWidth
                            label="Difference (%)"
                            type="number"
                            id="difference"
                            name="difference"
                            value={formData.difference}
                            onChange={handleChange}
                            placeholder="Enter to increase by %"
                            sx={{ mt: 4 }}
                            inputProps={{ max: 100 }}
                        />

                        <br />
                        <br />
                        <Button type='submit' disabled={loading} fullWidth variant='contained'>
                            {loading ? 'Sending...' : 'Send Email'}
                        </Button>

                        {status && (
                            <Typography variant="body2" sx={{ mt: 2 }}>
                                {status}
                            </Typography>
                        )}
                    </Box>
                </form >
            </Container>

            <TableContainer sx={{ maxWidth: 800, margin: 'auto', mt: 3 }}>
                <Typography
                    variant="h6"
                    gutterBottom
                    // sx={{ p: 2 }}
                    sx={{
                        p: 2,
                        fontWeight: 900,
                        fontSize: 30,
                        // backgroundColor: 'primary.main',
                        // color: 'black',
                        textAlign: 'center',
                        borderTopLeftRadius: '4px',
                        borderTopRightRadius: '4px'
                    }}
                >
                    API Share History
                </Typography>
                <Table>
                    <TableHead sx={{ backgroundColor: 'grey.100' }}>
                        <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell>Recipient Name</TableCell>
                            <TableCell>Recipient Email</TableCell>
                            <TableCell>Sent At</TableCell>
                            <TableCell>Difference</TableCell>
                            <TableCell>API Key</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {apiData.map((share, index) => (
                            <TableRow key={share.id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{share.NAME}</TableCell>
                                <TableCell>{share.RECIPIENT_EMAIL}</TableCell>
                                <TableCell>{new Date(share.SENT_AT).toLocaleDateString()}</TableCell>
                                <TableCell>{share.DIFFERENCE}</TableCell>
                                <TableCell>{share.TOKEN}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}

export default ShareAPI
