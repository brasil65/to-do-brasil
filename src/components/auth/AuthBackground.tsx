import React from "react";

/**
 * Background component with image, gradient overlay, and parallax effect.
 * Supports light/dark themes.
 */
export const AuthBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10">
      {/* Background image - productivity/organization theme */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=1920&q=80')`,
        }}
        aria-hidden="true"
      />

      {/* Gradient overlay for readability */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-blue-900/85 via-slate-900/80 to-indigo-900/85 dark:from-blue-950/90 dark:via-slate-950/90 dark:to-indigo-950/90"
        aria-hidden="true"
      />

      {/* Subtle decorative elements */}
      <div
        className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"
        aria-hidden="true"
      />
    </div>
  );
};
