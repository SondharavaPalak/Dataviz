import React from "react";
import { LineChart, PieChart, Database, Bot } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const featureVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: "easeOut"
    }
  })
};

function FeatureCard({ icon, title, desc, index }) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={featureVariants}
      custom={index}
      className="p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-100"
    >
      <div className="w-14 h-14 mb-6 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600">
        {React.cloneElement(icon, { className: "h-6 w-6" })}
      </div>
      <h3 className="text-xl font-semibold mb-3 text-gray-900">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{desc}</p>
    </motion.div>
  );
}

function FeaturesSection() {
  const [sectionRef, sectionInView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const features = [
    {
      icon: <LineChart />,
      title: "Interactive Graphs",
      desc: "Create beautiful, interactive visualizations with our intuitive drag-and-drop interface. Export in multiple formats.",
    },
    {
      icon: <Database />,
      title: "Smart Data Parsing",
      desc: "Our AI-powered engine automatically cleans, structures, and prepares your raw data for analysis.",
    },
    {
      icon: <Bot />,
      title: "AI Insights",
      desc: "Get automated insights and predictive analytics powered by machine learning algorithms.",
    },
    {
      icon: <PieChart />,
      title: "Custom Visualizations",
      desc: "Fully customize every aspect of your charts with our advanced styling options and templates.",
    },
  ];

  return (
    <section 
      ref={sectionRef}
      className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white"
      id="features"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={sectionInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-600 mb-4">
            Features
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Powerful Tools for Data Visualization
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-600">
            Transform raw data into meaningful insights with our comprehensive suite of visualization tools.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, i) => (
            <FeatureCard 
              key={i}
              icon={feature.icon}
              title={feature.title}
              desc={feature.desc}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;