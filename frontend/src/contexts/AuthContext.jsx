import { createContext, useEffect, useReducer } from "react" 

export const AuthContext = createContext()

export const authReducer = function(state, action){
    switch (action.type){
        case 'login':
            localStorage.setItem("user", action.payload.token)
            return state = action.payload.token;
        case 'logout':
            localStorage.removeItem("user")
            return state = null;
        default:
            return state = null;
    }
}

export const AuthContextProvider = ({children}) => {
    const [authState, authDispatch] = useReducer(authReducer, null)
  useEffect(function(){
    const token = localStorage.getItem("user")
    if(token)
        authDispatch({type:'login', payload:{token}})
  }, [])
  return (
    <AuthContext.Provider value={{authState, authDispatch}}>
        {children}
    </AuthContext.Provider>
  )
}
