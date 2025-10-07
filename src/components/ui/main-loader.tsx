import { motion } from "framer-motion";

const MainLoader = ({ className = "bg-[#04003A]" }) => {

  return (
    <div className="flex flex-col items-center justify-center gap-3 w-full" style={{ height: "calc(100vh - 1px)" }}>
      <div className="max-w-full">
        <h2 className="text-3xl text-[#04003A] font-bold">GPS Tracker</h2>
      </div>
      <div className="flex items-center gap-1">
        <motion.div
          className={`w-4 h-4 rounded-full ${className}`}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [1, 0.5, 1],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className={`w-4 h-4 rounded-full mx-2 ${className}`}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [1, 0.5, 1],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.2,
          }}
        />

        <motion.div
          className={`w-4 h-4 rounded-full ${className}`}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [1, 0.5, 1],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.4,
          }}
        />
      </div>
    </div>
  );
};

export default MainLoader;