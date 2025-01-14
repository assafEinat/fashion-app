import React from 'react';
import { Container, Typography, Button } from '@mui/material';

function Welcome({ setShowWelcome, setShowCaptureFace }) {
    return (
        <>
            <Container maxWidth="sm" style={{ background: '#FDE2E4', borderRadius: '20px', padding: '30px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' }}>
                <Typography variant="h2" component="h1" gutterBottom style={{ fontFamily: '"Pacifico", cursive', color: '#FF69B4' }}>
                    Welcome to the Fashion Wonderland 💖
                </Typography>
                <Typography variant="h5" component="h2" gutterBottom style={{ fontFamily: '"Poppins", sans-serif', color: '#333' }}>
                    Step into the world of glamour, style, and confidence. Get ready to shine!
                </Typography>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => { setShowWelcome(false); setShowCaptureFace(true); }}
                    style={{
                        backgroundColor: '#FF69B4',
                        fontFamily: '"Poppins", sans-serif',
                        padding: '12px 30px',
                        borderRadius: '50px',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        transition: '0.3s',
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#FF1493'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#FF69B4'}
                >
                    Let’s Get Glammed Up 💅
                </Button>
            </Container>
        </>
    );
}

export default Welcome;