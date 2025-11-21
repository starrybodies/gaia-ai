"use client";

import { useSession, signOut } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="site-header sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3">
          {/* Logo - Code style */}
          <a href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 border-2 border-white flex items-center justify-center relative">
              <span className="text-white text-lg font-bold">G</span>
              <div className="absolute inset-0 border border-blue animate-ping opacity-20"></div>
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-wider glow-white">
                <span className="text-white">GAIA.AI</span>
              </h1>
              <p className="text-[8px] text-white-dim uppercase tracking-widest">
                ENV_INTELLIGENCE
              </p>
            </div>
          </a>

          {/* Navigation - Terminal style */}
          <nav className="hidden md:flex items-center gap-1">
            {[
              { label: "[ABOUT]", href: "/about" },
              { label: "[DEMO]", href: "/demo" },
              { label: "[DATA]", href: "/about#data" },
              { label: "[SRC]", href: "https://github.com" },
            ].map((item, i) => (
              <a
                key={i}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="px-3 py-1 text-xs text-white-dim hover:text-blue hover:bg-code border border-transparent hover:border-blue transition-all uppercase tracking-wider"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Auth section */}
          <div className="flex items-center gap-2">
            {session ? (
              <>
                <div className="hidden md:flex items-center gap-2 px-3 py-1 border border-white bg-code">
                  <span className="text-[10px] text-white-dim uppercase tracking-wider">
                    USER:
                  </span>
                  <span className="text-[10px] text-blue uppercase">
                    {session.user?.name || session.user?.email}
                  </span>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="px-4 py-2 border-2 border-white text-white hover:bg-white hover:text-background transition-all font-mono text-xs uppercase tracking-wider"
                >
                  <span>&gt; LOGOUT</span>
                </button>
              </>
            ) : (
              <a
                href="/login"
                className="px-4 py-2 border-2 border-blue text-blue hover:bg-blue hover:text-white transition-all font-mono text-xs uppercase tracking-wider glow-blue"
              >
                <span>&gt; LOGIN</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div className="border-t border-white bg-code">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1 flex justify-between items-center text-[9px] text-white-dim uppercase tracking-widest">
          <div className="flex gap-4">
            <span>SYS: ONLINE</span>
            <span className="text-blue">█ CONNECTED</span>
            {session && (
              <span className="text-blue">AUTH: VERIFIED</span>
            )}
          </div>
          <div className="flex gap-4">
            <span>STATUS: ALPHA</span>
          </div>
        </div>
      </div>
    </header>
  );
}
