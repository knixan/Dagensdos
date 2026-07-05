import Image from "next/image";

interface ThemeLogoProps {
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  asset?: "loggo" | "icon";
}

const SRC: Record<NonNullable<ThemeLogoProps["asset"]>, string> = {
  loggo: "/images/dagensdos-loggo.png",
  icon: "/images/dagensdos-icon.png",
};

export default function ThemeLogo({
  alt = "Dagens Dos logotyp",
  width = 100,
  height = 60,
  className = "",
  priority = false,
  asset = "loggo",
}: ThemeLogoProps) {
  return (
    <Image
      src={SRC[asset]}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
    />
  );
}
