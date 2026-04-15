import { useState } from "react"
import { useAuthContext } from "../context/AuthContext"
import toast from "react-hot-toast";

const UseLogout = () => {
    const [loading, setloading] = useState(false);
    const { setAuthuser } = useAuthContext();

    const logout = async () => {
        setloading(true);
        try {
            const res = await fetch("http://localhost:5000/api/auth/logout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });

            const data = await res.json();

            if (data.error) {
                toast.error(data.error);
                return;
            }

            localStorage.removeItem('AuthUser');
            setAuthuser(null);
            toast.success("Logged out successfully!");
            window.location.href = "/";
        } catch (error) {
            toast.error(error.message || "Error during logout");
            console.error("Logout error:", error);
        } finally {
            setloading(false);
        }
    }

    return { loading, logout }
}

export default UseLogout
