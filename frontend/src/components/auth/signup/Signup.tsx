import { useState } from "react";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import signupService from "../../../services/signup";
import type RegisterModel from "../../../models/Register";
import "../auth-panel/AuthPanel.css"
import useTitle from "../../../hooks/use-title";

export default function Signup() {

    useTitle('Signup')

    const { register, handleSubmit, formState: { errors } } = useForm<RegisterModel>();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    async function submit(model: RegisterModel) {
        try {
            setIsSubmitting(true);
            await signupService.signup(model);
            navigate("auth/login");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="AuthFormWrapper">
            <div className="AuthCard">
                <h2>Register</h2>

                <form onSubmit={handleSubmit(submit)}>

                    <input
                        placeholder="first name"
                        {...register("firstName", {
                            required: "First name is required",
                            minLength: { value: 2, message: "Minimum 2 characters" }
                        })}
                    />
                    {errors.firstName && <div className="error-box">{errors.firstName.message}</div>}

                    <input
                        placeholder="last name"
                        {...register("lastName", {
                            required: "Last name is required",
                            minLength: { value: 2, message: "Minimum 2 characters" }
                        })}
                    />
                    {errors.lastName && <div className="error-box">{errors.lastName.message}</div>}

                    <input
                        placeholder="email"
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: "Email must be a valid email"
                            }
                        })}
                    />
                    {errors.email && <div className="error-box">{errors.email.message}</div>}

                    <input
                        placeholder="password"
                        type="password"
                        {...register("password", {
                            required: "Password is required",
                            minLength: { value: 6, message: "Minimum 6 characters" }
                        })}
                    />
                    {errors.password && <div className="error-box">{errors.password.message}</div>}

                    <button disabled={isSubmitting}>Register</button>
                </form>

                <div className="SwitchText">
                    already a member? <NavLink to="/auth/login">login</NavLink>
                </div>
            </div>
        </div>
    );
}
