import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../auth/auth/AuthContext";

interface GuardProps {
    requireAdmin?: boolean;
}

export default function GuardRoute({ requireAdmin }: GuardProps) {
    const auth = useContext(AuthContext);
    const jwt = auth?.jwt;
    const role = auth?.role;

    if (!jwt) return <Navigate to="/auth/login" replace /> ;  {/* User is not authenticated — redirect to the login page. */}

    // Redirect to "/" ONLY when the route requires admin access
    // AND the current user is not an admin.
    if (requireAdmin && role !== "admin") return <Navigate to="/" replace />
    /*
    ACCESS LOGIC (Truth Table Summary):

    Test 1: Regular user opening an ADMIN page
    requireAdmin = true
    role = "user"
    true && true → true  → BLOCK → redirect to "/"

    Test 2: Admin opening an ADMIN page
    requireAdmin = true
    role = "admin"
    true && false → false → ALLOW → <Outlet />

    Test 3: Regular user opening a NORMAL page
    requireAdmin = false
    role = "user"
    false && true → false → ALLOW → <Outlet />

    Test 4: Admin opening a NORMAL page
    requireAdmin = false
    role = "admin"
    false && false → false → ALLOW → <Outlet />
    */

    return <Outlet />
    // If the access check above is FALSE,
    // it means the user is allowed to view this route.
    // <Outlet /> continues rendering the nested child routes normally (AppLayout).
}
