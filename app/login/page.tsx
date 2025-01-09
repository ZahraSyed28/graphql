"use client";

import { useState } from "react";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleInputChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(""); // Clear error on input change
  };

  const validateForm = () => {
    if (!formData.username.trim() || !formData.password.trim()) {
      setError("Username and password are required.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (validateForm()) {
      setError(""); // Clear any existing errors
      try {
        // Encode username and password for Basic Auth
        const credentials = btoa(`${formData.username}:${formData.password}`);

        const response = await fetch(
          "https://learn.reboot01.com/api/auth/signin",
          {
            method: "POST",
            headers: {
              Authorization: `Basic ${credentials}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Invalid credentials");
        }

        const jwt = await response.json();
        if (!jwt) {
          throw new Error("JWT not provided by the server.");
        }

        localStorage.setItem("jwt", jwt);
        console.log("JWT successfully saved:", jwt);
        router.push("/profile");
      } catch (err) {
        setError("Invalid username or password.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-background dark:bg-dark-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-card dark:bg-dark-card p-8 rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-heading font-heading text-foreground dark:text-dark-foreground">
            Welcome to GraphQL
          </h2>
          <p className="mt-2 text-body text-accent dark:text-dark-accent">
            Please sign in to your account
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-body font-body text-foreground dark:text-dark-foreground"
              >
                Username
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="h-5 w-5 text-accent dark:text-dark-accent" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-input dark:border-dark-input rounded-md shadow-sm placeholder-accent dark:placeholder-dark-accent text-foreground dark:text-dark-foreground bg-card dark:bg-dark-card focus:outline-none focus:ring-2 focus:ring-ring dark:focus:ring-dark-ring focus:border-transparent"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-body font-body text-foreground dark:text-dark-foreground"
              >
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-accent dark:text-dark-accent" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  className="appearance-none block w-full pl-10 pr-10 py-2 border border-input dark:border-dark-input rounded-md shadow-sm placeholder-accent dark:placeholder-dark-accent text-foreground dark:text-dark-foreground bg-card dark:bg-dark-card focus:outline-none focus:ring-2 focus:ring-ring dark:focus:ring-dark-ring focus:border-transparent"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FaEyeSlash className="h-5 w-5 text-accent dark:text-dark-accent" />
                  ) : (
                    <FaEye className="h-5 w-5 text-accent dark:text-dark-accent" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {error && (
            <p className="mt-4 text-sm text-destructive text-center">{error}</p>
          )}

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-body font-body text-primary-foreground bg-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring transition-colors duration-200"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
