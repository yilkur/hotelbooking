import {useEffect, useState} from "react"
import {
    Alert,
    Box,
    Button, Dialog, DialogActions, DialogContent, DialogTitle,
    Grid,
    MenuItem,
    Paper, Snackbar,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography
} from "@mui/material"
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'

const Rooms = () => {
    const url = "http://localhost:8080/rooms"
    const [rooms, setRooms] = useState([])
    const [hotels, setHotels] = useState([])
    const [categories, setCategories] = useState([])
    const [showSuccess, setShowSuccess] = useState(false)
    const [editingRoom, setEditingRoom] = useState(null)
    const [errorMessage, setErrorMessage] = useState(null)
    const [formKey, setFormKey] = useState(0)

    const getHotelName = hotelId => hotels.find(hotel => hotel.hotelId === hotelId)?.name ?? hotelId
    const getCategoryName = kategorieId => categories.find(category => category.kategorieId === kategorieId)?.bezeichnung ?? kategorieId

    useEffect(() => {
        fetch(url)
            .then(response => response.json())
            .then(data => setRooms(data))
            .catch(e => console.error(e))

        fetch("http://localhost:8080/hotels")
            .then(response => response.json())
            .then(data => setHotels(data))
            .catch(e => console.error(e))

        fetch("http://localhost:8080/categories")
            .then(response => response.json())
            .then(data => setCategories(data))
            .catch(e => console.error(e))
    }, [])

    const handleSubmit = e => {
        e.preventDefault()

        const form = e.target
        const formData = new FormData(form)
        const newRoom = {
            hotelId: Number(formData.get("hotelId")),
            kategorieId: Number(formData.get("kategorieId")),
            zimmerNr: formData.get("zimmerNr")
        }

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newRoom)
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
                setRooms(prevRooms => [...prevRooms, result])
                form.reset()
                setFormKey(prevKey => prevKey + 1)
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
                    setRooms(prevRooms => prevRooms.filter(room => room.zimmerId !== id))
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
        const updatedRoom = {
            hotelId: Number(formData.get("hotelId")),
            kategorieId: Number(formData.get("kategorieId")),
            zimmerNr: formData.get("zimmerNr")
        }

        fetch(`${url}/${editingRoom.zimmerId}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(updatedRoom)
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
                setRooms(prevRooms => prevRooms.map(room => {
                    if (room.zimmerId === editingRoom.zimmerId) {
                        return result
                    }
                    return room
                }))
                setEditingRoom(null)
            })
            .catch(error => {
                console.error(error)
                setErrorMessage(error.message)
            })
    }

    return (
        <Box component="main" sx={{p: 3}}>
            <Typography variant="h3" component="h1">
                Räume
            </Typography>

            <Paper variant="outlined" sx={{p: 3, mt: 3}}>
                <form key={formKey} onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid size={{xs: 12, sm: 6}}>
                            <TextField
                                select
                                name="hotelId"
                                id="edit-hotelId"
                                label="Hotel"
                                variant="outlined"
                                defaultValue=""
                                required
                                fullWidth>
                                {hotels.map(hotel => (
                                    <MenuItem key={hotel.hotelId} value={hotel.hotelId}>
                                        {hotel.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid size={{xs: 12, sm: 6}}>
                            <TextField
                                select
                                name="kategorieId"
                                id="edit-kategorieId"
                                label="Kategorie"
                                variant="outlined"
                                defaultValue=""
                                required
                                fullWidth>
                                {categories.map(category => (
                                    <MenuItem key={category.kategorieId} value={category.kategorieId}>
                                        {category.bezeichnung}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid size={12}>
                            <TextField
                                name="zimmerNr"
                                id="edit-zimmerNr"
                                label="Zimmernummer"
                                variant="outlined"
                                required
                                fullWidth/>
                        </Grid>
                        <Grid size={12} sx={{display: 'flex', justifyContent: 'flex-end'}}>
                            <Button variant="contained" type="submit" startIcon={<AddIcon/>} sx={{height: "100%"}}>
                                Zimmer hinzufügen
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>

            <Paper variant="outlined" sx={{p: 3, mt: 3}}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Hotel</TableCell>
                            <TableCell>Kategorie</TableCell>
                            <TableCell>Zimmernummer</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rooms.map(room => (
                            <TableRow key={room.zimmerId}>
                                <TableCell>{getHotelName(room.hotelId)}</TableCell>
                                <TableCell>{getCategoryName(room.kategorieId)}</TableCell>
                                <TableCell>{room.zimmerNr}</TableCell>
                                <TableCell>
                                    <Button onClick={() => handleDelete(room.zimmerId)} variant="outlined"
                                            startIcon={<DeleteIcon/>}
                                            sx={{mr: 2}}>
                                        Löschen
                                    </Button>
                                    <Button onClick={() => setEditingRoom(room)} variant="outlined"
                                            startIcon={<EditIcon/>}>
                                        Bearbeiten
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>

            <Dialog open={editingRoom != null} onClose={() => setEditingRoom(null)}>
                <DialogTitle>Zimmer bearbeiten</DialogTitle>
                <DialogContent>
                    {getHotelName(editingRoom?.hotelId)} — Zimmer {editingRoom?.zimmerNr}

                    <form onSubmit={handleUpdate}>
                        <Grid container spacing={2} sx={{mt: 3}}>
                            <Grid size={{xs: 12, sm: 6}}>
                                <TextField
                                    select
                                    name="hotelId"
                                    id="hotelId"
                                    label="Hotel"
                                    variant="outlined"
                                    defaultValue={editingRoom?.hotelId}
                                    required
                                    fullWidth>
                                    {hotels.map(hotel => (
                                        <MenuItem key={hotel.hotelId} value={hotel.hotelId}>
                                            {hotel.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid size={{xs: 12, sm: 6}}>
                                <TextField
                                    select
                                    name="kategorieId"
                                    id="kategorieId"
                                    label="Kategorie"
                                    variant="outlined"
                                    defaultValue={editingRoom?.kategorieId}
                                    required
                                    fullWidth>
                                    {categories.map(category => (
                                        <MenuItem key={category.kategorieId} value={category.kategorieId}>
                                            {category.bezeichnung}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid size={12}>
                                <TextField
                                    name="zimmerNr"
                                    id="zimmerNr"
                                    label="Zimmernummer"
                                    variant="outlined"
                                    required
                                    defaultValue={editingRoom?.zimmerNr}
                                    fullWidth/>
                            </Grid>
                            <Grid size={12}>
                                <Button variant="contained" type="submit" sx={{height: "100%"}}>
                                    Zimmer anpassen
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditingRoom(null)}>Abbrechen</Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={showSuccess}
                autoHideDuration={3000}
                onClose={() => setShowSuccess(false)}
                anchorOrigin={{vertical: "top", horizontal: "right"}}
            >
                <Alert severity="success" variant="filled" sx={{fontSize: "1.3rem", alignItems: "center"}}>
                    Zimmer wurde erfasst.
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

export default Rooms
