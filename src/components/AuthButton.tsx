"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function isLoggedIn(): boolean {
  if (typeof window === "undefined") return false;

  const token = localStorage.getItem("movie_access_token");
  const storedUser = localStorage.getItem("movie_user");

  if (!token || !storedUser) return false;

  try {
    const user = JSON.parse(storedUser);

    return (
      user !== null &&
      typeof user === "object" &&
      !Array.isArray(user) &&
      Object.keys(user).length > 0
    );
  } catch {
    return false;
  }
}

export default function AuthButton() {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);

  const syncAuthState = useCallback(() => {
    setLoggedIn(isLoggedIn());
  }, []);

  useEffect(() => {
    setMounted(true);
    syncAuthState();

    // Detect changes made in other browser tabs.
    window.addEventListener("storage", syncAuthState);

    // Detect login/logout changes made in this tab.
    window.addEventListener("movie-auth-changed", syncAuthState);

    return () => {
      window.removeEventListener("storage", syncAuthState);
      window.removeEventListener("movie-auth-changed", syncAuthState);
    };
  }, [syncAuthState]);

  function handleClick() {
    if (!loggedIn) {
      router.push("/login");
      return;
    }

    localStorage.removeItem("movie_access_token");
    localStorage.removeItem("movie_user");

    window.dispatchEvent(new Event("movie-auth-changed"));

    router.push("/");
    router.refresh();
  }

  // Avoid rendering the wrong button during initial hydration.
  if (!mounted) {
    return (
      <button
        disabled
        className="rounded-lg bg-gray-700 px-4 py-2 text-white opacity-60"
      >
        ...
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={`rounded-lg px-4 py-2 font-medium text-white transition ${
        loggedIn
          ? "bg-red-600 hover:bg-red-500"
          : "bg-blue-600 hover:bg-blue-500"
      }`}
    >
      {loggedIn ? "Logout" : "Login"}
    </button>
  );
}