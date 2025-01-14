import React from "react";
import { Button, Box } from "@mui/material";

function CaptureFace({setShowCaptureFace, setShowClothingGame, setFace, face}) {
    const captureFace = async () => {
        try {
            const data = await fetch("http://172.30.167.156:8000/capture-face");
            const blob = await data.blob();
            const imageObjectUrl = URL.createObjectURL(blob);
            setFace(imageObjectUrl);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh">
            <Box
                width={300}
                height={300}
                border="1px solid black"
                display="flex"
                alignItems="center"
                justifyContent="center"
                marginBottom={2}
            >
               {face && <img src={face} alt="Face" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
            </Box>
            <Button variant="contained" color="primary" style={{ padding: '10px 20px', marginBottom: '10px' }} onClick={captureFace}>
                Capture Pic
            </Button>
            <Button variant="contained" color="secondary" disabled={!face} onClick={() => { setShowCaptureFace(false); setShowClothingGame(true);} } style={{ padding: '10px 20px' }}>
                Next
            </Button>
        </Box>
    );
}
export default CaptureFace;