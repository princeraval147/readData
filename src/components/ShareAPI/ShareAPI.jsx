import React, { useEffect, useState } from 'react'
import API from '../../API';
import styles from './ShareAPI.module.css'
import { Box, Button, Checkbox, Container, FormControlLabel, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';

const ShareAPI = () => {

    const [editRowId, setEditRowId] = useState(null);
    const [editValues, setEditValues] = useState({});


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
        difference: "",
        include_category: "",
        exclude_category: "",
        allow_hold: false,
        allow_sell: false,
    });
    const [status, setStatus] = useState(null); // success or error message
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { id, value } = e.target;
        // const newValue = id === "email" ? value.toLowerCase() : value;
        const newValue =
            id === "email"
                ? value.toLowerCase()
                : id === "include_category" || id === "exclude_category"
                    ? value.toUpperCase()
                    : value;
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
            // const response = await API.post("/share-api", formData, { withCredentials: true });
            const response = await API.post("/share-api", {
                ...formData,
                include_category: formData.include_category
                    ? formData.include_category.split(',').map(item => item.trim())
                    : undefined,
                exclude_category: formData.exclude_category
                    ? formData.exclude_category.split(',').map(item => item.trim())
                    : undefined,
                allow_hold: formData.allow_hold,
                allow_sell: formData.allow_sell
            }, { withCredentials: true });

            setStatus(response.data.message || 'Email sent successfully!');
            fetchAPIHistory();
            setFormData({
                name: "",
                email: "",
                difference: "",
                include_category: "",
                exclude_category: "",
                allow_hold: false,
                allow_sell: false,
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


    // Update
    const startEdit = (share) => {
        setEditRowId(share.ID);
        setEditValues({
            difference: share.DIFFERENCE,
            allow_hold: !!share.ALLOW_HOLD,
            allow_sell: !!share.ALLOW_SELL,
            allow_insert: !!share.ALLOW_INSERT,
            allow_update: !!share.ALLOW_UPDATE,
            isActive: !!share.isActive
        });
    };

    const cancelEdit = () => {
        setEditRowId(null);
        setEditValues({});
    };

    const saveEdit = async (id) => {
        try {
            await API.put(`/update-api-share/${id}`, {
                difference: editValues.difference,
                allow_hold: editValues.allow_hold,
                allow_sell: editValues.allow_sell,
                allow_insert: editValues.allow_insert,
                allow_update: editValues.allow_update,
                isActive: editValues.isActive
            }, { withCredentials: true });

            fetchAPIHistory();
            setEditRowId(null);
            setEditValues({});
        } catch (err) {
            console.error("Update failed", err);
            alert("Failed to update. Try again.");
        }
    };





    return (
        <>
            <Container maxWidth="sm" sx={{ px: { xs: 2, sm: 4 } }} >
                <form onSubmit={handleSubmit}>
                    <Box
                        sx={{
                            mt: 4,
                            p: { xs: 2, sm: 4 },
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
                        <TextField
                            fullWidth
                            label="Include Category (comma separated)"
                            type="text"
                            id="include_category"
                            name="include_category"
                            // value={(formData.include_category || "").toUpperCase()}
                            value={formData.include_category}
                            onChange={handleChange}
                            placeholder="e.g. Certified,Fancy"
                            sx={{ mt: 4 }}
                        />
                        <TextField
                            fullWidth
                            label="Exclude Category (comma separated)"
                            type="text"
                            id="exclude_category"
                            name="exclude_category"
                            value={formData.exclude_category}
                            // value={(formData.exclude_category || "").toUpperCase()}
                            onChange={handleChange}
                            placeholder="e.g. Milky,Uncertified"
                            sx={{ mt: 4 }}
                        />
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', sm: 'row' },
                                gap: 2,
                                flexWrap: 'wrap',
                                mt: 2,
                            }}
                        >
                            {["hold", "sell", "insert", "update"].map((perm) => (
                                <FormControlLabel
                                    key={perm}
                                    control={
                                        <Checkbox
                                            checked={formData[`allow_${perm}`]}
                                            onChange={(e) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    [`allow_${perm}`]: e.target.checked,
                                                }))
                                            }
                                        />
                                    }
                                    label={`Allow ${perm.charAt(0).toUpperCase() + perm.slice(1)}`}
                                />
                            ))}
                        </Box>

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

            <Box sx={{ overflowX: 'auto', width: '100%' }}>
                <TableContainer sx={{
                    margin: 'auto', mt: 3, minWidth: '800px'
                }}>
                    < Typography
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
                    <Table stickyHeader>
                        <TableHead sx={{ backgroundColor: 'grey.100' }}>
                            <TableRow>
                                <TableCell>#</TableCell>
                                <TableCell>Recipient Name</TableCell>
                                <TableCell>Recipient Email</TableCell>
                                <TableCell>Sent At</TableCell>
                                <TableCell>API Key</TableCell>
                                <TableCell>Difference</TableCell>
                                <TableCell>Can Hold</TableCell>
                                <TableCell>Can Sell</TableCell>
                                <TableCell>Can Insert</TableCell>
                                <TableCell>Can Update</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {apiData.map((share, index) => (
                                <TableRow key={share.ID}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{share.NAME}</TableCell>
                                    <TableCell>{share.RECIPIENT_EMAIL}</TableCell>
                                    <TableCell>{new Date(share.SENT_AT).toLocaleDateString()}</TableCell>
                                    <TableCell>{share.TOKEN}</TableCell>
                                    <TableCell>
                                        {editRowId === share.ID ? (
                                            <TextField
                                                type="number"
                                                size="small"
                                                value={editValues.difference}
                                                onChange={(e) =>
                                                    setEditValues({ ...editValues, difference: e.target.value })
                                                }
                                                inputProps={{ max: 100 }}
                                                sx={{ width: "100px" }}
                                            />
                                        ) : (
                                            share.DIFFERENCE
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {editRowId === share.ID ? (
                                            <Switch
                                                checked={editValues.allow_hold}
                                                onChange={(e) =>
                                                    setEditValues({ ...editValues, allow_hold: e.target.checked })
                                                }
                                            />
                                        ) : (
                                            share.ALLOW_HOLD ? "Yes" : "No"
                                        )}
                                    </TableCell>

                                    <TableCell>
                                        {editRowId === share.ID ? (
                                            <Switch
                                                checked={editValues.allow_sell}
                                                onChange={(e) =>
                                                    setEditValues({ ...editValues, allow_sell: e.target.checked })
                                                }
                                            />) : (
                                            share.ALLOW_SELL ? "Yes" : "No"
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {editRowId === share.ID ? (
                                            <Switch
                                                checked={editValues.allow_insert}
                                                onChange={(e) =>
                                                    setEditValues({ ...editValues, allow_insert: e.target.checked })
                                                }
                                            />
                                        ) : (
                                            share.ALLOW_INSERT ? "Yes" : "No"
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {editRowId === share.ID ? (
                                            <Switch
                                                checked={editValues.allow_update}
                                                onChange={(e) =>
                                                    setEditValues({ ...editValues, allow_update: e.target.checked })
                                                }
                                            />) : (
                                            share.ALLOW_UPDATE ? "Yes" : "No"
                                        )}
                                    </TableCell>

                                    <TableCell>
                                        {editRowId === share.ID ? (
                                            <select
                                                value={editValues.isActive ? 'Active' : 'Inactive'}
                                                onChange={(e) =>
                                                    setEditValues({ ...editValues, isActive: e.target.value === 'Active' })
                                                }
                                            >
                                                <option value="Active">Active</option>
                                                <option value="Inactive">Inactive</option>
                                            </select>
                                        ) : (
                                            share.isActive ? 'Active' : 'Inactive'
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {editRowId === share.ID ? (
                                            <>
                                                <Button
                                                    size="small"
                                                    variant="contained"
                                                    color="success"
                                                    onClick={() => saveEdit(share.ID)}
                                                >
                                                    Save
                                                </Button>
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    color="inherit"
                                                    onClick={() => cancelEdit()}
                                                    sx={{ ml: 1 }}
                                                >
                                                    Cancel
                                                </Button>
                                            </>
                                        ) : (
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                onClick={() => startEdit(share)}
                                            >
                                                Edit
                                            </Button>
                                        )}
                                    </TableCell>

                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer >
            </Box >

        </>
    )
}

export default ShareAPI
