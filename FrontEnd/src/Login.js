import React from "react";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import { useState } from "react";
import SignUp from "./SignUp";

function Login({username, setUsername, setShowWelcome, setShowLogin}) {
    const [password, setPassword] = useState("");
    const [showSignUp, setShowSignUp] = useState(false);
    const [invalid , setInvalid] = useState(false);
    const [error, setError] = useState("");
    const handleLogin = async () => {
        // Handle registration logic here
        try{
            const response = await fetch("http://172.30.167.156:8000/login?username=" + username + "&password=" + password);
            const data = await response.json();
            const status = data.status;
            const message = data.message;
            if (status === "success") {
                // Redirect to welcome page
                setShowWelcome(true);
                setShowLogin(false);
            } else {
                // Display error message
                setInvalid(true);
                setError(message);
            }
        } catch (error) {
            console.error(error);
        }
    };
    return (
        <>
            {!showSignUp && <Container maxWidth="sm">
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Login
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                        <TextField
                            label="Username"
                            variant="outlined"
                            fullWidth
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </Box>
                    <Box sx={{ mb: 2 }}>
                        <TextField
                            label="Password"
                            type="password"
                            variant="outlined"
                            fullWidth
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </Box>
                    <Button variant="contained" color="primary" fullWidth onClick={() => { handleLogin();}}>
                        Login
                    </Button>
                    {invalid && <Typography color="error">{error}</Typography>}
                </Box>
                <Typography>are you not signed in</Typography>
                <Button variant="text" color="primary" fullWidth onClick={() => {setShowSignUp(true);}} style={{ marginTop: '20px' }}>
                    sign up
                </Button>
            </Container>}
            {showSignUp && <SignUp username={username} setUserName={setUsername} setShowLogin={setShowLogin} setShowWelcome={setShowWelcome}/>}
        </>
    );
}

export default Login;