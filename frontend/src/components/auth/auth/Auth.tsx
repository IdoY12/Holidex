import { useState, type PropsWithChildren } from "react";
import AuthContext from "./AuthContext";

export default function Auth({ children }: PropsWithChildren) {

    const storedJwt = localStorage.getItem("jwt") || ""
    let initialRole = "";
    let initialUserId = "";

    try {
        if (storedJwt) {
            const payload = JSON.parse(atob(storedJwt.split(".")[1]))
            initialRole = payload.role
            initialUserId = payload.id
        }
    } catch {
        initialRole = ""
        initialUserId = ""
    }

    const [jwt, setJwt] = useState(storedJwt)
    const [role, setRole] = useState(initialRole)
    const [id, setUserId] = useState(initialUserId)

    function newJwt(jwt: string) {
        setJwt(jwt);
        localStorage.setItem("jwt", jwt)

        try {
            const payload = JSON.parse(atob(jwt.split(".")[1]))
            const roleFromJwt = payload.role
            const userIdFromJwt = payload.id
            setRole(roleFromJwt)
            setUserId(userIdFromJwt)
            
        } catch {
            setRole("")
        }
    }

    return (
        <AuthContext.Provider value={{ jwt, role, newJwt, id }}>
            {children}
        </AuthContext.Provider>
    );
}
