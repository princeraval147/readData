import React, { useState } from 'react';
import {
    Box, Typography, ToggleButtonGroup, ToggleButton,
    TextField, Grid, Container, Paper, Chip, Divider,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Card,
    CardMedia,
    CardContent,
    CircularProgress, Alert,
    Pagination
} from '@mui/material';
import { styled } from '@mui/material/styles';
import API from '../../API'
import { useNavigate } from 'react-router-dom';


const ShapeCard = styled(Box)(({ selected }) => ({
    border: selected ? '2px solid #d4af37' : '2px solid #e0e0e0',
    borderRadius: '12px',
    padding: 12,
    textAlign: 'center',
    cursor: 'pointer',
    backgroundColor: selected ? '#fffdf6' : '#fafafa',
    boxShadow: selected ? '0 4px 20px rgba(212, 175, 55, 0.15)' : '0 1px 5px rgba(0,0,0,0.05)',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
        boxShadow: '0 3px 12px rgba(0,0,0,0.1)',
    },
}));

const Diamonds = () => {

    const [filterData, setFilterData] = useState([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const diamondsPerPage = 12; // You can adjust this number

    const indexOfLastDiamond = currentPage * diamondsPerPage;
    const indexOfFirstDiamond = indexOfLastDiamond - diamondsPerPage;
    const currentDiamonds = filterData.slice(indexOfFirstDiamond, indexOfLastDiamond);
    const totalPages = Math.ceil(filterData.length / diamondsPerPage);




    const shapeData = [
        { SID: 1, SHAPE: "ROUND", IMG: "/shapes/round.png" },
        { SID: 2, SHAPE: "PRINCESS", IMG: "/shapes/princess.png" },
        { SID: 3, SHAPE: "EMERALD", IMG: "/shapes/emerald.png" },
        { SID: 4, SHAPE: "ASSCHER", IMG: "/shapes/asscher.png" },
        { SID: 5, SHAPE: "CUSHION", IMG: "/shapes/cushion.png" },
        { SID: 6, SHAPE: "OVAL", IMG: "/shapes/oval.png" },
        { SID: 7, SHAPE: "PEAR", IMG: "/shapes/pear.png" },
        { SID: 8, SHAPE: "MARQUISE", IMG: "/shapes/marquise.png" },
        { SID: 9, SHAPE: "HEART", IMG: "/shapes/heart.png" },
        { SID: 10, SHAPE: "RADIANT", IMG: "/shapes/radiant.png" },
    ];

    const whiteColorData = ["D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N"];
    const fancyColorData = ["YELLOW", "RED", "GREEN", "PINK", "BLUE", "BROWN", "BLACK"];
    const fancyColorIntensity = ["FAINT", "VERY LIGHT", "LIGHT", "FANCY LIGHT", "FANCY", "INTENSE", "BRILLIANT", "VVID", "DEEP", "DARK"];
    const fancyColorOverton = ["NONE", "GREENISH", "GRAY GREENISH", "GRAYISH", "BROWNISH", "GRAYISH YELLOWISH", "GREENISH BROWNISH", "GRAYISH GREENISH", "GREENISH YELLOWISH", "YELLOWISH", "GRAY YELLOWISH", "PINKISH", "ORANGISH", "BROWNISH GREENISH", "YELLOWWISH GREENISH", "BROWNISH YELLOWISH"];
    const clarityData = ["IF", "VVS1", "VVS2", "VS1", "VS2", "SI1", "SI2", "I1", "I2", "I3"];
    const fluorescenceData = [
        { FID: 1, FL: "NON" },
        { FID: 2, FL: "FNT" },
        { FID: 3, FL: "MED" },
        { FID: 4, FL: "STR" },
        { FID: 5, FL: "VST" },
    ];

    const [growthType, setGrowthType] = useState([]);
    const [colorType, setColorType] = useState('WHITE');
    const [minWeight, setMinWeight] = useState();
    const [maxWeight, setMaxWeight] = useState();
    const [minPrice, setMinPrice] = useState();
    const [maxPrice, setMaxPrice] = useState();
    const [selectedShapes, setSelectedShapes] = useState([]);
    const [selectedColor, setSelectedColor] = useState([]);
    const [selectedClarity, setSelectedClarity] = useState([]);
    const [labReport, setLabReport] = useState([]);
    const [fluorescence, setFluorescence] = useState([]);
    const [intensity, setIntensity] = useState([]);
    const [overton, setOverton] = useState([]);

    const toggleValue = (value, setValue, list) => {
        if (list.includes(value)) {
            setValue(list.filter(v => v !== value));
        } else {
            setValue([...list, value]);
        }
    };
    const resetFilters = () => {
        setGrowthType([]);
        setMinWeight('');
        setMaxWeight('');
        setMinPrice('');
        setMaxPrice('');
        setSelectedShapes([]);
        setSelectedColor([]);
        setIntensity('');
        setOverton('');
        setSelectedClarity([]);
        setLabReport([]);
        setFluorescence([]);
        setFilterData([]); // clear the result
    };


    const applyFilters = async () => {
        setLoading(true);
        setError('');
        setCurrentPage(1);
        try {
            const payload = {
                growthType,
                weightMin: parseFloat(minWeight),
                weightMax: parseFloat(maxWeight),
                priceMin: parseFloat(minPrice),
                priceMax: parseFloat(maxPrice),
                shapes: selectedShapes,
                colorType,
                colors: selectedColor,
                intensity: intensity || null,
                overtone: overton || null,
                clarity: selectedClarity,
                lab: labReport,
                fluorescence: fluorescence
            };

            const response = await API.post('/filter-diamonds', payload);
            setFilterData(response.data);
            if (response.data.length === 0) {
                setError('No diamonds found with selected filters.');
            }
        } catch (error) {
            console.error("Error applying filters:", error);
            setError("Failed to fetch diamonds.");
        } finally {
            setLoading(false);
        }
    };


    const navigate = useNavigate();

    const handleCardClick = (diamond) => {
        navigate(`/diamond-details/${diamond.STOCKID || diamond.ID}`); // adjust based on your primary key
    };


    return (
        <>
            <Container sx={{ py: 6 }}>
                <Paper elevation={3} sx={{ p: 5, borderRadius: 4, background: '#fefefe' }}>
                    <Typography variant="h4" fontWeight={700} mb={4} color="#333">Filters</Typography>

                    <Typography variant="subtitle1" mb={1}>Growth Type</Typography>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
                        {['NATURAL', 'LAB GROWN'].map((type) => (
                            <Chip
                                key={type}
                                label={type}
                                clickable
                                onClick={() => toggleValue(type, setGrowthType, growthType)}
                                color={growthType.includes(type) ? 'primary' : 'default'}
                                variant={growthType.includes(type) ? 'filled' : 'outlined'}
                            />
                        ))}
                    </Box>

                    {/* <Grid container spacing={2} mb={3}>
                    {shapeData.map(shape => (
                        <Grid item xs={4} sm={3} md={2} key={shape.SID}>
                            <ShapeCard
                                selected={selectedShapes.includes(shape.SHAPE)}
                                onClick={() => toggleValue(shape.SHAPE, setSelectedShapes, selectedShapes)}
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    borderRadius: '12px',
                                    padding: 1.5,
                                    cursor: 'pointer',
                                    transition: '0.3s',
                                    border: selectedShapes.includes(shape.SHAPE) ? '2px solid #1976d2' : '1px solid #ddd',
                                    boxShadow: selectedShapes.includes(shape.SHAPE)
                                        ? '0 0 12px rgba(25, 118, 210, 0.3)'
                                        : 'none',
                                    '&:hover': {
                                        boxShadow: '0 0 12px rgba(0,0,0,0.1)',
                                    },
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 60,
                                        height: 60,
                                        borderRadius: '50%',
                                        backgroundColor: '#f9f9f9',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mb: 1,
                                    }}
                                >
                                    <img
                                        src={shape.IMG}
                                        alt={shape.SHAPE}
                                        style={{
                                            maxWidth: '80%',
                                            maxHeight: '80%',
                                            objectFit: 'contain',
                                        }}
                                    />
                                </Box>
                                <Typography variant="caption" fontWeight={500}>{shape.SHAPE}</Typography>
                            </ShapeCard>
                        </Grid>
                    ))}
                </Grid> */}

                    <Box
                        sx={{
                            display: 'flex',
                            overflowX: 'auto',
                            gap: 2,
                            pb: 1,
                            mb: 3,
                            scrollbarWidth: 'thin', // For Firefox
                            '&::-webkit-scrollbar': {
                                height: 8,
                            },
                            '&::-webkit-scrollbar-thumb': {
                                backgroundColor: '#ccc',
                                borderRadius: 4,
                            },
                        }}
                    >
                        {shapeData.map(shape => (
                            <Box key={shape.SID} sx={{ flex: '0 0 auto' }}>
                                <ShapeCard
                                    selected={selectedShapes.includes(shape.SHAPE)}
                                    onClick={() => toggleValue(shape.SHAPE, setSelectedShapes, selectedShapes)}
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        borderRadius: '12px',
                                        padding: 1.5,
                                        width: 100, // Fixed width for consistency
                                        cursor: 'pointer',
                                        transition: '0.3s',
                                        border: selectedShapes.includes(shape.SHAPE)
                                            ? '2px solid #1976d2'
                                            : '2px solid #ddd',
                                        boxShadow: selectedShapes.includes(shape.SHAPE)
                                            ? '0 0 12px rgba(25, 118, 210, 0.3)'
                                            : 'none',
                                        '&:hover': {
                                            boxShadow: '0 0 12px rgba(0,0,0,0.1)',
                                        },
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 60,
                                            height: 60,
                                            borderRadius: '50%',
                                            backgroundColor: '#f9f9f9',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            mb: 1,
                                        }}
                                    >
                                        <img
                                            src={shape.IMG}
                                            alt={shape.SHAPE}
                                            style={{
                                                maxWidth: '80%',
                                                maxHeight: '80%',
                                                objectFit: 'contain',
                                            }}
                                        />
                                    </Box>
                                    <Typography variant="caption" fontWeight={500}>
                                        {shape.SHAPE}
                                    </Typography>
                                </ShapeCard>
                            </Box>
                        ))}
                    </Box>


                    <Grid container spacing={2} mb={3}>
                        <Grid item xs={6}>
                            <TextField label="Min Weight (cts)" type="number" value={minWeight} onChange={e => setMinWeight(e.target.value)} fullWidth />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField label="Max Weight (cts)" type="number" value={maxWeight} onChange={e => setMaxWeight(e.target.value)} fullWidth />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField label="Min Price (USD)" type="number" value={minPrice} onChange={e => setMinPrice(e.target.value)} fullWidth />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField label="Max Price (USD)" type="number" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} fullWidth />
                        </Grid>
                    </Grid>

                    <Typography variant="subtitle1" mb={1}>Color Type</Typography>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
                        {['WHITE', 'FANCY'].map((type) => (
                            <Chip
                                key={type}
                                label={type}
                                clickable
                                onClick={() => setColorType(type)}
                                color={colorType === type ? 'primary' : 'default'}
                                variant={colorType === type ? 'filled' : 'outlined'}
                            />
                        ))}
                    </Box>

                    <Typography variant="subtitle1" mb={1}>Color</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                        {(colorType === 'WHITE' ? whiteColorData : fancyColorData).map((color, i) => (
                            <Chip
                                key={i}
                                label={color}
                                clickable
                                color={selectedColor.includes(color) ? 'primary' : 'default'}
                                variant={selectedColor.includes(color) ? 'filled' : 'outlined'}
                                onClick={() => toggleValue(color, setSelectedColor, selectedColor)}
                            />
                        ))}
                    </Box>

                    {colorType === 'FANCY' && (
                        <>
                            <span className='flex'>
                                <FormControl fullWidth sx={{ minWidth: 200, mr: 2, mb: 2 }}>
                                    <InputLabel id="intensity-label">Intensity</InputLabel>
                                    <Select
                                        labelId="intensity-label"
                                        value={intensity}
                                        onChange={(e) => setIntensity(e.target.value)}
                                        label="Intensity"
                                    >
                                        {fancyColorIntensity.map((item, i) => (
                                            <MenuItem key={i} value={item}>{item}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <FormControl fullWidth sx={{ minWidth: 200, mb: 2 }}>
                                    <InputLabel id="overtone-label">Overtone</InputLabel>
                                    <Select
                                        labelId="overtone-label"
                                        value={overton}
                                        onChange={(e) => setOverton(e.target.value)}
                                        label="Overtone"
                                    >
                                        {fancyColorOverton.map((item, i) => (
                                            <MenuItem key={i} value={item}>{item}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </span>
                        </>
                    )}

                    <Typography variant="subtitle1" mb={1}>Clarity</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                        {clarityData.map((clarity, i) => (
                            <Chip
                                key={i}
                                label={clarity}
                                clickable
                                color={selectedClarity.includes(clarity) ? 'primary' : 'default'}
                                variant={selectedClarity.includes(clarity) ? 'filled' : 'outlined'}
                                onClick={() => toggleValue(clarity, setSelectedClarity, selectedClarity)}
                            />
                        ))}
                    </Box>

                    <Typography variant="subtitle1" mb={1}>Lab Certification</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                        {['CERTIFIED', 'NON CERTIFIED'].map((lab, i) => (
                            <Chip
                                key={i}
                                label={lab}
                                clickable
                                color={labReport.includes(lab) ? 'primary' : 'default'}
                                variant={labReport.includes(lab) ? 'filled' : 'outlined'}
                                onClick={() => toggleValue(lab, setLabReport, labReport)}
                            />
                        ))}
                    </Box>

                    <Typography variant="subtitle1" mb={1}>Fluorescence</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {fluorescenceData.map((item, i) => (
                            <Chip
                                key={i}
                                label={item.FL}
                                clickable
                                color={fluorescence.includes(item.FL) ? 'primary' : 'default'}
                                variant={fluorescence.includes(item.FL) ? 'filled' : 'outlined'}
                                onClick={() => toggleValue(item.FL, setFluorescence, fluorescence)}
                            />
                        ))}
                    </Box>
                    <Box mt={3} display="flex" gap={2}>
                        <Button variant="contained" color="primary" onClick={applyFilters}>Apply Filters</Button>
                        <Button variant="outlined" color="secondary" onClick={resetFilters}>Reset</Button>
                    </Box>
                </Paper>
            </Container>


            <Box mt={6}>
                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                        <CircularProgress size={48} />
                    </Box>
                ) : filterData.length > 0 ? (
                    <>
                        <Typography variant="h5" fontWeight={600} mb={3}>
                            {filterData.length} Diamonds Found
                        </Typography>
                        <Grid container spacing={3} className="flex justify-center">
                            {/* {filterData.map((diamond, index) => ( */}
                            {currentDiamonds.map((diamond, index) => (
                                <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={index}>
                                    <Box onClick={() => handleCardClick(diamond)} sx={{ cursor: 'pointer' }}>
                                        <Card
                                            sx={{
                                                borderRadius: '16px',
                                                background: '#fff',
                                                boxShadow: '0 6px 20px rgba(0,0,0,0.06)',
                                                transition: 'transform 0.2s ease-in-out',
                                                height: '100%', // <-- Important for equal height
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'space-between',
                                                '&:hover': {
                                                    transform: 'translateY(-5px)',
                                                    boxShadow: '0 12px 30px rgba(0,0,0,0.12)',
                                                },
                                                overflow: 'hidden',
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    height: 180,
                                                    backgroundColor: '#f9f9f9',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}
                                            ><Box
                                                    component="img"
                                                    src={diamond.DIAMOND_IMAGE}
                                                    alt={diamond.SHAPE}
                                                    sx={{
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'contain',
                                                        padding: 2,
                                                        backgroundColor: '#f9f9f9',
                                                        borderRadius: 1,
                                                        // '&:error': {
                                                        //     content: '"No Image"',
                                                        //     display: 'flex',
                                                        //     justifyContent: 'center',
                                                        //     alignItems: 'center',
                                                        //     color: '#ccc',
                                                        //     fontSize: 14,
                                                        // }
                                                    }}
                                                // onError={(e) => {
                                                //     e.target.onerror = null;
                                                //     e.target.src = '/no-image.png'; // fallback image
                                                // }}
                                                />
                                            </Box>

                                            <CardContent
                                                sx={{
                                                    textAlign: 'center',
                                                    py: 2,
                                                    flexGrow: 1,
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    justifyContent: 'space-between',
                                                }}
                                            >
                                                <Typography variant="subtitle2" fontWeight={700}>
                                                    {diamond.SHAPE?.toUpperCase() || 'SHAPE'} – {diamond.WEIGHT || '-'} ct
                                                </Typography>

                                                <Typography variant="body2" color="text.secondary" mb={1}>
                                                    {diamond.COLOR?.toUpperCase() || diamond.FANCY_COLOR?.toUpperCase() || '-'} / {diamond.CLARITY?.toUpperCase() || '-'}
                                                </Typography>

                                                <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#d4af37', mb: 1 }}>
                                                    {diamond.PRICE ? `$${diamond.PRICE.toLocaleString()}` : 'Price on Request'}
                                                </Typography>

                                                <Chip
                                                    label={diamond.LAB?.toUpperCase() || 'Uncertified'}
                                                    size="small"
                                                    variant="outlined"
                                                    color={diamond.LAB && diamond.LAB !== 'NONE' ? 'success' : 'default'}
                                                    sx={{ borderRadius: '10px', fontWeight: 500, alignSelf: 'center' }}
                                                />
                                            </CardContent>
                                        </Card>

                                        {/* <Card
                                            sx={{
                                                borderRadius: '16px',
                                                background: '#fff',
                                                boxShadow: '0 6px 20px rgba(0,0,0,0.06)',
                                                transition: 'transform 0.2s ease-in-out',
                                                '&:hover': {
                                                    transform: 'translateY(-5px)',
                                                    boxShadow: '0 12px 30px rgba(0,0,0,0.12)',
                                                },
                                                overflow: 'hidden',
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    height: 180,
                                                    backgroundColor: '#f9f9f9',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                <img
                                                    src={diamond.DIAMOND_IMAGE}
                                                    alt={diamond.SHAPE}
                                                    style={{
                                                        maxWidth: '100%',
                                                        maxHeight: '100%',
                                                        objectFit: 'contain',
                                                        padding: 10,
                                                    }}
                                                />
                                            </Box>
                                            <CardContent sx={{ textAlign: 'center', py: 2 }}>
                                                <Typography variant="subtitle2" fontWeight={700}>
                                                    {diamond.SHAPE?.toUpperCase() || 'SHAPE'} – {diamond.WEIGHT || '-'} ct
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" mb={1}>
                                                    {diamond.COLOR?.toUpperCase() || diamond.FANCY_COLOR?.toUpperCase() || '-'} / {diamond.CLARITY?.toUpperCase() || '-'}
                                                </Typography>
                                                <Typography
                                                    variant="subtitle1"
                                                    fontWeight={700}
                                                    sx={{ color: '#d4af37' }}
                                                >
                                                    {diamond.PRICE ? `$${diamond.PRICE.toLocaleString()}` : 'Price on Request'}
                                                </Typography>
                                                <Box mt={1}>
                                                    <Chip
                                                        label={diamond.LAB?.toUpperCase() || 'Uncertified'}
                                                        size="small"
                                                        variant="outlined"
                                                        color={diamond.LAB && diamond.LAB !== 'NONE' ? 'success' : 'default'}
                                                        sx={{ borderRadius: '10px', fontWeight: 500 }}
                                                    />
                                                </Box>
                                            </CardContent>
                                        </Card> */}
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </>
                ) : (
                    <Typography variant="h6" color="text.secondary" align="center" mt={4}>
                        No Diamonds Found
                    </Typography>
                )}
            </Box>

            <Box display="flex" justifyContent="center" mt={4}>
                <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={(e, value) => setCurrentPage(value)}
                    color="primary"
                    shape="rounded"
                />
            </Box>


        </>
    );
};

export default Diamonds;
