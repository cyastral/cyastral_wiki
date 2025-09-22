'use client'
import { Box, Button, Chip, Container, Stack, TextField, Typography } from "@mui/material";
import { Grid } from "@mui/material";
import { useState } from "react";
import { useActionState } from "react";
import { addSongAction } from "./action";

export default function AddSong() {

    const [songName, setSongName] = useState('');

    const availableVcsingers =[
        { id: 1, name: 'Miku'},
        { id: 2, name: 'Luka'},
        { id: 3, name: 'Rin'},
        { id: 4, name: 'Len'}
    ]

    const initialStates = {
        message: null,
        error: null
    }

    const [selectedSingers, setSelectedSingers] = useState<number[]>([]);
    const [formState, formAction, isPending] = useActionState(addSongAction, null);

    const handleSingerSelect = (singerId:number) => {
        if(selectedSingers.includes(singerId)) {
            setSelectedSingers(selectedSingers.filter((id) => id !== singerId));
        } else {
            setSelectedSingers([...selectedSingers, singerId]);
        }
    }



    return (
        <Container maxWidth="lg" sx={{ textAlign: 'center'}}>
            <Box component="form" action={formAction}>
                <Stack direction="column" spacing={2}>
                    <Typography variant="h3">Add Song</Typography>
                    <Grid container spacing={2}>
                        <Grid size={{xs: 12}}>
                            <TextField label="Song Name"
                            value={songName}
                            name="songName"
                            onChange={(e) => setSongName(e.target.value)} />
                        </Grid>
                        {availableVcsingers.map((singer) => (
                            <Grid size={{xs: 3}} key={singer.id}>
                                <Chip label={singer.name} 
                                variant={selectedSingers.includes(singer.id) ? 'filled' : 'outlined'}
                                color="primary"
                                onClick={() => handleSingerSelect(singer.id)}
                                />  
                            </Grid>
                        ))}
                        {selectedSingers.map(singerId => (
                            <input type="hidden" name="singers" value={singerId} key={singerId} />
                        ))}
                    </Grid>

                    <Button variant="contained" color="primary" type="submit">{isPending ? 'Submitting...' : 'Submit'}  </Button>

                    <Typography variant="body1">{formState?.message || formState?.error}</Typography>
                </Stack>
            </Box>
        </Container>
    )
}