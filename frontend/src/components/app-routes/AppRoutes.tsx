import { Routes, Route, Navigate } from "react-router-dom";
import AuthPanel from "../auth/auth-panel/AuthPanel";
import GuardRoute from "./GuardRoute";
import EditVacation from "../admin/pages/edit-vacation/EditVacation";
import VacationsReport from "../admin/pages/vacations-report/VacationsReport";
import NotFound from "../common/not-found/NotFound";
import { useContext } from "react";
import AuthContext from "../auth/auth/AuthContext";
import AddVacation from "../admin/pages/add-vacation/AddVacation";
import AppLayout from "../common/app-layout/AppLayout";
import VacationsPage from "../common/vacations-page/VacationsPage";

export default function AppRoutes() {
    const auth = useContext(AuthContext);

    return (
        <Routes>

            <Route
                path="/"
                element={
                    auth && auth.role === "admin"
                        ? <Navigate to="/admin" replace />
                        : <Navigate to="/vacations" replace />
                }
            />

            <Route path="/auth/*" element={<AuthPanel />} />


            { /* This wraps the nested routes with an authorization guard.
            Only admins will be allowed to access the child routes. */ }
            <Route element={<GuardRoute requireAdmin={true} />}>
                <Route element={<AppLayout />}> {/* AppLayout is a parent Route, and all the Routes inside it are its children. */}
                    <Route path="/admin" element={<VacationsPage isAdmin={true} />} />
                    <Route path="/admin/add" element={<AddVacation />} />
                    <Route path="/admin/edit/:id" element={<EditVacation />} />
                    <Route path="/admin/reports" element={<VacationsReport />} />
                </Route>
            </Route>

            <Route element={<GuardRoute requireAdmin={false} />}>
                <Route element={<AppLayout />}>
                    <Route path="/vacations" element={<VacationsPage isAdmin={false} />} />
                </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}
