import { useNavigate } from "react-router-dom";
import { WordRotate } from "../components/WordFlip";
import Header from "../components/Header";
import Underline from "../components/Underline";
import Footer from "../components/Footer";
import { motion } from "framer-motion";

const Homepage = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col dark:text-neutral-100 text-neutral-800 relative overflow-hidden">
      {/* Background gradient circles */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full bg-purple-500/20 blur-[120px] dark:bg-purple-600/10"
          animate={{
            x: [0, 100, -100, 0],
            y: [0, -100, 100, 0],
            scale: [1, 1.2, 0.8, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            top: "20%",
            left: "30%",
          }}
        />
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full bg-blue-500/20 blur-[100px] dark:bg-blue-600/10"
          animate={{
            x: [0, -100, 100, 0],
            y: [0, 100, -100, 0],
            scale: [1.2, 0.8, 1.1, 1.2],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            top: "40%",
            right: "25%",
          }}
        />
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full bg-indigo-500/20 blur-[80px] dark:bg-indigo-600/10"
          animate={{
            x: [0, 50, -50, 0],
            y: [0, -50, 50, 0],
            scale: [0.8, 1.1, 0.9, 0.8],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            bottom: "20%",
            left: "40%",
          }}
        />
      </div>

      <Header />
      <main className="flex flex-1 justify-center items-center flex-col bg-gradient-to-t from-violet-200 dark:from-neutral-950 dark:to-neutral-900 py-28 relative z-10">
        <div className="relative z-10 text-center px-4">
          {/* Add blur circles behind text */}
          <div className="absolute inset-0 z-[-1] overflow-visible">
            {/* Top left blur circle */}
            <motion.div
              className="absolute w-[300px] h-[300px] rounded-full bg-purple-500/30 blur-[80px] dark:bg-purple-600/20"
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                top: "-50%",
                left: "0%",
              }}
            />
            {/* Bottom right blur circle */}
            <motion.div
              className="absolute w-[300px] h-[300px] rounded-full bg-indigo-500/30 blur-[80px] dark:bg-indigo-600/20"
              animate={{
                scale: [1.1, 1, 1.1],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                bottom: "-50%",
                right: "0%",
              }}
            />
            {/* Center blur circle */}
            <motion.div
              className="absolute w-[350px] h-[350px] rounded-full bg-blue-500/25 blur-[80px] dark:bg-blue-600/15"
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />
          </div>

            <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-extrabold text-3xl sm:text-4xl lg:text-5xl xl:text-6xl flex flex-col sm:flex-row sm:gap-4 justify-center items-center text-indigo-900 dark:text-indigo-400"
            >
            <h1 className="font-cal">Experience</h1>
            <WordRotate words={["Secure", "Private", "Instant"]} />
            <h1 className="font-clash-display">Chats</h1>
            </motion.div>
            <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mt-3 px-8 sm:text-xl xl:text-2xl max-w-2x mx-auto font-semibold text-center font-clash-display"
            >
            Chat without a footprint. Anonymous chat rooms for secure, temporary
            conversations.
            </motion.h3>
            <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mt-4 text-center font-medium font-clash-display text-lg sm:text-xl xl:text-2xl text-indigo-900 dark:text-indigo-400"
            >
            <div className="inline-block">
              No data saved, ever.
              <Underline />
            </div>
            </motion.div>
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="flex flex-col gap-2 mt-10 xl:mt-12 justify-center items-center font-semibold text-white"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                navigate("/chat");
              }}
              className="block bg-indigo-700 py-2 w-48 sm:w-96 text-center rounded-md hover:bg-indigo-600 cursor-pointer font-sans"
            >
              Create a room
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="block bg-green-500 py-2 w-48 sm:w-96 text-center rounded-md hover:bg-green-400 cursor-pointer font-sans"
              onClick={() => {
                navigate("/join");
              }}
            >
              Join a room
            </motion.button>
          </motion.section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Homepage;
