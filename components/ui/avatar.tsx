import {cn} from '@/lib/utils'
import Image from "next/image";

interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function Avatar({ src, alt = "", fallback, size = "md", className }: AvatarProps) {
  const sizes = {
    sm: "w-7 h-7 text-xs",
    md: "w-9 h-9 text-sm",
    lg: "w-12 h-12 text-base",
    xl: "w-16 h-16 text-xl",
  };

  const pixelSizes = { sm: 28, md: 36, lg: 48, xl: 64 };

  return (
    <div
      className={cn(
        "relative rounded-full overflow-hidden bg-secondary flex items-center justify-center shrink-0 ring-2 ring-border",
        sizes[size],
        className
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          width={pixelSizes[size]}
          height={pixelSizes[size]}
          className="object-cover w-full h-full"
          unoptimized
        />
      ) : (
        <span className="font-semibold text-muted-foreground">
          {fallback?.charAt(0).toUpperCase() ?? "?"}
        </span>
      )}
    </div>
  );
}
