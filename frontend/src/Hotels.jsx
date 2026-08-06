import {
    Alert,
    Box,
    Button, Dialog, DialogActions, DialogContent, DialogTitle,
    Grid, Paper, Snackbar,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography
} from "@mui/material"
import {useEffect, useState} from "react"
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'

const Hotels = () => {
    const url = "http://localhost:8080/hotels"
    const [hotels, setHotels] = useState([])
    const [showSuccess, setShowSuccess] = useState(false)
    const [editingHotel, setEditingHotel] = useState(null)
    const [errorMessage, setErrorMessage] = useState(null)

    useEffect(() => {
        fetch(url)
            .then(response => response.json())
            .then(data => setHotels(data))
            .catch(e => console.error(e))
    }, [])

    const handleSubmit = e => {
        e.preventDefault()

        const form = e.target
        const formData = new FormData(form)
        const hotelName = formData.get("hotelname")
        const ort = formData.get("ort")

        const newHotel = {'name': hotelName, ort}

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newHotel)
        })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => {
                        throw new Error(text || 'Unbekannter Fehler')
                    })
                }
                return response.json()
            })
            .then(result => {
                console.log('Erfolg:', result)
                setHotels(prevHotels => [...prevHotels, result])
                form.reset()
                setShowSuccess(true)
            })
            .catch(error => {
                console.error('Fehler:', error)
                setErrorMessage(error.message)
            })
    }

    const handleDelete = id => {
        fetch(`${url}/${id}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (response.ok) {
                    setHotels(prevHotels => prevHotels.filter(hotel => hotel.hotelId !== id))
                    console.log('Erfolgreich gelöscht!')
                    return
                }
                return response.text().then(text => {
                    throw new Error(text || 'Fehler beim Löschen des Elements')
                })
            })
            .catch(error => {
                console.error('Fehler:', error)
                setErrorMessage(error.message)
            })
    }

    const handleUpdate = e => {
        e.preventDefault()

        const formData = new FormData(e.target)
        const updatedHotel = {name: formData.get("hotelname"), ort: formData.get("ort")}

        fetch(`${url}/${editingHotel.hotelId}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(updatedHotel)
        })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => {
                        throw new Error(text || 'Unbekannter Fehler')
                    })
                }
                return response.json()
            })
            .then(result => {
                setHotels(prevHotels => prevHotels.map(hotel => {
                    if (hotel.hotelId === editingHotel.hotelId) {
                        return result
                    }
                    return hotel
                }))
                setEditingHotel(null)
            })
            .catch(error => {
                console.error(error)
                setErrorMessage(error.message)
            })
    }

    return (
        <Box component="main" sx={{p: 3}}>
            <Typography variant="h3" component="h1">
                Hotels
            </Typography>

            <Paper variant="outlined" sx={{p: 3, mt: 3}}>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid size={{xs: 12, sm: 6}}>
                            <TextField
                                name="hotelname"
                                id="edit-hotelname"
                                label="Hotelname"
                                variant="outlined"
                                required
                                fullWidth/>
                        </Grid>
                        <Grid size={{xs: 12, sm: 6}}>
                            <TextField
                                name="ort"
                                id="edit-ort"
                                label="Ort"
                                variant="outlined"
                                required
                                fullWidth/>
                        </Grid>
                        <Grid size={12} sx={{display: 'flex', justifyContent: 'flex-end'}}>
                            <Button variant="contained" type="submit" startIcon={<AddIcon/>} sx={{height: "100%"}}>
                                Hotel hinzufügen
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>

            <Paper variant="outlined" sx={{p: 3, mt: 3}}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Ort</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {hotels.map(hotel => (
                            <TableRow key={hotel.hotelId}>
                                <TableCell>{hotel.name}</TableCell>
                                <TableCell>{hotel.ort}</TableCell>
                                <TableCell>
                                    <Button onClick={() => handleDelete(hotel.hotelId)} variant="outlined"
                                            startIcon={<DeleteIcon/>}
                                            sx={{mr: 2}}>
                                        Löschen
                                    </Button>
                                    <Button onClick={() => setEditingHotel(hotel)} variant="outlined"
                                            startIcon={<EditIcon/>}>
                                        Bearbeiten
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>

            <Dialog open={editingHotel != null} onClose={() => setEditingHotel(null)}>
                <DialogTitle>Hotel bearbeiten</DialogTitle>
                <DialogContent>
                    {editingHotel?.name} — {editingHotel?.ort}

                    <form onSubmit={handleUpdate}>
                        <Grid container spacing={2} sx={{mt: 3}}>
                            <Grid size={{xs: 12, sm: 6}}>
                                <TextField
                                    name="hotelname"
                                    id="hotelname"
                                    label="Hotelname"
                                    variant="outlined"
                                    required
                                    defaultValue={editingHotel?.name}
                                    fullWidth/>
                            </Grid>
                            <Grid size={{xs: 12, sm: 6}}>
                                <TextField
                                    name="ort"
                                    id="ort"
                                    label="Ort"
                                    variant="outlined"
                                    required
                                    defaultValue={editingHotel?.ort}
                                    fullWidth/>
                            </Grid>
                            <Grid size={12}>
                                <Button variant="contained" type="submit" sx={{height: "100%"}}>
                                    Hotel anpassen
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditingHotel(null)}>Abbrechen</Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={showSuccess}
                autoHideDuration={3000}
                onClose={() => setShowSuccess(false)}
                anchorOrigin={{vertical: "top", horizontal: "right"}}
            >
                <Alert severity="success" variant="filled" sx={{fontSize: "1.3rem", alignItems: "center"}}>
                    Hotel wurde erfasst.
                </Alert>
            </Snackbar>

            <Snackbar
                open={errorMessage != null}
                autoHideDuration={5000}
                onClose={() => setErrorMessage(null)}
                anchorOrigin={{vertical: "top", horizontal: "right"}}
            >
                <Alert severity="error" variant="filled" onClose={() => setErrorMessage(null)}
                       sx={{fontSize: "1.3rem", alignItems: "center"}}>
                    {errorMessage}
                </Alert>
            </Snackbar>
        </Box>
    )
}

export default Hotels
