'use client'

import { Box, IconButton, TextField } from '@mui/material';
import React, { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useRouter } from '@/i18n/navigation';
import AddIcon from '@mui/icons-material/Add';

export default function NavBar() {
    const router = useRouter();
    const [query, setQuery] = useState("");

    const handleSearch = () => {
        router.push(`/songlist?query=${query}`);
    }

    const handleAdd = () => {
        router.push('/songs/add');
    }
    
    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            margin: '0 auto',
            borderBottom: '1px solid red',
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

            <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                <IconButton color='primary' onClick={handleAdd}>          
                    <AddIcon />
                </IconButton>
                <IconButton color='primary'>          
                    <AccountCircleIcon />
                </IconButton>
            </Box>
        </Box>
    );
}