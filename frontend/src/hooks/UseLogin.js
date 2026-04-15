import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

const UseLogin = () => {
    const [loading, setloading] = useState(false);
    const { setAuthuser } = useAuthContext();

    function handleInputErrors(username, password) {
        if (!username || !password) {
            toast.error("Please fill in all fields");
            return false;
        }
        return true;
    }

    const login = async (username, password) => {
        const success = handleInputErrors(username, password);
        if (!success) return;

        setloading(true);
        try {
            const res = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });
            const data = await res.json();

            if (data.error) {
                toast.error(data.error);
                return;
            }

            localStorage.setItem('AuthUser', JSON.stringify(data));
            setAuthuser(data);
            toast.success("Login successful!");
            window.location.href = "/";
        } catch (error) {
            toast.error(error.message || "Unable to login. Check if backend is running!");
            console.error("Login error:", error);
        } finally {
            setloading(false);
        }
    };

    return { loading, login };
};

export default UseLogin;
