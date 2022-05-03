import { useContext } from 'react'
import { AppContext } from '../contexts/SolidStateContext';

const useSolidStateContexts = () => {
    const { state, setState } = useContext(AppContext);



    const setMainSection = (section: any) => {
        setState({ ...state, mainsection: section });

    }

    const setArtWorkAddress = (address: any) => {
        setState({ ...state, artwork: address });

    }

    const setIpfs = (ipfs: any) => {
        setState({ ...state, ipfs: ipfs });

    }
    return { state, setMainSection, setArtWorkAddress, setIpfs }
}


export default useSolidStateContexts