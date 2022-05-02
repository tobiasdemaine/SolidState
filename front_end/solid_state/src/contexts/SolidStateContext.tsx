
import React, { createContext, useState } from 'react'

type AppContextState = { mainsection: any; artwork: boolean; ipfs: any }


const appCtxDefaultValue = {
    state: { mainsection: { section: "enter", value: 0, title: 'Solid State' }, artwork: false, ipfs: null },
    setState: (state: AppContextState) => { } // noop default callback
};

export interface IProviderProps {
    children?: any;
}

export const AppContext = createContext(appCtxDefaultValue);

export const AppStateProvider = (props: IProviderProps) => {
    const [state, setState] = useState(appCtxDefaultValue.state);

    return (
        // memoize `value` to optimize performance, if AppProvider is re-rendered often 
        <AppContext.Provider value={{ state, setState }}>
            {props.children}
        </AppContext.Provider>
    );
};
