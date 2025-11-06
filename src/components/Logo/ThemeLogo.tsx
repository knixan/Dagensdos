"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";

interface ThemeLogoProps {
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

export default function ThemeLogo({
  alt = "Dagens Dos logotyp",
  width = 100,
  height = 60,
  className = "",
  priority = false,
}: ThemeLogoProps) {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // while SSR, avoid guessing theme — default to light until mounted
  const current = mounted ? resolvedTheme || theme : "light";
  const src = current === "dark" ? "/images/loggo-dark.png" : "/images/loggo-light.png";

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
    />
  );
}
