import {
    Box,
    Button,
    Grid, Paper,
    Table,
    TableBody,
    TableCell, TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from "@mui/material";
import {useEffect, useState} from "react";

const handleSubmit = e => {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const hotelname = formData.get("hotelname");
    const ort = formData.get("ort");

    alert(`hotelname: '${hotelname}'`);
    alert(`ort: '${ort}'`);
}

const Hotels = () => {
    const [hotels, setHotels] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8080/hotels")
            .then(response => response.json())
            .then(data => setHotels(data))
            .catch(e => console.error(e));
    }, []);

    return (
        <Box component="main" sx={{p: 3}}>
            <Typography variant="h3" component="h1">
                Hotels
            </Typography>

            <form onSubmit={handleSubmit}>
                <Grid container spacing={2} sx={{mt: 3}}>

                    <Grid xs={12} sm={6}>
                        <TextField
                            name="hotelname"
                            id="hotelname"
                            label="Hotelname"
                            variant="outlined"
                            required
                            fullWidth/>
                    </Grid>
                    <Grid xs={12} sm={6}>
                        <TextField
                            name="ort"
                            id="ort"
                            label="Ort"
                            variant="outlined"
                            required
                            fullWidth/>
                    </Grid>
                    <Grid xs={12}>
                        <Button variant="contained" type="submit" sx={{height: "100%"}}>
                            Hotel hinzufügen
                        </Button>
                    </Grid>
                </Grid>
            </form>

            <Typography variant="h4" component="h2" sx={{mt: 6}}>
                Übersicht
            </Typography>

            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Ort</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {hotels.map(hotel => (
                        <TableRow key={hotel.hotelId}>
                            <TableCell>{hotel.name}</TableCell>
                            <TableCell>{hotel.ort}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Box>
    );
}

export default Hotels;
