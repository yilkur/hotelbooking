import {useEffect, useState} from "react"
import {
    Alert,
    Box,
    Button, Dialog, DialogActions, DialogContent, DialogTitle,
    Grid,
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

const formatDate = isoDate => new Date(isoDate).toLocaleDateString('de-CH')

const Guests = () => {
    const url = "http://localhost:8080/guests"
    const [guests, setGuests] = useState([])
    const [showSuccess, setShowSuccess] = useState(false)
    const [editingGuest, setEditingGuest] = useState(null)
    const [errorMessage, setErrorMessage] = useState(null)

    useEffect(() => {
        fetch(url)
            .then(response => response.json())
            .then(data => setGuests(data))
            .catch(e => console.error(e))
    }, [])

    const handleSubmit = e => {
        e.preventDefault()

        const form = e.target
        const formData = new FormData(form)
        const newGuest = {
            nachname: formData.get("nachname"),
            vorname: formData.get("vorname"),
            email: formData.get("email"),
            telefon: formData.get("telefon"),
            geburtsdatum: formData.get("geburtsdatum")
        }

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newGuest)
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
                setGuests(prevGuests => [...prevGuests, result])
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
                    setGuests(prevGuests => prevGuests.filter(guest => guest.gastId !== id))
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
        const updatedGuest = {
            nachname: formData.get("nachname"),
            vorname: formData.get("vorname"),
            email: formData.get("email"),
            telefon: formData.get("telefon"),
            geburtsdatum: formData.get("geburtsdatum")
        }

        fetch(`${url}/${editingGuest.gastId}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(updatedGuest)
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
                setGuests(prevGuests => prevGuests.map(guest => {
                    if (guest.gastId === editingGuest.gastId) {
                        return result
                    }
                    return guest
                }))
                setEditingGuest(null)
            })
            .catch(error => {
                console.error(error)
                setErrorMessage(error.message)
            })
    }

    return (
        <Box component="main" sx={{p: 3}}>
            <Typography variant="h3" component="h1">
                Gäste
            </Typography>

            <Paper variant="outlined" sx={{p: 3, mt: 3}}>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid size={{xs: 12, sm: 6}}>
                            <TextField
                                name="nachname"
                                id="edit-nachname"
                                label="Nachname"
                                variant="outlined"
                                required
                                fullWidth/>
                        </Grid>
                        <Grid size={{xs: 12, sm: 6}}>
                            <TextField
                                name="vorname"
                                id="edit-vorname"
                                label="Vorname"
                                variant="outlined"
                                required
                                fullWidth/>
                        </Grid>
                        <Grid size={{xs: 12, sm: 6}}>
                            <TextField
                                name="email"
                                id="edit-email"
                                label="Email"
                                type="email"
                                variant="outlined"
                                required
                                fullWidth/>
                        </Grid>
                        <Grid size={{xs: 12, sm: 6}}>
                            <TextField
                                name="telefon"
                                id="edit-telefon"
                                label="Telefon"
                                variant="outlined"
                                fullWidth/>
                        </Grid>
                        <Grid size={{xs: 12, sm: 6}}>
                            <TextField
                                name="geburtsdatum"
                                id="edit-geburtsdatum"
                                label="Geburtsdatum"
                                type="date"
                                variant="outlined"
                                required
                                slotProps={{inputLabel: {shrink: true}}}
                                fullWidth/>
                        </Grid>
                        <Grid size={12} sx={{display: 'flex', justifyContent: 'flex-end'}}>
                            <Button variant="contained" type="submit" startIcon={<AddIcon/>} sx={{height: "100%"}}>
                                Gast hinzufügen
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>

            <Paper variant="outlined" sx={{p: 3, mt: 3}}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nachname</TableCell>
                            <TableCell>Vorname</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Telefon</TableCell>
                            <TableCell>Geburtsdatum</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {guests.map(guest => (
                            <TableRow key={guest.gastId}>
                                <TableCell>{guest.nachname}</TableCell>
                                <TableCell>{guest.vorname}</TableCell>
                                <TableCell>{guest.email}</TableCell>
                                <TableCell>{guest.telefon}</TableCell>
                                <TableCell>{formatDate(guest.geburtsdatum)}</TableCell>
                                <TableCell>
                                    <Button onClick={() => handleDelete(guest.gastId)} variant="outlined"
                                            startIcon={<DeleteIcon/>}
                                            sx={{mr: 2}}>
                                        Löschen
                                    </Button>
                                    <Button onClick={() => setEditingGuest(guest)} variant="outlined"
                                            startIcon={<EditIcon/>}>
                                        Bearbeiten
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>

            <Dialog open={editingGuest != null} onClose={() => setEditingGuest(null)}>
                <DialogTitle>Gast bearbeiten</DialogTitle>
                <DialogContent>
                    {editingGuest?.vorname} {editingGuest?.nachname}

                    <form onSubmit={handleUpdate}>
                        <Grid container spacing={2} sx={{mt: 3}}>
                            <Grid size={{xs: 12, sm: 6}}>
                                <TextField
                                    name="nachname"
                                    id="nachname"
                                    label="Nachname"
                                    variant="outlined"
                                    required
                                    defaultValue={editingGuest?.nachname}
                                    fullWidth/>
                            </Grid>
                            <Grid size={{xs: 12, sm: 6}}>
                                <TextField
                                    name="vorname"
                                    id="vorname"
                                    label="Vorname"
                                    variant="outlined"
                                    required
                                    defaultValue={editingGuest?.vorname}
                                    fullWidth/>
                            </Grid>
                            <Grid size={{xs: 12, sm: 6}}>
                                <TextField
                                    name="email"
                                    id="email"
                                    label="Email"
                                    type="email"
                                    variant="outlined"
                                    required
                                    defaultValue={editingGuest?.email}
                                    fullWidth/>
                            </Grid>
                            <Grid size={{xs: 12, sm: 6}}>
                                <TextField
                                    name="telefon"
                                    id="telefon"
                                    label="Telefon"
                                    variant="outlined"
                                    defaultValue={editingGuest?.telefon}
                                    fullWidth/>
                            </Grid>
                            <Grid size={{xs: 12, sm: 6}}>
                                <TextField
                                    name="geburtsdatum"
                                    id="geburtsdatum"
                                    label="Geburtsdatum"
                                    type="date"
                                    variant="outlined"
                                    required
                                    slotProps={{inputLabel: {shrink: true}}}
                                    defaultValue={editingGuest?.geburtsdatum}
                                    fullWidth/>
                            </Grid>
                            <Grid size={12}>
                                <Button variant="contained" type="submit" sx={{height: "100%"}}>
                                    Gast anpassen
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditingGuest(null)}>Abbrechen</Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={showSuccess}
                autoHideDuration={3000}
                onClose={() => setShowSuccess(false)}
                anchorOrigin={{vertical: "top", horizontal: "right"}}
            >
                <Alert severity="success" variant="filled" sx={{fontSize: "1.3rem", alignItems: "center"}}>
                    Gast wurde erfasst.
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

export default Guests
