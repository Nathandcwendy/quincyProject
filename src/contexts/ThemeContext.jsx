import { createContext, useState, useEffect } from "react";

const ThemeContext = createContext({});

// eslint-disable-next-line react/prop-types
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.theme || "light");
  useEffect(() => {
    let element = document.documentElement;
    theme === "dark"
      ? element.classList.add("dark")
      : element.classList.remove("dark");
    localStorage.theme = theme;
  }, [theme]);

  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (event) => {
      const newColorScheme = event.matches ? "dark" : "light";
      setTheme(newColorScheme);
    });
  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
