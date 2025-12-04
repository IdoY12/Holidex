import { createContext } from "react";

interface AuthContextInterface {
    jwt: string;
    role: string;
    id: string
    newJwt(jwt: string): void;
}

const AuthContext = createContext<AuthContextInterface | null>(null);
export default AuthContext;
