import { motion } from 'framer-motion';

export default function Skeleton({ className = '', count = 1 }) {
  return Array.from({ length: count }).map((_, i) => (
    <motion.div
      key={i}
      className={`bg-gray-200 rounded-lg animate-pulse ${className}`}
      initial={{ opacity: 0.5 }}
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    />
  ));
}
