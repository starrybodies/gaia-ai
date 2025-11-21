"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [bootSequence, setBootSequence] = useState(true);
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

  // Hide boot sequence after 2 seconds
  setTimeout(() => setBootSequence(false), 2000);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        {bootSequence ? (
          // Boot Sequence
          <div className="terminal-window p-8">
            <div className="window-header mb-6">
              <span className="text-matrix-green">[SYSTEM_BOOT]</span>
            </div>
            <div className="font-mono text-sm space-y-2 text-terminal-gray">
              <div>
                <span className="text-matrix-green">&gt;</span> INITIALIZING
                AUTHENTICATION MODULE...
              </div>
              <div>
                <span className="text-matrix-green">&gt;</span> LOADING
                SECURITY PROTOCOLS...
              </div>
              <div>
                <span className="text-matrix-green">&gt;</span> ESTABLISHING
                SECURE CONNECTION...
              </div>
              <div className="text-neon-cyan">
                <span className="text-matrix-green">&gt;&gt;</span> READY FOR
                INPUT<span className="cursor"></span>
              </div>
            </div>
          </div>
        ) : (
          // Login Form
          <div className="terminal-window p-8">
            <div className="window-header mb-6">
              <span className="text-matrix-green">[ACCESS_CONTROL]</span>
              <div className="window-controls">
                <div className="window-control"></div>
                <div className="window-control"></div>
                <div className="window-control"></div>
              </div>
            </div>

            <div className="mb-8">
              <h1 className="text-3xl font-bold text-matrix-green font-mono mb-2 glow-green">
                GAIA.AI_AUTH
              </h1>
              <p className="text-sm text-terminal-gray font-mono">
                <span className="text-matrix-green">&gt;</span> RESTRICTED
                AREA • AUTHORIZED PERSONNEL ONLY
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username */}
              <div>
                <label className="block text-xs text-neon-cyan uppercase tracking-wider mb-2 font-mono">
                  [USERNAME]
                </label>
                <div className="border border-matrix-green/40 bg-terminal-dark p-3 flex items-center hover:border-matrix-green transition-all">
                  <span className="text-matrix-green mr-2">&gt;</span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none text-matrix-green font-mono uppercase tracking-wider"
                    placeholder="ENTER_USERNAME"
                    required
                    autoFocus
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs text-neon-cyan uppercase tracking-wider mb-2 font-mono">
                  [PASSWORD]
                </label>
                <div className="border border-matrix-green/40 bg-terminal-dark p-3 flex items-center hover:border-matrix-green transition-all">
                  <span className="text-matrix-green mr-2">&gt;</span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none text-matrix-green font-mono"
                    placeholder="********"
                    required
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="border border-neon-red bg-terminal-dark p-4">
                  <div className="text-neon-red font-mono text-sm">
                    <span className="animate-pulse">⚠</span> {error}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full px-6 py-4 border-2 border-matrix-green text-matrix-green hover:bg-matrix-green hover:text-black transition-all font-mono text-sm uppercase tracking-wider relative group ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? (
                  <span>
                    &gt; AUTHENTICATING<span className="cursor"></span>
                  </span>
                ) : (
                  <span className="relative z-10">&gt; GRANT_ACCESS</span>
                )}
                {!loading && (
                  <div className="absolute inset-0 box-glow-green opacity-0 group-hover:opacity-100 transition-opacity"></div>
                )}
              </button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-8 border-t border-matrix-green/30 pt-6">
              <div className="text-xs text-terminal-gray font-mono space-y-2">
                <div className="text-neon-cyan uppercase mb-3">
                  [DEMO_CREDENTIALS]
                </div>
                <div>
                  <span className="text-matrix-green">&gt;</span> USERNAME:{" "}
                  <span className="text-neon-cyan">admin</span> • PASSWORD:{" "}
                  <span className="text-neon-cyan">gaia2025</span>
                </div>
                <div>
                  <span className="text-matrix-green">&gt;</span> USERNAME:{" "}
                  <span className="text-neon-cyan">demo</span> • PASSWORD:{" "}
                  <span className="text-neon-cyan">demo</span>
                </div>
                <div>
                  <span className="text-matrix-green">&gt;</span> USERNAME:{" "}
                  <span className="text-neon-cyan">hacker</span> • PASSWORD:{" "}
                  <span className="text-neon-cyan">c4pher</span>
                </div>
              </div>
            </div>

            {/* Back to Home */}
            <div className="mt-6 text-center">
              <a
                href="/"
                className="text-xs text-terminal-gray hover:text-matrix-green transition-colors font-mono uppercase tracking-wider"
              >
                &lt; BACK_TO_HOME
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
