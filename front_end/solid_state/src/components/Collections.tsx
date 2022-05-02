import React, { useState, useEffect, useRef } from "react";
import { useEthers } from "@usedapp/core";
import Button from "@mui/material/Button"
import useSolidStateContexts from "../hooks/useSolidStateContext"
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Grid from '@mui/material/Grid';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { GalleryCollections } from "../hooks/GalleryView"
import { CollectionsOverview } from "./CollectionOverview";

export interface HeaderCollectionProps {
    ipfs: any,
}
export const Collections = ({ ipfs }: HeaderCollectionProps) => {
    const { state: APPSTATE, setMainSection } = useSolidStateContexts()


    const galleryCollections = GalleryCollections() || []
    return (<>
        <Grid container spacing={1} alignItems="stretch">
            {galleryCollections.map((data: any, index: any) => (
                <>

                    <CollectionsOverview ipfs={ipfs} id={index} title={data} />

                </>
            ))}
        </Grid>
    </>)
}