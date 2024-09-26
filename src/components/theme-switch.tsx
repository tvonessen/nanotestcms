"use client";

import React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "@phosphor-icons/react";

export const ThemeSwitch = () => {
  const { theme, setTheme } = useTheme();

  React.useLayoutEffect(() => {
    if (!theme) {
      setTheme(
        window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light",
      );
    } else if (theme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <button
      aria-label="Toggle website theme"
      className="btn btn-square btn-ghost text-background dark:text-foreground  "
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme !== "dark" ? (
        <Sun size={27} weight="regular" />
      ) : (
        <Moon size={27} weight="regular" />
      )}
    </button>
  );
};
