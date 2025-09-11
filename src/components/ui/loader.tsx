"use client";

interface LoaderProps {
  message?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Loader({ message = "Loading...", size = "md", className = "" }: LoaderProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  return (
    <div className={`flex items-center justify-center min-h-screen ${className}`}>
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-1">
          <div
            className={`${sizeClasses[size]} rounded-full bg-primary animate-pulse`}
            style={{ animationDelay: "0ms" }}
          />
          <div
            className={`${sizeClasses[size]} rounded-full bg-primary animate-pulse`}
            style={{ animationDelay: "150ms" }}
          />
          <div
            className={`${sizeClasses[size]} rounded-full bg-primary animate-pulse`}
            style={{ animationDelay: "300ms" }}
          />
        </div>
        {message && <p className="text-muted-foreground text-sm">{message}</p>}
      </div>
    </div>
  );
}
