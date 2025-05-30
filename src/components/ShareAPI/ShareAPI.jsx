import React, { useState } from 'react'
import API from '../../API';
import styles from './ShareAPI.module.css'
import { Box, Button, Container, TextField, Typography } from '@mui/material';

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
        </>
    )
}

export default ShareAPI
