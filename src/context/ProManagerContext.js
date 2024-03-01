import { createContext, useState } from "react";

const ProManagerContext = createContext({
    loggedIn:false,
    setLoggedIn:()=>{},
    loading:false,
    setLoading:()=>{},
    checklistId: null,
    setChecklistId: () => {},
})

const Provider = ({children}) =>{
    const [loggedIn,setLoggedIn] = useState(false);
    const [loading,setLoading] = useState(false);
    const [checklistId, setChecklistId] = useState(null)

    const valueToShare = {
        loggedIn,
        setLoggedIn,
        loading,
        setLoading,
        checklistId,
        setChecklistId
    };

    return (
        <ProManagerContext.Provider value={valueToShare}>{children}</ProManagerContext.Provider>
    )
}

export { Provider };

export default ProManagerContext;
