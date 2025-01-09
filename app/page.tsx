"use client"; // Indicates this is a client-side component
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Check for the JWT in localStorage
    const jwt = localStorage.getItem("jwt");

    if (jwt) {
      router.push("/profile"); // Redirect to /profile if JWT exists
    } else {
      router.push("/login"); // Redirect to /login otherwise
    }
  }, [router]);

  return null; // No content is rendered
}
