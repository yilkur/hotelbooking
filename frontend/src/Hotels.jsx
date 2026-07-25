import {Box, Button, Grid, TextField} from "@mui/material";

const handleAddHotel = () => {
}

const Hotels = () => (
    <Box component="main" sx={{p: 3}}>
        <h1>Hotels</h1>

        <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
                <TextField id="name" label="Hotelname" variant="outlined" required fullWidth/>
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField id="ort" label="Ort" variant="outlined" required fullWidth/>
            </Grid>
            <Grid item xs={12}>
                <Button variant="contained" onClick={handleAddHotel} sx={{height: "100%"}}>
                    Hotel hinzufügen
                </Button>
            </Grid>
        </Grid>
    </Box>
);

export default Hotels;
