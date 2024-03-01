import { useContext } from "react"
import ProManagerContext from './ProManagerContext'

const useProManagerContext = () => {
    return useContext(ProManagerContext)
}

export default useProManagerContext;