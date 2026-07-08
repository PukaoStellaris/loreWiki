// Positions are rolled once at module load so renders stay pure.
const PARTICLES = [...Array(15)].map(() => ({
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  animation: `float ${8 + Math.random() * 4}s ease-in-out infinite`,
  animationDelay: `${Math.random() * 5}s`,
}));

export default function FloatingParticles() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {PARTICLES.map((style, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-violet-400/30 rounded-full"
          style={style}
        />
      ))}
    </div>
  );
}
