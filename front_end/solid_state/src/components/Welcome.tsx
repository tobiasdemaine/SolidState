import React, { useState, useEffect } from "react";
import { IconButton, Collapse, Alert } from "@mui/material"
import CloseIcon from '@mui/icons-material/Close'
import networkMapping from "../chain-info/deployments/map.json"
import logo from '../media/logo512.png'
export const Welcome = () => {
    const [open, setOpen] = useState(true);
    const SolidStateGalleryAddress = networkMapping[42]["SolidStateGallery"][0]
    const ethScanAddress = "https://kovan.etherscan.io/address/" + SolidStateGalleryAddress
    return (
        <>
            <Collapse in={open}>
                <Alert
                    sx={{ mt: 2 }}
                    variant="filled"
                    severity="info"
                    action={
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => {
                                setOpen(false);
                            }}
                        >
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                    }
                >
                    Welcome to <strong>Solid State</strong>, a decentralised market for trading shares in Artworks.
                    This is a Test Server running on the Ethereum Kovan Test Network. Set your wallet network to the Kovan Test Network.

                </Alert>
            </Collapse>
        </>
    )
}

/*
return (
        <>
            <Grid container spacing={2} sx={{ mb: 4, mt: 1 }} alignItems="stretch">
                <Grid item xs={12} md={6} lg={6}>
                    <Box
                        component="img"
                        sx={{

                            display: 'block',
                            overflow: 'hidden',
                            width: '100%',
                        }}
                        src={logo}
                        alt="The Solid State Logo"
                    />
                </Grid>
                <Grid item xs={12} md={6} lg={6}>
                    <Paper elevation={0} sx={{ p: 2, }}><Typography component="div"   >
                        <Typography component="div" variant="h2" >
                            Solid State
                        </Typography>
                        <p>
                            Welcome to <strong>Solid State</strong>, a decentralised market for trading shares in Artworks.
                            This is a Test Server running on the Ethereum Kovan Test Network. Please set your wallet network to the Kovan Test Network.
                        </p>
                        <p>
                            The gallery contract &nbsp;
                            <small><Link target="_blank" href={ethScanAddress}>{SolidStateGalleryAddress}</Link></small>
                        </p>
                        <p>
                            If you need some Kovan ETH to play with fill up your wallet from a&nbsp;
                            <Link target="_blank" href="https://faucets.chain.link/kovan">faucet</Link>.
                        </p>
                    </Typography>
                    </Paper>
                </Grid>
            </Grid>

        </>
    )
*/