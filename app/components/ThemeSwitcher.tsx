"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Expand } from "@theme-toggles/react";

const ThemeSwitch = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return null;
  }

  return (
    <div
      aria-label="Toggle Dark Mode"
      className="text-2xl mt-1.5"
      onClick={() =>
        setTheme(
          theme === "dark" || resolvedTheme === "dark" ? "light" : "dark"
        )
      }
    >
      <Expand duration={750} placeholder={undefined} />
    </div>
  );
};

export default ThemeSwitch;
