import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import SignIn from "./components/Sign-in/SignIn";
import SignUp from "./components/Sign-up/SignUp";
import FileUpload from "./components/handleFiles/FileUpload";
import { Grid, Paper, Typography } from "@mui/material";
import Navbar from "./components/UIElements/Navbar";

const App = () => {
  // State to track authentication status
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <>
        <Navbar isAuthenticated={isAuthenticated} />

        <Routes>
          {/* Public routes */}
          <Route
            path="/signin"
            element={<SignIn onLogin={() => setIsAuthenticated(true)} />}
          />
          <Route path="/signup" element={<SignUp />} />

          {/* Protected routes */}
          {isAuthenticated ? (
            <>
              <Route path="/upload" element={<FileUpload />} />
              <Route path="/" element={<Home />} />
            </>
          ) : (
            <>
              <Route path="/upload" element={<Navigate to="/signin" />} />
              <Route path="/" element={<Navigate to="/signin" />} />
            </>
          )}
        </Routes>
      </>
    </Router>
  );
};

const Home = () => (
  <Grid container spacing={2}>
    <Grid item xs={12}>
      <Paper elevation={3} style={{ padding: "20px" }}>
        <Typography variant="h4" align="center">
          Upload a file
        </Typography>
        {/* Other components or features can be added here */}
      </Paper>
    </Grid>
  </Grid>
);

export default App;
