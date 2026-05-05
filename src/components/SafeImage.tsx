import { useState } from "react";

interface Props extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string | null | undefined;
  fallbackLabel?: string;
  fallbackClassName?: string;
}

/**
 * Image that gracefully falls back to a branded gradient placeholder
 * when the src is missing OR the network image fails to load.
 * Prevents broken/ugly image icons from showing in the UI.
 */
export const SafeImage = ({ src, alt, fallbackLabel, fallbackClassName, className, ...rest }: Props) => {
  const [errored, setErrored] = useState(false);

  if (!src || errored) {
    return (
      <div
        className={
          fallbackClassName ??
          `flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/30 via-card to-secondary/30 text-center text-xs font-semibold text-foreground/80 p-3 ${className ?? ""}`
        }
        aria-label={alt}
      >
        <span className="line-clamp-3">{fallbackLabel ?? alt ?? "No image"}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setErrored(true)}
      {...rest}
    />
  );
};
