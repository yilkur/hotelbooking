import {Box, Button, Grid, TextField} from "@mui/material";

const handleSubmit = e => {
    e.preventDefault()

    const form = e.target;
    const formData = new FormData(form);
    const hotelname = formData.get("hotelname");
    const ort = formData.get("ort");

    alert(`hotelname: '${hotelname}'`);
    alert(`ort: '${ort}'`);
}

const Hotels = () => {
    return (
        <Box component="main" sx={{p: 3}}>
            <h1>Hotels</h1>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>

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
        </Box>
    );
}

export default Hotels;
