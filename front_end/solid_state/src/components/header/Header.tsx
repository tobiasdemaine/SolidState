import React, { useState, useEffect, useRef } from "react";
import { useEthers } from "@usedapp/core";
import { GalleryOwners, } from "../../hooks/GalleryView"
import Button from "@mui/material/Button"
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { LinearProgress } from "@mui/material"
import { HeaderCollections } from "./HeaderCollections";
import useSolidStateContexts from "../../hooks/useSolidStateContext"
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DoNotDisturbOnIcon from '@mui/icons-material/DoNotDisturbOn';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
export interface HeaderProps {
    ipfs: any,

}
export const Header = ({ ipfs }: HeaderProps) => {
    const { state: APPSTATE, setMainSection, setArtWorkAddress } = useSolidStateContexts()
    const { account, activateBrowserWallet, deactivate, error } = useEthers()
    const isConnected = account !== undefined
    const owners = GalleryOwners() || []

    const [dashAnchorEl, setDashAnchorEl] = useState<null | HTMLElement>(null);
    const dashOpen = Boolean(dashAnchorEl);
    const dashHandleClick = (event: React.MouseEvent<HTMLElement>) => {
        setDashAnchorEl(event.currentTarget);
    };
    const dashHandleClose = () => {
        setDashAnchorEl(null);
    };

    return (
        <>
            <Box sx={{ flexGrow: 1 }}>

                <AppBar position="fixed">
                    {
                        !Boolean(ipfs) &&
                        <LinearProgress />
                    }
                    <Toolbar>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            {APPSTATE.mainsection.section == "artwork" ? (
                                <>Artwork</>
                            ) : (
                                <> {APPSTATE.mainsection.title}</>
                            )}

                        </Typography>

                        {isConnected ? (

                            <>

                                <HeaderCollections ipfs={ipfs} />
                                <Button
                                    id="dash-positioned-button"
                                    aria-controls={dashOpen ? 'dash-positioned-menu' : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={dashOpen ? 'true' : undefined}
                                    onClick={dashHandleClick}
                                >
                                    <AccountCircleIcon />
                                </Button>
                                <Menu
                                    id="dash-positioned-menu"
                                    aria-labelledby="dash-positioned-button"
                                    anchorEl={dashAnchorEl}
                                    open={dashOpen}
                                    onClose={dashHandleClose}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'left',
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'left',
                                    }}
                                >
                                    {
                                        owners[owners.length - 1] === account &&
                                        <MenuItem onClick={() => {
                                            setMainSection({ section: "addCollection", value: 0, title: "Add Collection" })
                                            dashHandleClose()
                                        }}>Add Collection</MenuItem>


                                    }
                                    {
                                        owners[owners.length - 1] === account &&
                                        <MenuItem onClick={() => {
                                            setMainSection({ section: "addArtwork", value: 0, title: "Add" })
                                            dashHandleClose()
                                        }}>Add Artwork</MenuItem>
                                    }
                                    <MenuItem onClick={() => {
                                        setMainSection({ section: "myArtworks", value: 0, title: "My ArtWorks" })
                                        dashHandleClose()
                                    }}>My Artworks</MenuItem>
                                    <MenuItem onClick={() => {
                                        setMainSection({ section: "myShares", value: 0, title: "My Shares" })
                                        dashHandleClose()
                                    }}>My Shares</MenuItem>
                                    <MenuItem onClick={deactivate}>Logout</MenuItem>
                                </Menu>

                            </>
                        ) : (
                            <>
                                <HeaderCollections ipfs={ipfs} />
                                <Button id="connectButton" color="inherit"
                                    onClick={() => activateBrowserWallet()}>
                                    Connect Wallet
                                </Button>
                            </>
                        )
                        }

                    </Toolbar>
                </AppBar>
                <Toolbar />
            </Box>
            <AppBar position="fixed" color="primary" sx={{ top: 'auto', bottom: 0, }}>
                <Toolbar sx={{ m: -2 }}>
                    <Typography variant="body1" component="div" sx={{ flexGrow: 1 }}>

                    </Typography>
                    {
                        !Boolean(ipfs) ? (
                            <>
                                <Typography variant="subtitle1" component="div" sx={{ mr: 2, ml: 2 }}>
                                    IPFS

                                </Typography>
                                <DoNotDisturbOnIcon color="error" fontSize="small" sx={{ mr: 2 }} />
                            </>
                        ) : (
                            <>
                                <Typography variant="body1" component="div" sx={{ mr: 0.5, ml: 2 }}  >
                                    IPFS
                                </Typography>

                                <CheckCircleIcon color="success" id="ipfsON" fontSize="small" sx={{ mr: 2 }} />
                            </>
                        )
                    }
                </Toolbar>
            </AppBar>
        </>
    )
}