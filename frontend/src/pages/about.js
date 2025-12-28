import { motion } from 'framer-motion';
import { 
  BarChart2, Cpu, Database, Shield, Zap, Users, Globe, 
  Layers, Server, PieChart, Rocket, Lock,
  Sparkles
} from 'lucide-react';
import { useState , useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
const AboutPage = () => {
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8 } }
  };

  const slideUp = {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const features = [
    {
      icon: <BarChart2 className="w-8 h-8 text-blue-500" />,
      title: "Advanced Analytics",
      description: "Powerful statistical analysis and data modeling capabilities"
    },
    {
      icon: <Cpu className="w-8 h-8 text-purple-500" />,
      title: "AI-Powered Insights",
      description: "Machine learning algorithms uncover hidden patterns in your data"
    },
    {
      icon: <Database className="w-8 h-8 text-green-500" />,
      title: "Multi-Format Support",
      description: "Process CSV, Excel, JSON and more with ease"
    },
    {
      icon: <Shield className="w-8 h-8 text-red-500" />,
      title: "Enterprise Security",
      description: "Bank-grade encryption and secure data handling"
    }
  ];

  const teamMembers = [
    {
      name: "Dr. Sarah Chen",
      role: "Chief Data Scientist",
      bio: "PhD in Machine Learning with 12 years experience in predictive analytics",
      animationDelay: 0.1
    },
    {
      name: "James Rodriguez",
      role: "Lead Developer",
      bio: "Full-stack engineer specializing in data visualization and cloud architecture",
      animationDelay: 0.3
    },
    {
      name: "Priya Patel",
      role: "Product Manager",
      bio: "Data product specialist focused on user experience and workflow optimization",
      animationDelay: 0.5
    }
  ];
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
      // Check for valid JWT token
      const token = localStorage.getItem('token');
      if (token) {
        try {
          jwtDecode(token); // will throw if invalid
          setIsLoggedIn(true);
        } catch {
          setIsLoggedIn(false);
        }
      } else {
        setIsLoggedIn(false);
      }
    }, []);

  return (
    <>
    <Navbar/>
    <div className="mt-5 bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <motion.section 
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center"
      >
        <motion.div
          variants={slideUp}
          className="max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-600 mb-6">
            <Zap className="w-5 h-5 mr-2" />
            <span className="font-medium">About Our Platform</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Transforming Data Into <span className="text-blue-600">Actionable Intelligence</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
            Our advanced analytics platform empowers businesses to uncover valuable insights, 
            predict trends, and make data-driven decisions with confidence.
          </p>
          <div className="flex justify-center space-x-4">
            {<a href={isLoggedIn ? "/analyses" : "/login"}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium shadow-lg hover:bg-blue-700 transition-colors"
            >
              Get Started
            </motion.button>
            </a>}
            <a href="/contact">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-white text-gray-700 rounded-lg font-medium shadow hover:bg-gray-50 transition-colors"
            >
              Contact Sales
            </motion.button>
            </a>
          </div>
        </motion.div>
      </motion.section>

      {/* Divider */}
      <div className="relative py-12">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="px-4 bg-white text-gray-500 rounded-full border border-gray-200 shadow-sm"
          >
            <Sparkles></Sparkles>
          </motion.div>
        </div>
      </div>

      {/* Mission Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid md:grid-cols-2 gap-12 items-center"
        >
          <motion.div variants={slideUp}>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Our <span className="text-blue-600">Mission</span>
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              We believe that every organization, regardless of size or technical expertise, 
              should have access to powerful data analysis tools. Our mission is to democratize 
              advanced analytics through an intuitive, cloud-based platform.
            </p>
            <p className="text-lg text-gray-600 mb-8">
              Founded in 2018 by a team of data scientists and engineers, we've helped over 5,000 
              businesses transform their raw data into strategic assets.
            </p>
            <div className="flex flex-wrap gap-4">
              <motion.div
                whileHover={{ y: -5 }}
                className="flex items-center px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-100"
              >
                <Users className="w-5 h-5 text-blue-500 mr-2" />
                <span className="font-medium">5,000+ Customers</span>
              </motion.div>
              <motion.div
                whileHover={{ y: -5 }}
                className="flex items-center px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-100"
              >
                <Globe className="w-5 h-5 text-green-500 mr-2" />
                <span className="font-medium">15 Countries</span>
              </motion.div>
              <motion.div
                whileHover={{ y: -5 }}
                className="flex items-center px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-100"
              >
                <Layers className="w-5 h-5 text-purple-500 mr-2" />
                <span className="font-medium">1B+ Rows Analyzed</span>
              </motion.div>
            </div>
          </motion.div>
          <motion.div variants={slideUp}>
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="aspect-w-16 aspect-h-9 relative">
                <motion.img
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  src="/images/dashboard.png"
                  alt="Platform dashboard"
                  className="w-full h-auto object-contain rounded-lg shadow-md"
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Powerful Features for <span className="text-blue-600">Modern Analytics</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform combines cutting-edge technology with intuitive design
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={slideUp}
                whileHover={{ y: -10 }}
                className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all"
              >
                <div className="flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-6 mx-auto">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-center">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-20 bg-gray-50">
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Built on <span className="text-blue-600">Cutting-Edge</span> Technology
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform leverages the latest advancements in data science and cloud computing
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8"
          >
            <motion.div
              variants={slideUp}
              className="bg-white p-8 rounded-xl shadow-md border border-gray-100"
            >
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mr-4">
                  <Server className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Main Functionality</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Process large datasets, identify meaningful patterns, and generate comprehensive reports with just a few clicks.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">Analyse</span>
                <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">Visualize</span>
                <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">Get Insights</span>
              </div>
            </motion.div>

            <motion.div
              variants={slideUp}
              className="bg-white p-8 rounded-xl shadow-md border border-gray-100"
            >
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mr-4">
                  <PieChart className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Analytics Engine</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Advanced statistical models and machine learning algorithms
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">Python</span>
                <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">Numpy</span>
                <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">Pandas</span>
              </div>
            </motion.div>

            <motion.div
              variants={slideUp}
              className="bg-white p-8 rounded-xl shadow-md border border-gray-100"
            >
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mr-4">
                  <Lock className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">visualization</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Transform your data into compelling visual stories with our advanced visualization tools. 
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">Matplotlib</span>
                <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">Seaborn</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Meet Our <span className="text-blue-600">Leadership Team</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The brilliant minds behind our innovative platform
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8"
          >
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                variants={slideUp}
                initial="hidden"
                animate="visible"
                transition={{ delay: member.animationDelay }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2"></div>
                <div className="p-8">
                  <div className="w-24 h-24 rounded-full bg-blue-100 mx-auto mb-6 flex items-center justify-center">
                    <Users className="w-12 h-12 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 text-center mb-1">
                    {member.name}
                  </h3>
                  <p className="text-blue-600 text-center font-medium mb-4">
                    {member.role}
                  </p>
                  <p className="text-gray-600 text-center">
                    {member.bio}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center"
        >
          <div className="max-w-3xl mx-auto">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-6 py-3 bg-white text-blue-600 rounded-full font-medium shadow-lg mb-8"
            >
              <Rocket className="w-5 h-5 mr-2" />
              Ready to Transform Your Data?
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Start Your Data Journey Today
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of businesses already making smarter decisions with our platform
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a href={isLoggedIn ? "/analyses" : "/login"}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-white text-blue-600 rounded-lg font-medium shadow-lg hover:bg-gray-100 transition-colors"
              >
                Get Started
              </motion.button>
              </a>
              <a href="/demo">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg font-medium hover:bg-white hover:bg-opacity-10 transition-colors hover:text-black"
              >
                Get Demo
              </motion.button>
              </a>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
    <Footer/>
    </>
  );
};

export default AboutPage;