'use client';
import React from 'react';
import { Box, Button, Typography } from '@mui/material';

export default function SimpleLayout() {
  return (
    <>
      <Box>
        <Typography variant="h3">Welcome to the CyastralWiki!</Typography>
        <Button variant="contained" color="primary" onClick={() => {
          console.log(process.env.NODE_ENV);
        }}>Click me</Button>
      </Box>
    </>
  );
}