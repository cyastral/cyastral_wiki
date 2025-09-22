'use client'

import { Box, Button } from "@mui/material";
import { addsinger } from "./action";


export default function Test() {
    return (
        <Box>
            <Button variant="contained" color="primary" onClick={addsinger}>Test</Button>
        </Box>
    )
}