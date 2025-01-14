import React, { use } from "react";
import { Container, CircularProgress, Grid, Button } from "@mui/material";
import { useState } from "react";
import { TextField, Typography } from "@mui/material";
const SignUp = ({username, setUserName, setShowWelcome, setShowLogin}) => {
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null)

    const handleSignUp = () => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: username, password: password }),
        };
        try {
            fetch('http://172.30.167.156:8000/signup', requestOptions)
                .then(response => response.json())
                .then(data => { setLoading(true); })
                .catch(error => setError(error));
        } finally {
            setLoading(false);
            setShowLogin(false);
            setShowWelcome(true);
        }
    };

    return (
        <Container>
            <Grid container spacing={2} direction="column" alignItems="center" justifyContent="center" style={{ minHeight: "100vh" }}>
                <Grid item>
                    <Typography variant="h4">Sign Up</Typography>
                </Grid>
                <Grid item>
                    <TextField
                        label="Username"
                        variant="outlined"
                        value={username}
                        onChange={(e) => setUserName(e.target.value)}
                        fullWidth
                    />
                </Grid>
                <Grid item>
                    <TextField
                        label="Password"
                        type="password"
                        variant="outlined"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        fullWidth
                    />
                </Grid>
                <Grid item>
                    <Button variant="contained" color="primary" onClick={handleSignUp} disabled={loading}>
                        {loading ? <CircularProgress size={24} /> : "Sign Up"}
                    </Button>
                    {error && <Typography color="error">{error}</Typography>}
                </Grid>
            </Grid>
        </Container>
    );
};

export default SignUp;