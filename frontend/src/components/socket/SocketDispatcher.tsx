import { useContext, useEffect, useState, type PropsWithChildren } from "react";
import { io } from "socket.io-client";
import { useAppDispatcher } from "../../redux/hooks";
import { incrementLikes, decrementLikes } from "../../redux/vacations-slice";
import SocketMessages from "./socket-enums/socket-enums";
import { v4 } from "uuid";
import SocketDispatcherContext from "./SocketDispatcherContext";
import { addLike, removeLike } from "../../redux/likes-slice";
import AuthContext from "../auth/auth/AuthContext";

export default function SocketDispatcher(props: PropsWithChildren) {
    const dispatch = useAppDispatcher();
    const [clientId] = useState<string>(v4());

    const auth = useContext(AuthContext);

    useEffect(() => {
        const socket = io(`${import.meta.env.VITE_IO_SERVER_URL}`);

        socket.on(SocketMessages.LikesUpdated, (payload) => {
            // Ignore events that originated from this same device (prevents double UI updates in this tab).
            if (payload.clientId === clientId) return;

            switch (payload.change) {
                case 1:
                    // Increase the like counter in vacationsSlice (all users see the new like count).
                    dispatch(incrementLikes(payload.vacationId));

                    // If the user who liked is *this current logged-in user*, update their likedIds list.
                    if (payload.userId === auth?.id) {
                        // Add this vacation ID to this user's personal likedIds array.
                        dispatch(addLike(payload.vacationId));
                    }
                    break;

                case -1:
                    // Decrease the like counter in vacationsSlice (all users see the decreased like count).
                    dispatch(decrementLikes(payload.vacationId));

                    // If the user who unliked is *this current logged-in user*, update their likedIds list.
                    if (payload.userId === auth?.id) {
                        // Remove this vacation ID from this user's personal likedIds array.
                        dispatch(removeLike(payload.vacationId));
                    }
                    break;
            }
        });

        return () => { socket.disconnect(); };
    }, [clientId, dispatch]);

    const { children } = props;

    return (
        <SocketDispatcherContext.Provider value={{ clientId }}>
            {children}
        </SocketDispatcherContext.Provider>
    );
}
