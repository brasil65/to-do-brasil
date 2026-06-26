import React from "react";
import { AuthBackground } from "@/components/auth/AuthBackground";
import { AuthBranding } from "@/components/auth/AuthBranding";
import { AuthForm } from "@/components/auth/AuthForm";

const Login: React.FC = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Full-screen background with image + gradient overlay */}
      <AuthBackground />

      {/* Main layout: two columns on desktop, single column on mobile */}
      <div className="relative z-10 flex min-h-screen">
        {/* Left side - Branding (desktop only) */}
        <div className="hidden lg:flex lg:w-[55%]">
          <AuthBranding />
        </div>

        {/* Right side - Form */}
        <div className="flex-1 lg:w-[45%]">
          <AuthForm />
        </div>
      </div>
    </div>
  );
};

export default Login;
