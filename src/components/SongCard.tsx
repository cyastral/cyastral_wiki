import { Box, Card, CardContent, CardHeader, CardMedia, Typography } from "@mui/material";


export default function SongCard(props:{songName:string, singer:string}
) {
    return (
        <Card sx={{ width: 600}}>
            <Box sx={{display: "flex",}}>
                <CardMedia component="img" src="https://placehold.co/100x50" alt="Song Image" sx={{width:"30%"}}/>
                <Box sx={{width: "70%",}}>
                    <CardHeader title={[props.songName]} subheader={props.singer} />
                    <CardContent>
                        <Typography variant="body1">Song Description</Typography>
                    </CardContent>
                </Box>
            </Box>
        </Card>
    )
}