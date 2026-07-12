import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { users, type AppUser } from "../data/users";

type LoginProps = {
  onLogin: (user: AppUser) => void;
};

export default function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  function handleLogin() {
    const user = users.find(
      (item) =>
        item.username === username.trim() &&
        item.password === password
    );

    if (!user) {
      setErrorMessage("שם משתמש או סיסמה שגויים");
      return;
    }

    onLogin(user);
    navigate("/");
  }

  return (
    <Box
      dir="rtl"
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 3,
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 420,
          borderRadius: 5,
          boxShadow: "0 12px 32px rgba(15,23,42,0.14)",
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Typography
            component="h1"
            variant="h4"
            sx={{
              fontWeight: 900,
              mb: 1,
            }}
          >
            RubberCMMS
          </Typography>

          <Typography
            component="p"
            sx={{
              color: "text.secondary",
              mb: 4,
            }}
          >
            כניסה למערכת ניהול אחזקה
          </Typography>

          <TextField
            fullWidth
            label="שם משתמש"
            value={username}
            onChange={(event) => {
              setUsername(event.target.value);
              setErrorMessage("");
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleLogin();
              }
            }}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="סיסמה"
            type="password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              setErrorMessage("");
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleLogin();
              }
            }}
            sx={{ mb: 2 }}
          />

          {errorMessage && (
            <Typography
              component="p"
              sx={{
                color: "error.main",
                mb: 2,
                fontWeight: 800,
              }}
            >
              {errorMessage}
            </Typography>
          )}

          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handleLogin}
            sx={{
              py: 1.4,
              fontWeight: 900,
            }}
          >
            כניסה
          </Button>

          <Typography
            component="p"
            sx={{
              color: "text.secondary",
              mt: 2,
              fontSize: 13,
            }}
          >
            משתמשים לבדיקה:
            <br />
            admin / admin
            <br />
            manager / 1234
            <br />
            tech / 1234
            <br />
            electric / 1234
            <br />
            operator / 1234
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
