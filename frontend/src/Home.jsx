import {useEffect, useState} from "react"
import {Box, Paper, Tooltip, Typography} from "@mui/material"

const STATUS_COLOR = {
    blue: '#2a78d6',
    orange: '#eb6834',
    aqua: '#1baf7a'
}

const STATUS_ORDER = [
    {key: 'bestätigt', label: 'Bestätigt', color: STATUS_COLOR.blue},
    {key: 'storniert', label: 'Storniert', color: STATUS_COLOR.orange},
    {key: 'abgeschlossen', label: 'Abgeschlossen', color: STATUS_COLOR.aqua}
]

const currency = new Intl.NumberFormat('de-CH', {style: 'currency', currency: 'CHF', maximumFractionDigits: 0})

const nightsBetween = (start, end) => Math.round((new Date(end) - new Date(start)) / 86400000)

const Home = () => {
    const [hotels, setHotels] = useState([])
    const [guests, setGuests] = useState([])
    const [rooms, setRooms] = useState([])
    const [bookings, setBookings] = useState([])

    useEffect(() => {
        fetch("http://localhost:8080/hotels")
            .then(response => response.json())
            .then(data => setHotels(data))
            .catch(e => console.error(e))

        fetch("http://localhost:8080/guests")
            .then(response => response.json())
            .then(data => setGuests(data))
            .catch(e => console.error(e))

        fetch("http://localhost:8080/rooms")
            .then(response => response.json())
            .then(data => setRooms(data))
            .catch(e => console.error(e))

        fetch("http://localhost:8080/bookings")
            .then(response => response.json())
            .then(data => setBookings(data))
            .catch(e => console.error(e))
    }, [])

    const getRoomHotelId = zimmerId => rooms.find(room => room.zimmerId === zimmerId)?.hotelId

    const bookingRevenue = booking => {
        const nights = nightsBetween(booking.anreisedatum, booking.abreisedatum)
        return booking.zimmer.reduce((sum, z) => sum + z.preisProNacht * nights, 0)
    }

    const totalRevenue = bookings.reduce((sum, booking) => sum + bookingRevenue(booking), 0)

    const revenueByHotel = new Map()
    bookings.forEach(booking => {
        const nights = nightsBetween(booking.anreisedatum, booking.abreisedatum)
        booking.zimmer.forEach(z => {
            const hotelId = getRoomHotelId(z.zimmerId)
            if (hotelId == null) return
            revenueByHotel.set(hotelId, (revenueByHotel.get(hotelId) ?? 0) + z.preisProNacht * nights)
        })
    })

    const hotelRevenueRows = hotels
        .map(hotel => ({name: hotel.name, value: revenueByHotel.get(hotel.hotelId) ?? 0}))
        .sort((a, b) => b.value - a.value)
    const maxHotelRevenue = Math.max(1, ...hotelRevenueRows.map(row => row.value))

    const statusCounts = STATUS_ORDER.map(status => ({
        ...status,
        count: bookings.filter(booking => booking.status === status.key).length
    }))
    const totalBookings = bookings.length

    const stats = [
        {label: 'Gäste', value: guests.length},
        {label: 'Hotels', value: hotels.length},
        {label: 'Zimmer', value: rooms.length},
        {label: 'Buchungen', value: bookings.length},
        {label: 'Gesamtumsatz', value: currency.format(totalRevenue)}
    ]

    return (
        <Box component="main" sx={{p: 3}}>
            <Typography variant="h3" component="h1">
                Home
            </Typography>

            <Box sx={{display: 'flex', gap: 2, flexWrap: 'wrap', mt: 3}}>
                {stats.map(stat => (
                    <Paper key={stat.label} variant="outlined" sx={{p: 2, flex: '1 1 180px'}}>
                        <Typography variant="body2" color="text.secondary">
                            {stat.label}
                        </Typography>
                        <Typography variant="h4">
                            {stat.value}
                        </Typography>
                    </Paper>
                ))}
            </Box>

            <Paper variant="outlined" sx={{p: 3, mt: 3}}>
                <Typography variant="h6" component="h2" sx={{mb: 2}}>
                    Umsatz pro Hotel
                </Typography>
                {hotelRevenueRows.map(row => (
                    <Box key={row.name} sx={{display: 'flex', alignItems: 'center', gap: 2, mb: 1.5}}>
                        <Typography variant="body2" sx={{width: 160, flexShrink: 0}}>
                            {row.name}
                        </Typography>
                        <Box sx={{flex: 1, height: 20}}>
                            <Tooltip title={`${row.name}: ${currency.format(row.value)}`}>
                                <Box
                                    sx={{
                                        height: '100%',
                                        width: `${(row.value / maxHotelRevenue) * 100}%`,
                                        minWidth: 4,
                                        backgroundColor: STATUS_COLOR.blue,
                                        borderRadius: '0 4px 4px 0',
                                        '&:hover': {filter: 'brightness(1.1)'}
                                    }}
                                />
                            </Tooltip>
                        </Box>
                        <Typography variant="body2" color="text.secondary"
                                    sx={{width: 90, flexShrink: 0, textAlign: 'right'}}>
                            {currency.format(row.value)}
                        </Typography>
                    </Box>
                ))}
            </Paper>

            <Paper variant="outlined" sx={{p: 3, mt: 3}}>
                <Typography variant="h6" component="h2" sx={{mb: 2}}>
                    Buchungsstatus-Verteilung
                </Typography>

                <Box sx={{display: 'flex', gap: '2px', height: 28, borderRadius: '4px', overflow: 'hidden', mb: 2}}>
                    {statusCounts.filter(status => status.count > 0).map(status => (
                        <Tooltip
                            key={status.key}
                            title={`${status.label}: ${status.count} (${Math.round((status.count / totalBookings) * 100)}%)`}>
                            <Box
                                sx={{
                                    flex: status.count,
                                    backgroundColor: status.color,
                                    '&:hover': {filter: 'brightness(1.1)'}
                                }}
                            />
                        </Tooltip>
                    ))}
                </Box>

                <Box sx={{display: 'flex', gap: 3, flexWrap: 'wrap'}}>
                    {statusCounts.map(status => (
                        <Box key={status.key} sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                            <Box sx={{width: 12, height: 12, borderRadius: '2px', backgroundColor: status.color}}/>
                            <Typography variant="body2" color="text.secondary">
                                {status.label} ({status.count})
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </Paper>
        </Box>
    )
}

export default Home
