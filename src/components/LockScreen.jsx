import { useState } from "react";
import { Lock, Key, Shield } from "lucide-react";
import FloatingParticles from "./FloatingParticles.jsx";
import { ACCESS_PASSWORD } from "../lib/authConfig.js";

export default function LockScreen({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === ACCESS_PASSWORD) {
      onLogin();
    } else {
      setError(true);
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20viewBox%3D%220%200%20200%20200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cfilter%20id%3D%22noise%22%3E%3CfeTurbulence%20type%3D%22fractalNoise%22%20baseFrequency%3D%220.65%22%20numOctaves%3D%223%22%20stitchTiles%3D%22stitch%22%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20filter%3D%22url(%23noise)%22%20opacity%3D%220.03%22%2F%3E%3C%2Fsvg%3E')] pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-stone-900/50 to-stone-950 pointer-events-none" />
      <FloatingParticles />

      {/* Login Box */}
      <div className="relative z-10 w-full max-w-md">
        <div className="absolute -top-3 -left-3 w-12 h-12 border-t-2 border-l-2 border-violet-500/60 rounded-tl-xl" />
        <div className="absolute -top-3 -right-3 w-12 h-12 border-t-2 border-r-2 border-violet-500/60 rounded-tr-xl" />
        <div className="absolute -bottom-3 -left-3 w-12 h-12 border-b-2 border-l-2 border-violet-500/60 rounded-bl-xl" />
        <div className="absolute -bottom-3 -right-3 w-12 h-12 border-b-2 border-r-2 border-violet-500/60 rounded-br-xl" />

        <div className="bg-stone-900/90 backdrop-blur-xl border border-violet-700/30 p-8 rounded-2xl shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-violet-700/30 to-violet-900/30 rounded-full flex items-center justify-center mx-auto mb-4 border border-violet-500/30">
              <Lock className="w-8 h-8 text-violet-400" />
            </div>
            <h1 className="text-3xl font-bold text-purple-100 mb-2 font-cinzel tracking-wider">Restricted Access</h1>
            <p className="text-purple-500/60 text-sm uppercase tracking-widest">Aegis Archives</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-violet-600/50" />
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                placeholder="Enter access code..."
                className={`w-full pl-12 pr-4 py-4 bg-stone-950/50 border rounded-xl focus:outline-none focus:ring-2 transition-all text-stone-200 placeholder-stone-600
                  ${error ? 'border-red-500/50 focus:ring-red-500/30' : 'border-violet-700/30 focus:ring-violet-500/30 border-violet-500/20'}
                `}
                autoFocus
              />
            </div>

            {error && (
              <div className="text-red-400 text-sm text-center bg-red-900/10 py-2 rounded-lg border border-red-900/20 animate-pulse">
                Access Denied: Unknown Code
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2 bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-600 hover:to-purple-700 text-violet-50 font-bold rounded-xl shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] border border-violet-500/30 flex items-center justify-center gap-2"
            >
              <Shield className="w-5 h-5" />
              <span>Enter Archives</span>
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-violet-800/50 text-center">
            <p className="text-stone-500 text-[14px]">
              <span className="text-violet-500/70 italic">"Only those who know the duration of the Void may enter the Spire."</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
