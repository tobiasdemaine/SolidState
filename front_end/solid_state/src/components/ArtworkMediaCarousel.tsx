import React from 'react';
import SwipeableViews from 'react-swipeable-views'
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MobileStepper from '@mui/material/MobileStepper';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { useIpfsRetrieve } from "../hooks/ipfs"
import useSolidStateContexts from "../hooks/useSolidStateContext"
import { ArtWorkIpfsMediaBox } from "./ArtworkIpfsMediaBox"

export interface ArtWorkMetaDataProps {
    IpfsHash: any,
    description: any
}

const styles = {
    slide: {
        padding: 15,
        minHeight: 100,
        color: '#fff',
    },
    slide1: {
        backgroundColor: '#FEA900',
    },
    slide2: {
        backgroundColor: '#B3DC4A',
    },
    slide3: {
        backgroundColor: '#6AC0FF',
    },
};

type Media = {
    [key: string]: string;
};

export const ArtworkMediaCarousel = ({ IpfsHash, description }: ArtWorkMetaDataProps) => {
    const { state: APPSTATE, setMainSection, setArtWorkAddress } = useSolidStateContexts()
    let { _data, _blob, isIpfsFileReady } = useIpfsRetrieve(APPSTATE.ipfs, IpfsHash)

    const theme = useTheme();
    const [activeStep, setActiveStep] = React.useState(0);
    var maxSteps = 0;

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleStepChange = (step: number) => {
        setActiveStep(step);
    };

    var metaDataPack = { "images": [], "videos": [] }
    var titles = []
    if (isIpfsFileReady && _data != '') {
        metaDataPack = JSON.parse(_data)
        maxSteps = metaDataPack.images.length;
        for (var i in metaDataPack.images) {
            const m: Media = metaDataPack.images[i]
            titles.push(m.description)
        }
    }


    return (
        <>
            <Box sx={{ flexGrow: 1 }}>

                <SwipeableViews
                    axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                    index={activeStep}
                    onChangeIndex={handleStepChange}
                    enableMouseEvents
                >
                    {metaDataPack.images.map((step: any, index: any) => (
                        <div key={step.description}>
                            {Math.abs(activeStep - index) <= 2 ? (
                                <>

                                    <ArtWorkIpfsMediaBox IpfsHash={step.IpfsHash} description={step.description} mime="image" />
                                </>
                            ) : null}
                        </div>
                    ))}
                </SwipeableViews>
                <Paper
                    square
                    elevation={0}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        height: 50,
                        pl: 2,
                        bgcolor: 'background.default',
                    }}
                >
                    <Typography>
                        {titles[activeStep]}
                    </Typography>
                </Paper>
                <MobileStepper
                    steps={maxSteps}
                    position="static"
                    activeStep={activeStep}
                    nextButton={
                        <Button
                            size="small"
                            onClick={handleNext}
                            disabled={activeStep === maxSteps - 1}
                        >
                            Next
                            {theme.direction === 'rtl' ? (
                                <KeyboardArrowLeft />
                            ) : (
                                <KeyboardArrowRight />
                            )}
                        </Button>
                    }
                    backButton={
                        <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                            {theme.direction === 'rtl' ? (
                                <KeyboardArrowRight />
                            ) : (
                                <KeyboardArrowLeft />
                            )}
                            Back
                        </Button>
                    }
                />
            </Box>
        </>
    );
}
