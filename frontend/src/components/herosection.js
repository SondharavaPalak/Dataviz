import { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import Navbar from "./navbar";
import { Link } from "react-router-dom";

function HeroSection() {
  const controls = useAnimation();
  const buttonControls = useAnimation();

  useEffect(() => {
    const sequence = async () => {
      await controls.start({
        opacity: 1,
        y: 0,
        transition: { duration: 1.2, ease: [0.6, -0.05, 0.01, 0.99] }
      });
      await buttonControls.start({
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: "easeOut" }
      });
    };
    sequence();
  }, [controls, buttonControls]);

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/30 to-blue-900/70"></div>
        <img 
          src="/images/home/home_day.jpg" 
          alt="Background" 
          className="w-full h-full object-cover object-center"
        />
      </div>

      <Navbar />
      
      <div className="relative z-10 flex flex-1 flex-col justify-center items-center px-6 sm:px-8 lg:px-10">
        <div className="max-w-4xl text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={controls}
            className="space-y-6"
          >
            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 1 }}
            >
              Transform Your Data Into <span className="text-blue-300">Actionable Insights</span>
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 1 }}
            >
              DataViz provides powerful visualization tools to help you understand complex datasets and make better business decisions.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={buttonControls}
            className="flex flex-col sm:flex-row justify-center gap-4 pt-4"
          >
            <Link
              to="/login"
              className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              Get Started 
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;