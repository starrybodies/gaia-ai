"use client";

import { useSession, signOut } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="site-header sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo - Clean, modern */}
          <a href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 rounded-lg bg-gradient-earth flex items-center justify-center">
              <span className="text-white text-xl font-bold">G</span>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-charcoal">
                GAIA AI
              </h1>
              <p className="text-xs text-stone font-medium">
                Environmental Intelligence
              </p>
            </div>
          </a>

          {/* Navigation - Clean style */}
          <nav className="hidden md:flex items-center gap-1">
            {[
              { label: "About", href: "/about" },
              { label: "Dashboard", href: "/demo" },
              { label: "Data Sources", href: "/about#data" },
              { label: "GitHub", href: "https://github.com" },
            ].map((item, i) => (
              <a
                key={i}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="px-4 py-2 text-sm font-medium text-stone hover:text-charcoal hover:bg-cream rounded-md transition-all"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Auth section */}
          <div className="flex items-center gap-3">
            {session ? (
              <>
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-cream rounded-md border border-border">
                  <span className="status-indicator status-active"></span>
                  <span className="text-xs font-medium text-charcoal">
                    {session.user?.name || session.user?.email}
                  </span>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="btn btn-outline text-xs"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <a
                href="/login"
                className="btn btn-primary text-xs"
              >
                Sign In
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Data status bar */}
      <div className="border-t border-border bg-cream/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex justify-between items-center text-xs">
          <div className="flex gap-6 items-center">
            <div className="flex items-center gap-2">
              <span className="status-indicator status-active"></span>
              <span className="text-stone font-medium">System Online</span>
            </div>
            {session && (
              <div className="flex items-center gap-2">
                <span className="status-indicator status-active"></span>
                <span className="text-success font-medium">Authenticated</span>
              </div>
            )}
          </div>
          <div className="flex gap-6 text-stone">
            <span className="font-mono">5 Data Sources</span>
            <span className="badge badge-warning text-[10px]">Alpha</span>
          </div>
        </div>
      </div>
    </header>
  );
}
