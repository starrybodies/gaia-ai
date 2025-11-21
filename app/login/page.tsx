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
        setError("Invalid credentials. Please try again.");
        setLoading(false);
      } else {
        // Success!
        router.push("/demo");
      }
    } catch (err) {
      setError("Authentication failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-cool flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="data-card p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-xl bg-gradient-earth flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl font-bold">G</span>
            </div>
            <h1 className="heading-secondary mb-2">
              Sign In to GAIA AI
            </h1>
            <p className="text-sm text-stone">
              Access environmental intelligence dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label className="block text-sm font-semibold text-charcoal mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-cream border border-border-strong rounded-lg outline-none text-charcoal placeholder:text-stone focus:border-sky-blue transition-all"
                placeholder="Enter your username"
                required
                autoFocus
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-charcoal mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-cream border border-border-strong rounded-lg outline-none text-charcoal placeholder:text-stone focus:border-sky-blue transition-all"
                placeholder="Enter your password"
                required
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-error/10 border border-error rounded-lg p-4">
                <p className="text-error text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full btn btn-primary py-3 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 pt-6 border-t border-border">
            <div className="text-xs font-semibold text-stone uppercase tracking-wide mb-3">
              Demo Credentials
            </div>
            <div className="space-y-2 text-sm">
              {[
                { username: "admin", password: "gaia2025", name: "Admin Account" },
                { username: "demo", password: "demo", name: "Demo User" },
                { username: "hacker", password: "c4pher", name: "Cypherpunk" },
              ].map((cred, i) => (
                <div
                  key={i}
                  className="bg-cream rounded-lg p-3 flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs text-stone">{cred.name}</div>
                    <div className="font-mono text-xs text-charcoal">
                      <span className="text-rust-orange">user:</span> {cred.username} •{" "}
                      <span className="text-sky-blue">pass:</span> {cred.password}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setUsername(cred.username);
                      setPassword(cred.password);
                    }}
                    className="text-xs text-sky-blue hover:text-sky-blue-dark font-semibold"
                  >
                    Use →
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <a
              href="/"
              className="text-sm text-stone hover:text-rust-orange transition-colors font-medium"
            >
              ← Back to Home
            </a>
          </div>
        </div>

        {/* Additional info */}
        <div className="mt-6 text-center text-xs text-stone">
          <p>
            This is an alpha release. By signing in, you agree to our{" "}
            <a href="#" className="text-rust-orange hover:underline">
              Terms of Service
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
