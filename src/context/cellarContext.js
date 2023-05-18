import { useState, createContext} from 'react'

const Context = createContext({})

export function CellarContextProvider({ children }) {
    const [ cellar, setCellar ] = useState(null)

    const getCellar = (cel) => {
        setCellar(cel)
    }

    return (
        <Context.Provider value={{ cellar, getCellar, setCellar }}>{children}</Context.Provider>
    )
}

export default Context