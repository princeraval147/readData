import React, { useEffect, useState } from 'react'
import API from '../../API';
import styles from './ShareAPI.module.css'
import { Box, Button, Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';

const ShareAPI = () => {

    // const [email, setEmail] = useState('');
    // const [name, setName] = useState('');
    const [formData, setFormData] = useState({
        name: "",
        email: "",
    });
    const [status, setStatus] = useState(null); // success or error message
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // setStatus(null);

        const { name, email } = formData;
        if (!name || !email) {
            setStatus('Please fill in both name and email.');
            return;
        }

        setLoading(true);
        try {
            const response = await API.post("/share-api", formData, { withCredentials: true });
            console.log(response.data);
            setStatus(response.data.message || 'Email sent successfully!');
            setFormData({
                name: "",
                email: ""
            })
        } catch (error) {
            setStatus('Failed to send email. Please try again.');
            console.error(error);
        } finally {
            setLoading(false);
        }
        console.log("FormData = ", formData);
    };

    const [apiData, setAPIData] = useState([]);
    const fetchAPIHistory = async () => {
        // const response = API.get('/shared-api-data')
        //     .then(res => setShares(res.data))
        //     .catch(err => console.error('Error fetching shares:', err));
        // setAPIData(response.data);
        try {
            const response = await API.get("/shared-api-data", { withCredentials: true });
            setAPIData(response.data);
        } catch (error) {
            console.error("Can't fetch shared API data : ", error);
        }
    }

    useEffect(() => {
        fetchAPIHistory();
    }, []);

    console.log(apiData);





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
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {apiData.map((share, index) => (
                            <TableRow key={share.id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{share.NAME}</TableCell>
                                <TableCell>{share.RECIPIENT_EMAIL}</TableCell>
                                <TableCell>{new Date(share.SENT_AT).toLocaleDateString()}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}

export default ShareAPI
