import { motion } from 'framer-motion';
import { PiggyBank, Banknote } from 'lucide-react';
import { useMemo } from 'react';

interface PigSpec {
  left: string;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  rotate: number;
  drift: number;
}

export function FallingPigsBackground() {
  const pigs: PigSpec[] = useMemo(() => {
    const arr: PigSpec[] = [];
    const count = 10;
    for (let i = 0; i < count; i++) {
      const left = `${Math.floor(Math.random() * 92) + 4}%`;
      const size = Math.floor(Math.random() * 42) + 28; // 28-70px
      const duration = Math.random() * 5 + 6; // 5-9s
      const delay = Math.random() * 8; // 0-8s
      const opacity = Math.random() * 0.25 + 0.55; // 0.55–0.8
      const rotate = Math.random() * 40 - 20; // -20 to 20 deg
      const drift = Math.random() * 80 - 40; // -40 to 40 px
      arr.push({ left, size, duration, delay, opacity, rotate, drift });
    }
    return arr;
  }, []);

  const notes: PigSpec[] = useMemo(() => {
    const arr: PigSpec[] = [];
    const count = 16;
    for (let i = 0; i < count; i++) {
      const left = `${Math.floor(Math.random() * 92) + 4}%`;
      const size = Math.floor(Math.random() * 28) + 18; // 18-46px
      const duration = Math.random() * 8 + 8; // 8-16s
      const delay = Math.random() * 8;
      const opacity = Math.random() * 0.25 + 0.08; // 0.08-0.33
      const rotate = Math.random() * 80 - 40;
      const drift = Math.random() * 120 - 60;
      arr.push({ left, size, duration, delay, opacity, rotate, drift });
    }
    return arr;
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {pigs.map((p, idx) => (
        <motion.div
          key={`pig-${idx}`}
          className="absolute"
          style={{ left: p.left, top: '-80px', opacity: p.opacity }}
          initial={{ y: -120, x: 0, rotate: 0 }}
          animate={{ y: '150vh', x: [0, p.drift, 0], rotate: [0, p.rotate, -p.rotate, 0] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'linear' }}
        >
          <PiggyBank
            className="text-black"
            strokeWidth={2}
            width={p.size}
            height={p.size}
          />
        </motion.div>
      ))}
      {notes.map((n, idx) => (
        <motion.div
          key={`note-${idx}`}
          className="absolute"
          style={{ left: n.left, top: '-60px', opacity: n.opacity }}
          initial={{ y: -120, x: 0, rotate: 0 }}
          animate={{ y: '110vh', x: [0, n.drift, 0], rotate: [0, n.rotate, -n.rotate, 0] }}
          transition={{ duration: n.duration, delay: n.delay, repeat: Infinity, ease: 'linear' }}
        >
          <Banknote
            className="text-[#f9dc5c]"
            strokeWidth={2.5}
            width={n.size}
            height={n.size}
          />
        </motion.div>
      ))}
    </div>
  );
}


