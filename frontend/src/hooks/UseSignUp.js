import { useState } from "react"
import { useToast } from "@chakra-ui/react"
import { useAuthContext } from "../context/AuthContext"
import toast from "react-hot-toast";

const UseSignUp = () => {
    const [loading, setloading] = useState(false);
    const { Authuser, setAuthuser } = useAuthContext();
    const chakraToast = useToast();

    function handleInputErrors({ username, password, email, gender }) {
        if (!email || !username || !password || !gender) {
            toast.error("Please fill in all fields");
            return false;
        }
        if (password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return false;
        }
        if (email.includes("@") === false) {
            toast.error("Please enter a valid email");
            return false;
        }
        return true;
    }

    const signup = async (input) => {
        const success = handleInputErrors(input);
        if (!success) return;

        setloading(true);
        try {
            const res = await fetch("http://localhost:5000/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(input),
            });
            const data = await res.json();

            if (data.error) {
                toast.error(data.error);
                return;
            }

            localStorage.setItem('AuthUser', JSON.stringify(data));
            setAuthuser(data);
            toast.success("Account created successfully!");
            window.location.href = "/";
        } catch (error) {
            toast.error(error.message || "Unable to signup. Check if backend is running!");
            console.error("Signup error:", error);
        } finally {
            setloading(false);
        }
    };

    return { loading, signup };
};

export default UseSignUp;


