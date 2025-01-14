import React, { useState, useEffect, use } from "react";
import { Container, CircularProgress, Grid, Button } from "@mui/material";
import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";

function ClothingGame({ face, username, setShowCaptureFace, setShowClothingGame }) {
  const [background, setBackground] = useState(null);
  const [open, setOpen] = useState(false);
  const [pants, setPants] = useState(null);
  const [shirts, setShirts] = useState(null);
  const starter = "http://172.30.167.156:8000/clothings";

  const setRandom = async (component) => {
    try {
      const data = await fetch(`${starter}/random/${component}`);
      const blob = await data.blob();
      const imageObjectUrl = URL.createObjectURL(blob);
      if (component === "pants") {
        setPants(imageObjectUrl);
      } else if (component === "shirts") {
        setShirts(imageObjectUrl);
      }
      else{
        setBackground(imageObjectUrl);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const setRandomClothes = async () => {
    await setRandom("pants");
    await setRandom("shirts");
  };

  const getComponents = async (component, nextOrPrev) => {
    try {
      const data = await fetch(`${starter}/${component}/${nextOrPrev}`);
      const blob = await data.blob();

      const imageObjectUrl = URL.createObjectURL(blob);
      if (component === "pants") {
        setPants(imageObjectUrl);
      } else if (component === "shirts") {
        setShirts(imageObjectUrl);
      }
      else{
        setBackground(imageObjectUrl);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const markAsFavorite = async () => {
    try {
      const response = await fetch(`${starter}/save/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username
        }),
      });
      if (!response.ok) {
      throw new Error("Failed to mark as favorite");
      }
    } catch (error) {
      console.error("Error marking as favorite:", error);
    }
  }

  const repicture = () => {
    setShowCaptureFace(true);
    setShowClothingGame(false);
  }

  const setComponentByIndex = async (component, index) => {
    try {
      const data = await fetch(`${starter}/index/${component}?index=${index}`);
      const blob = await data.blob();
      const imageObjectUrl = URL.createObjectURL(blob);
      if (component === "pants") {
        setPants(imageObjectUrl);
      } else if (component === "shirts") {
        setShirts(imageObjectUrl);
      }
      else{
        setBackground(imageObjectUrl);
      }
    } catch (error) {
      console.error(error);
    }};

  const setFavorite = async () => {
    const response = await fetch(`${starter}/save/get?username=${username}`);
    var data = await response.json();
    data = data.list;
    const [background_index, pants_index, shirts_index] = data;
    setComponentByIndex("backgrounds", background_index);
    setComponentByIndex("pants", pants_index);
    setComponentByIndex("shirts", shirts_index);

  }

  useEffect(() => {
    setRandomClothes();
  }, []);
  useEffect(() => {
    setRandom("backgrounds");
  }, []);

  const arrowStyle = {
    fontSize: "40px",
    color: "black",
    minWidth: "auto",
    padding: "5px",
  };

  return (
    <Container>
      <Grid>
        <Grid 
            display={"flex"} 
            justifyContent={"center"} 
            alignItems={"center"} 
            width={"50%"}
            style={{
            marginLeft: "auto",
            marginRight: "auto",}}> 
          <Grid>
              <Button onClick={() => getComponents("backgrounds", "prev")} style={arrowStyle}>
                  &#8592;
              </Button>
          </Grid>
          <Grid
            container
            direction="column"
            spacing={3}
            alignItems="center"
            justifyContent="center"
            style={{
              marginTop: "20px",
              marginBottom: "15px",
              minHeight: "100vh",
              backgroundImage: `url(${background})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              marginLeft: "auto",
              marginRight: "auto",
              gap: "0"
            }}
          >
            <Grid item style={{ width: "40%", marginRight:"5%"}}>
              <img
                src={face}
                alt="Face"
                style={{ width: "100%", height: "100px", objectFit: "contain" }}
              />
            </Grid>
            <Grid item style={{ width: "100%", padding: 0,margin: 0,}}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Button onClick={() => getComponents("shirts", "prev")} style={arrowStyle}>
                  &#8592;
                </Button>
                <div style={{ width: "200px", textAlign: "center" }}>
                  {shirts ? (
                    <img
                      src={shirts}
                      alt="Shirt"
                      style={{ width: "150px", height: "175px", objectFit: "contain" }}
                    />
                  ) : (
                    <CircularProgress />
                  )}
                </div>
                <Button onClick={() => getComponents("shirts", "next")} style={arrowStyle}>
                  &#8594;
                </Button>
              </div>
            </Grid>
            <Grid item style={{ width: "100%", padding: 0, margin: 0,}}>
              <div style={{width:"200",  display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Button onClick={() => getComponents("pants", "prev")} style={arrowStyle}>
                  &#8592;
                </Button>
                <div style={{ width: "200px", textAlign: "center" }}>
                  {pants ? (
                    <img
                      src={pants}
                      alt="Pants"
                      style={{ width: "200px", height: "200px", objectFit: "contain" }}
                    />
                  ) : (
                    <CircularProgress />
                  )}
                </div>
                <Button onClick={() => getComponents("pants", "next")} style={arrowStyle}>
                  &#8594;
                </Button>
              </div>
            </Grid>
          </Grid>
          <Button onClick={() => getComponents("backgrounds", "next")} style={arrowStyle}>
            &#8594;
          </Button>
        </Grid>
        <Grid item style={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setRandomClothes();
            }}
            style={{ marginLeft: "10px" }}
          >
            Randomize
          </Button>
          <Button variant="contained" color="secondary" style={{ marginLeft: "10px" }} onClick={() => {markAsFavorite();}}>
            mark as favorite
          </Button>
        </Grid>
        <Grid item style={{ width: "100%", display: "flex", justifyContent: "center", marginTop: "10px" }}>
          <Button variant="contained" color="secondary" style={{ marginLeft: "10px", fontSize: "10px"}} onClick={() => {repicture();}}>
            replace picture
          </Button>
          <Button variant="contained" color="primary" style={{ marginLeft: "10px", fontSize: "10px" }} onClick={() => {setFavorite();}}>
            paste favorite on
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}

export default ClothingGame;
