"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("ACCESS_DENIED: Invalid credentials");
        setLoading(false);
      } else {
        // Success!
        router.push("/demo");
      }
    } catch (err) {
      setError("SYSTEM_ERROR: Authentication failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="terminal-window p-8">
          <div className="window-header mb-6">
            <span className="text-blue">[ACCESS_CONTROL]</span>
            <div className="window-controls">
              <div className="window-control"></div>
              <div className="window-control"></div>
              <div className="window-control"></div>
            </div>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white font-mono mb-2 glow-white">
              GAIA.AI_AUTH
            </h1>
            <p className="text-sm text-white-dim font-mono">
              <span className="text-blue">&gt;</span> RESTRICTED AREA • AUTHORIZED PERSONNEL ONLY
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div>
              <label className="block text-xs text-blue uppercase tracking-wider mb-2 font-mono">
                [USERNAME]
              </label>
              <div className="border border-white bg-code p-3 flex items-center hover:border-blue transition-all">
                <span className="text-blue mr-2">&gt;</span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-white font-mono uppercase tracking-wider placeholder:text-white-dim placeholder:opacity-50"
                  placeholder="ENTER_USERNAME"
                  required
                  autoFocus
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs text-blue uppercase tracking-wider mb-2 font-mono">
                [PASSWORD]
              </label>
              <div className="border border-white bg-code p-3 flex items-center hover:border-blue transition-all">
                <span className="text-blue mr-2">&gt;</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-white font-mono placeholder:text-white-dim placeholder:opacity-50"
                  placeholder="********"
                  required
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="border border-white bg-code p-4">
                <div className="text-white font-mono text-sm">
                  <span className="animate-pulse">⚠</span> {error}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full px-6 py-4 border-2 border-blue text-blue hover:bg-blue hover:text-white transition-all font-mono text-sm uppercase tracking-wider relative group ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <span>&gt; AUTHENTICATING<span className="cursor"></span></span>
              ) : (
                <span className="relative z-10">&gt; GRANT_ACCESS</span>
              )}
              {!loading && (
                <div className="absolute inset-0 box-glow-blue opacity-0 group-hover:opacity-100 transition-opacity"></div>
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 border-t border-white pt-6">
            <div className="text-xs text-blue mb-3 uppercase tracking-wider font-mono">
              [DEMO_CREDENTIALS]
            </div>
            <div className="space-y-2 text-xs font-mono">
              <div className="border border-white p-3 bg-code">
                <span className="text-blue">&gt;</span> USERNAME: <span className="text-white">admin</span> • PASSWORD: <span className="text-white">gaia2025</span>
              </div>
              <div className="border border-white p-3 bg-code">
                <span className="text-blue">&gt;</span> USERNAME: <span className="text-white">demo</span> • PASSWORD: <span className="text-white">demo</span>
              </div>
              <div className="border border-white p-3 bg-code">
                <span className="text-blue">&gt;</span> USERNAME: <span className="text-white">hacker</span> • PASSWORD: <span className="text-white">c4pher</span>
              </div>
            </div>
          </div>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <a
              href="/"
              className="text-xs text-white-dim hover:text-blue transition-colors font-mono uppercase tracking-wider"
            >
              &lt; BACK_TO_HOME
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
