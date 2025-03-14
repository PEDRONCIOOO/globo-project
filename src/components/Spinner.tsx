import { motion } from 'framer-motion';
import { cn } from "@/utils/cn";

export function Spinner() {
  const bars = Array(12).fill(0);

  return (
    <div className="h-[24px] w-[24px]">
      <div className="relative left-1/2 top-1/2 h-[inherit] w-[inherit]">
        {bars.map((_, i) => (
          <motion.div
            key={`spinner-bar-${i}`}
            aria-label={`spinner-bar-${i + 1}`}
            className={cn(
              "absolute -left-[10%] -top-[3.9%] h-[10%] w-[24%] rounded-md bg-black dark:bg-cyan-500",
              `bar:nth-child(${i + 1})`,
            )}
            style={{
              transform: `rotate(${30 * i}deg) translate(146%)`,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              repeat: Infinity,
              duration: 0.3,
              delay: i * 0.1,
            }}
          />
        ))}
      </div>
    </div>
  );
}