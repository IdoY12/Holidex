import { useContext, useMemo } from "react";
import AuthContext from "../components/auth/auth/AuthContext";
import type AuthAware from "../services/auth-aware/AuthAware";
import SocketDispatcherContext from "../components/socket/SocketDispatcherContext";

export default function useService<T extends AuthAware>(Service: { new(jwt: string, clientId: string): T }): T {
    const authContext = useContext(AuthContext);
    const clientIdContext = useContext(SocketDispatcherContext);
    const jwt = authContext!.jwt;
    const clientId = clientIdContext!.clientId;

    const service = useMemo(
        () => new Service(jwt, clientId),
        [Service, jwt, clientId]
    );

    return service;
}