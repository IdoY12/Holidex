import axios from "axios";
import type Register from "../models/Register";
import type AuthResponse from "../models/AuthResponse";

class SignupService {
    async signup(register: Register): Promise<AuthResponse> {
        const { data } = await axios.post<AuthResponse>(
            `${import.meta.env.VITE_REST_SERVER_URL}/auth/signup`,
            register
        )
        return data
    }
}

const signupService = new SignupService()
export default signupService
