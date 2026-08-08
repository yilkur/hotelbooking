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

const STATUS_OPTIONS = ["bestätigt", "storniert", "abgeschlossen"]

const formatDate = isoDate => new Date(isoDate).toLocaleDateString('de-CH')

const Bookings = () => {
    const url = "http://localhost:8080/bookings"
    const [bookings, setBookings] = useState([])
    const [guests, setGuests] = useState([])
    const [rooms, setRooms] = useState([])
    const [hotels, setHotels] = useState([])
    const [categories, setCategories] = useState([])
    const [showSuccess, setShowSuccess] = useState(false)
    const [editingBooking, setEditingBooking] = useState(null)
    const [errorMessage, setErrorMessage] = useState(null)
    const [formKey, setFormKey] = useState(0)

    const getGuestName = gastId => {
        const guest = guests.find(g => g.gastId === gastId)
        return guest ? `${guest.vorname} ${guest.nachname}` : gastId
    }

    const getRoom = zimmerId => rooms.find(r => r.zimmerId === zimmerId)

    const getRoomLabel = zimmerId => {
        const room = getRoom(zimmerId)
        if (!room) return zimmerId
        const hotel = hotels.find(h => h.hotelId === room.hotelId)
        const category = categories.find(c => c.kategorieId === room.kategorieId)
        return `${hotel?.name ?? room.hotelId} Zimmer ${room.zimmerNr} (${category?.bezeichnung ?? room.kategorieId})`
    }

    const getCategoryPrice = zimmerId => {
        const room = getRoom(zimmerId)
        const category = categories.find(c => c.kategorieId === room?.kategorieId)
        return category?.preisProNacht ?? 0
    }

    useEffect(() => {
        fetch(url)
            .then(response => response.json())
            .then(data => setBookings(data))
            .catch(e => console.error(e))

        fetch("http://localhost:8080/guests")
            .then(response => response.json())
            .then(data => setGuests(data))
            .catch(e => console.error(e))

        fetch("http://localhost:8080/rooms")
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

    const buildBookingFromForm = formData => ({
        gastId: Number(formData.get("gastId")),
        anreisedatum: formData.get("anreisedatum"),
        abreisedatum: formData.get("abreisedatum"),
        status: formData.get("status"),
        zimmer: formData.get("zimmerIds").split(',').map(zimmerId => ({
            zimmerId: Number(zimmerId),
            preisProNacht: getCategoryPrice(Number(zimmerId))
        }))
    })

    const handleSubmit = e => {
        e.preventDefault()

        const form = e.target
        const formData = new FormData(form)
        const newBooking = buildBookingFromForm(formData)

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newBooking)
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
                setBookings(prevBookings => [...prevBookings, result])
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
                    setBookings(prevBookings => prevBookings.filter(booking => booking.buchungId !== id))
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
        const updatedBooking = buildBookingFromForm(formData)

        fetch(`${url}/${editingBooking.buchungId}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(updatedBooking)
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
                setBookings(prevBookings => prevBookings.map(booking => {
                    if (booking.buchungId === editingBooking.buchungId) {
                        return result
                    }
                    return booking
                }))
                setEditingBooking(null)
            })
            .catch(error => {
                console.error(error)
                setErrorMessage(error.message)
            })
    }

    return (
        <Box component="main" sx={{p: 3}}>
            <Typography variant="h3" component="h1">
                Buchungen
            </Typography>

            <Paper variant="outlined" sx={{p: 3, mt: 3}}>
                <form key={formKey} onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid size={{xs: 12, sm: 6}}>
                            <TextField
                                select
                                name="gastId"
                                id="edit-gastId"
                                label="Gast"
                                variant="outlined"
                                defaultValue=""
                                required
                                fullWidth>
                                {guests.map(guest => (
                                    <MenuItem key={guest.gastId} value={guest.gastId}>
                                        {guest.vorname} {guest.nachname}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid size={{xs: 12, sm: 6}}>
                            <TextField
                                select
                                name="status"
                                id="edit-status"
                                label="Status"
                                variant="outlined"
                                defaultValue="bestätigt"
                                required
                                fullWidth>
                                {STATUS_OPTIONS.map(option => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid size={{xs: 12, sm: 6}}>
                            <TextField
                                name="anreisedatum"
                                id="edit-anreisedatum"
                                label="Anreisedatum"
                                type="date"
                                variant="outlined"
                                required
                                slotProps={{inputLabel: {shrink: true}}}
                                fullWidth/>
                        </Grid>
                        <Grid size={{xs: 12, sm: 6}}>
                            <TextField
                                name="abreisedatum"
                                id="edit-abreisedatum"
                                label="Abreisedatum"
                                type="date"
                                variant="outlined"
                                required
                                slotProps={{inputLabel: {shrink: true}}}
                                fullWidth/>
                        </Grid>
                        <Grid size={12}>
                            <TextField
                                select
                                name="zimmerIds"
                                id="edit-zimmerIds"
                                label="Zimmer"
                                variant="outlined"
                                defaultValue={[]}
                                required
                                fullWidth
                                slotProps={{
                                    select: {
                                        multiple: true,
                                        renderValue: selected => selected.map(getRoomLabel).join(', ')
                                    }
                                }}>
                                {rooms.map(room => (
                                    <MenuItem key={room.zimmerId} value={room.zimmerId}>
                                        {getRoomLabel(room.zimmerId)}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid size={12} sx={{display: 'flex', justifyContent: 'flex-end'}}>
                            <Button variant="contained" type="submit" startIcon={<AddIcon/>} sx={{height: "100%"}}>
                                Buchung hinzufügen
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>

            <Paper variant="outlined" sx={{p: 3, mt: 3}}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Gast</TableCell>
                            <TableCell>Anreisedatum</TableCell>
                            <TableCell>Abreisedatum</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Zimmer</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {bookings.map(booking => (
                            <TableRow key={booking.buchungId}>
                                <TableCell>{getGuestName(booking.gastId)}</TableCell>
                                <TableCell>{formatDate(booking.anreisedatum)}</TableCell>
                                <TableCell>{formatDate(booking.abreisedatum)}</TableCell>
                                <TableCell>{booking.status}</TableCell>
                                <TableCell>
                                    {[...booking.zimmer].map(z => getRoomLabel(z.zimmerId)).join(', ')}
                                </TableCell>
                                <TableCell>
                                    <Button onClick={() => handleDelete(booking.buchungId)} variant="outlined"
                                            startIcon={<DeleteIcon/>}
                                            sx={{mr: 2}}>
                                        Löschen
                                    </Button>
                                    <Button onClick={() => setEditingBooking(booking)} variant="outlined"
                                            startIcon={<EditIcon/>}>
                                        Bearbeiten
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>

            <Dialog open={editingBooking != null} onClose={() => setEditingBooking(null)} maxWidth="sm" fullWidth>
                <DialogTitle>Buchung bearbeiten</DialogTitle>
                <DialogContent>
                    {getGuestName(editingBooking?.gastId)}

                    <form onSubmit={handleUpdate}>
                        <Grid container spacing={2} sx={{mt: 3}}>
                            <Grid size={{xs: 12, sm: 6}}>
                                <TextField
                                    select
                                    name="gastId"
                                    id="gastId"
                                    label="Gast"
                                    variant="outlined"
                                    defaultValue={editingBooking?.gastId}
                                    required
                                    fullWidth>
                                    {guests.map(guest => (
                                        <MenuItem key={guest.gastId} value={guest.gastId}>
                                            {guest.vorname} {guest.nachname}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid size={{xs: 12, sm: 6}}>
                                <TextField
                                    select
                                    name="status"
                                    id="status"
                                    label="Status"
                                    variant="outlined"
                                    defaultValue={editingBooking?.status}
                                    required
                                    fullWidth>
                                    {STATUS_OPTIONS.map(option => (
                                        <MenuItem key={option} value={option}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid size={{xs: 12, sm: 6}}>
                                <TextField
                                    name="anreisedatum"
                                    id="anreisedatum"
                                    label="Anreisedatum"
                                    type="date"
                                    variant="outlined"
                                    required
                                    slotProps={{inputLabel: {shrink: true}}}
                                    defaultValue={editingBooking?.anreisedatum}
                                    fullWidth/>
                            </Grid>
                            <Grid size={{xs: 12, sm: 6}}>
                                <TextField
                                    name="abreisedatum"
                                    id="abreisedatum"
                                    label="Abreisedatum"
                                    type="date"
                                    variant="outlined"
                                    required
                                    slotProps={{inputLabel: {shrink: true}}}
                                    defaultValue={editingBooking?.abreisedatum}
                                    fullWidth/>
                            </Grid>
                            <Grid size={12}>
                                <TextField
                                    select
                                    name="zimmerIds"
                                    id="zimmerIds"
                                    label="Zimmer"
                                    variant="outlined"
                                    defaultValue={editingBooking?.zimmer?.map(z => z.zimmerId) ?? []}
                                    required
                                    fullWidth
                                    slotProps={{
                                        select: {
                                            multiple: true,
                                            renderValue: selected => selected.map(getRoomLabel).join(', ')
                                        }
                                    }}>
                                    {rooms.map(room => (
                                        <MenuItem key={room.zimmerId} value={room.zimmerId}>
                                            {getRoomLabel(room.zimmerId)}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid size={12}>
                                <Button variant="contained" type="submit" sx={{height: "100%"}}>
                                    Buchung anpassen
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditingBooking(null)}>Abbrechen</Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={showSuccess}
                autoHideDuration={3000}
                onClose={() => setShowSuccess(false)}
                anchorOrigin={{vertical: "top", horizontal: "right"}}
            >
                <Alert severity="success" variant="filled" sx={{fontSize: "1.3rem", alignItems: "center"}}>
                    Buchung wurde erfasst.
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

export default Bookings
