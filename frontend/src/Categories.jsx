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

const Categories = () => {
    const url = "http://localhost:8080/categories"
    const [categories, setCategories] = useState([])
    const [showSuccess, setShowSuccess] = useState(false)
    const [editingCategory, setEditingCategory] = useState(null)
    const [errorMessage, setErrorMessage] = useState(null)

    useEffect(() => {
        fetch(url)
            .then(response => response.json())
            .then(data => setCategories(data))
            .catch(e => console.error(e))
    }, [])

    const handleSubmit = e => {
        e.preventDefault()

        const form = e.target
        const formData = new FormData(form)
        const bezeichnung = formData.get("bezeichnung")
        const preisProNacht = formData.get("preisProNacht")

        const newCategory = {bezeichnung, preisProNacht}

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newCategory)
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
                setCategories(prevCategories => [...prevCategories, result])
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
                    setCategories(prevCategories => prevCategories.filter(category => category.kategorieId !== id))
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
        const updatedCategory = {
            bezeichnung: formData.get("bezeichnung"),
            preisProNacht: formData.get("preisProNacht")
        }

        fetch(`${url}/${editingCategory.kategorieId}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(updatedCategory)
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
                setCategories(prevCategories => prevCategories.map(category => {
                    if (category.kategorieId === editingCategory.kategorieId) {
                        return result
                    }
                    return category
                }))
                setEditingCategory(null)
            })
            .catch(error => {
                console.error(error)
                setErrorMessage(error.message)
            })
    }

    return (
        <Box component="main" sx={{p: 3}}>
            <Typography variant="h3" component="h1">
                Kategorien
            </Typography>

            <Paper variant="outlined" sx={{p: 3, mt: 3}}>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid size={{xs: 12, sm: 6}}>
                            <TextField
                                name="bezeichnung"
                                id="edit-bezeichnung"
                                label="Bezeichnung"
                                variant="outlined"
                                required
                                fullWidth/>
                        </Grid>
                        <Grid size={{xs: 12, sm: 6}}>
                            <TextField
                                name="preisProNacht"
                                id="edit-preisProNacht"
                                label="Preis pro Nacht"
                                type="number"
                                slotProps={{htmlInput: {step: "0.01", min: "0"}}}
                                variant="outlined"
                                required
                                fullWidth/>
                        </Grid>
                        <Grid size={12} sx={{display: 'flex', justifyContent: 'flex-end'}}>
                            <Button variant="contained" type="submit" startIcon={<AddIcon/>} sx={{height: "100%"}}>
                                Kategorie hinzufügen
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>

            <Paper variant="outlined" sx={{p: 3, mt: 3}}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Bezeichnung</TableCell>
                            <TableCell>Preis pro Nacht</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {categories.map(category => (
                            <TableRow key={category.kategorieId}>
                                <TableCell>{category.bezeichnung}</TableCell>
                                <TableCell>{category.preisProNacht}</TableCell>
                                <TableCell>
                                    <Button onClick={() => handleDelete(category.kategorieId)} variant="outlined"
                                            startIcon={<DeleteIcon/>}
                                            sx={{mr: 2}}>
                                        Löschen
                                    </Button>
                                    <Button onClick={() => setEditingCategory(category)} variant="outlined"
                                            startIcon={<EditIcon/>}>
                                        Bearbeiten
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>

            <Dialog open={editingCategory != null} onClose={() => setEditingCategory(null)}>
                <DialogTitle>Kategorie bearbeiten</DialogTitle>
                <DialogContent>
                    {editingCategory?.bezeichnung} — {editingCategory?.preisProNacht}

                    <form onSubmit={handleUpdate}>
                        <Grid container spacing={2} sx={{mt: 3}}>
                            <Grid size={{xs: 12, sm: 6}}>
                                <TextField
                                    name="bezeichnung"
                                    id="bezeichnung"
                                    label="Bezeichnung"
                                    variant="outlined"
                                    required
                                    defaultValue={editingCategory?.bezeichnung}
                                    fullWidth/>
                            </Grid>
                            <Grid size={{xs: 12, sm: 6}}>
                                <TextField
                                    name="preisProNacht"
                                    id="preisProNacht"
                                    label="Preis pro Nacht"
                                    type="number"
                                    slotProps={{htmlInput: {step: "0.01", min: "0"}}}
                                    variant="outlined"
                                    required
                                    defaultValue={editingCategory?.preisProNacht}
                                    fullWidth/>
                            </Grid>
                            <Grid size={12}>
                                <Button variant="contained" type="submit" sx={{height: "100%"}}>
                                    Kategorie anpassen
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditingCategory(null)}>Abbrechen</Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={showSuccess}
                autoHideDuration={3000}
                onClose={() => setShowSuccess(false)}
                anchorOrigin={{vertical: "top", horizontal: "right"}}
            >
                <Alert severity="success" variant="filled" sx={{fontSize: "1.3rem", alignItems: "center"}}>
                    Kategorie wurde erfasst.
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

export default Categories
