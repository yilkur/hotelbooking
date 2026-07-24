import CssBaseline from '@mui/material/CssBaseline';
import {Box, Tab, Tabs} from "@mui/material";
import {Link, Route, Routes, useLocation} from "react-router-dom";
import Home from "./Home.jsx";
import Bookings from "./Bookings.jsx";
import Categories from "./Categories.jsx";
import Guests from "./Guests.jsx";
import Rooms from "./Rooms.jsx";
import Hotels from "./Hotels.jsx";

const App = () => {
    const location = useLocation();
    const handleChange = () => {}

    return (
        <>
            <CssBaseline/>
            <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                <Tabs onChange={handleChange} aria-label="basic tabs example" value={location.pathname}>
                    <Tab label="Home" value="/" component={Link} to="/"/>
                    <Tab label="Buchungen" value="/bookings" component={Link} to="/bookings"/>
                    <Tab label="Hotels" value="/hotels" component={Link} to="/hotels"/>
                    <Tab label="Gäste" value="/guests" component={Link} to="/guests"/>
                    <Tab label="Räume" value="/rooms" component={Link} to="/rooms"/>
                    <Tab label="Kategorien" value="/categories" component={Link} to="/categories"/>
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
