import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../login/Login";
import Signup from "../signup/Signup";

export default function AuthPanel() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/auth/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={<Navigate to="/auth/login" />} />
        </Routes>
    );
}
