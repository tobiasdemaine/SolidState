import React, { useState, useEffect, useRef } from "react";
import Button from "@mui/material/Button"
import useSolidStateContexts from "../hooks/useSolidStateContext"
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { GalleryCollections } from "../hooks/GalleryView"


export interface HeaderCollectionProps {
    ipfs: any,

}
export const HeaderCollections = ({ ipfs }: HeaderCollectionProps) => {

    const { state: APPSTATE, setMainSection, setArtWorkAddress } = useSolidStateContexts()
    const [collectionAnchorEl, setCollectionAnchorEl] = useState<null | HTMLElement>(null);
    const collectionOpen = Boolean(collectionAnchorEl);


    const galleryCollections = GalleryCollections() || []
    const collectionHandleClick = (event: React.MouseEvent<HTMLElement>) => {
        setCollectionAnchorEl(event.currentTarget);
    };
    const collectionHandleClose = () => {
        setCollectionAnchorEl(null);
    };

    return (
        <>
            <Button
                id="collection-positioned-button"
                aria-controls={collectionOpen ? 'collection-positioned-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={collectionOpen ? 'true' : undefined}
                onClick={collectionHandleClick}
            >
                Collections
            </Button>

            <Menu
                id="collection-positioned-menu"
                aria-labelledby="dash-positioned-button"
                anchorEl={collectionAnchorEl}
                open={collectionOpen}
                onClose={collectionHandleClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                {galleryCollections.map((data: any, index: any) => (
                    <MenuItem onClick={() => {
                        collectionHandleClose()
                        setMainSection({ section: "collection", value: index, title: data })
                    }}>{data} </MenuItem>
                ))}

            </Menu>
        </>
    )
}