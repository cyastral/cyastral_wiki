'use client';
import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

export default function SimpleLayout() {
  const t = useTranslations('HomePage');
  return (
    <>
      <Box>
        <Typography variant="h3">Welcome to the CyastralWiki!</Typography>
        <Typography variant="h3">{t('title')}</Typography>
        <Button variant="contained" color="primary" onClick={() => {
          console.log(process.env.NODE_ENV);
        }}>Click me</Button>
      </Box>
    </>
  );
} 