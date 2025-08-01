'use client'
import { createTheme } from "@mui/material";
import { lightBlue, deepPurple } from "@mui/material/colors";


export const theme = createTheme({
    cssVariables: true,
    colorSchemes: {
        light: {
            palette: {
                primary: lightBlue,
                secondary: deepPurple,
            },
        },
    },
    palette: {
        primary: { main: lightBlue[500] },
        secondary: { main: '#dc004e' },
    },
    typography:{
        fontFamily: 'var(--font-roboto)',
    },
});
