'use client'

import { Box, IconButton, TextField } from '@mui/material';
import React, { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useRouter } from 'next/navigation';

export default function NavBar() {
    const router = useRouter();
    const [query, setQuery] = useState("");

    const handleSearch = () => {
        router.push(`/songlist?query=${query}`);
    }
    
    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            margin: '0 auto',
        }}>
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1
            }}>
                <IconButton color='primary'>  
                    <MenuIcon />
                </IconButton>
                <span>Cyastral</span>
            </Box>

            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                width: '30%'
            }}>
                <TextField
                size='small'
                sx={{ width: '70%'}}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                />
                <IconButton color='primary' onClick={handleSearch}>
                    <SearchIcon />
                </IconButton>
            </Box>

            <IconButton color='primary'>
                <AccountCircleIcon />
            </IconButton>
        </Box>
    );
}