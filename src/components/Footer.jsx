import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => {
    return (
        <Box
            sx={{
                backgroundColor: '#f9fafb', // light background
                color: '#6b7280', // neutral gray text
                py: 2,
                textAlign: 'center',
                borderTop: '1px solid #e5e7eb', // subtle top border
                fontSize: 14,
            }}
        >
            <Typography variant="body2" component="p">
                © {new Date().getFullYear()} <strong>Platinum Diam</strong> — Developed by{' '}
                <a
                    href="https://platinumsofttech.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 500 }}
                >
                    Platinum Tech
                </a>
            </Typography>
        </Box>
    );
};

export default Footer;
