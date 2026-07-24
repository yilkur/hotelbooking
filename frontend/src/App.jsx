import CssBaseline from '@mui/material/CssBaseline';
import {Box, Tab, Tabs} from "@mui/material";
import {Link, Route, Routes, useLocation} from "react-router-dom";
import Home from "./Home.jsx";
import Bookings from "./Bookings.jsx";
import Categories from "./Categories.jsx";
import Guests from "./Guests.jsx";
import Rooms from "./Rooms.jsx";
import Hotels from "./Hotels.jsx";
import EventAvailable from '@mui/icons-material/EventAvailable';
import KingBed from '@mui/icons-material/KingBed';
import HomeIcon from '@mui/icons-material/Home';
import HotelIcon from '@mui/icons-material/Hotel';
import PersonIcon from '@mui/icons-material/Person';
import CategoryIcon from '@mui/icons-material/Category';

const App = () => {
    const location = useLocation();
    const handleChange = () => {}

    return (
        <>
            <CssBaseline/>
            <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                <Tabs onChange={handleChange} aria-label="basic tabs example" value={location.pathname}>
                    <Tab label="Home" icon={<HomeIcon />} iconPosition="start" value="/" component={Link} to="/"/>
                    <Tab label="Buchungen" icon={<EventAvailable />} iconPosition="start" value="/bookings" component={Link} to="/bookings"/>
                    <Tab label="Hotels" icon={<HotelIcon />} iconPosition="start" value="/hotels" component={Link} to="/hotels"/>
                    <Tab label="Gäste" icon={<PersonIcon />} iconPosition="start" value="/guests" component={Link} to="/guests"/>
                    <Tab label="Räume" icon={<KingBed />} iconPosition=
                        "start" value="/rooms" component={Link} to="/rooms"/>
                    <Tab label="Kategorien" icon={<CategoryIcon />} iconPosition="start" value="/categories" component={Link} to="/categories"/>
                </Tabs>
            </Box>

            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/bookings" element={<Bookings/>}/>
                <Route path="/categories" element={<Categories/>}/>
                <Route path="/guests" element={<Guests/>}/>
                <Route path="/rooms" element={<Rooms/>}/>
                <Route path="/hotels" element={<Hotels/>}/>
            </Routes>
        </>
    )
}

export default App
