import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Twitter, Linkedin, Github, Mail } from "lucide-react";

const footerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

function Footer() {
  return (
    <motion.footer 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={footerVariants}
      className="bg-gray-900 text-gray-300 pt-24 pb-12"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <motion.div variants={itemVariants}>
            <Link to="/" className="flex items-center mb-6">
              <span className="text-white text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                DataViz
              </span>
            </Link>
            <p className="mb-6 text-gray-400 leading-relaxed">
              Transform your data into beautiful, actionable insights with our powerful visualization platform.
            </p>
            <div className="flex space-x-4">
              <motion.a 
                whileHover={{ y: -2 }}
                href="/404" 
                className="text-gray-400 hover:text-blue-400 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </motion.a>
              <motion.a 
                whileHover={{ y: -2 }}
                href="/404" 
                className="text-gray-400 hover:text-blue-500 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </motion.a>
              <motion.a 
                whileHover={{ y: -2 }}
                href="/404" 
                className="text-gray-400 hover:text-blue-500 transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </motion.a>
              <motion.a 
                whileHover={{ y: -2 }}
                href="/404" 
                className="text-gray-400 hover:text-blue-500 transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </motion.a>
            </div>
          </motion.div>
          
          {/* Product Links */}
          <motion.div variants={itemVariants}>
            <h4 className="text-white text-lg font-semibold mb-6 relative inline-block">
              Product
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-400 to-purple-600"></span>
            </h4>
            <ul className="space-y-3">
              {['Features', 'Pricing', 'Integrations', 'Changelog'].map((item) => (
                <motion.li key={item} whileHover={{ x: 5 }}>
                  <Link 
                    to={['Features'].includes(item) ? '/features' : '/404'}
                    className="text-gray-400 hover:text-white transition-colors flex items-center"
                  >
                    <span className="w-1 h-1 bg-blue-400 rounded-full mr-2"></span>
                    {item}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
          
          {/* Resources Links */}
          <motion.div variants={itemVariants}>
            <h4 className="text-white text-lg font-semibold mb-6 relative inline-block">
              Resources
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-400 to-purple-600"></span>
            </h4>
            <ul className="space-y-3">
              {['Documentation', 'Tutorials', 'Blog', 'Community'].map((item) => (
                <motion.li key={item} whileHover={{ x: 5 }}>
                  <Link 
                    to={'/404'}
                    className="text-gray-400 hover:text-white transition-colors flex items-center"
                  >
                    <span className="w-1 h-1 bg-blue-400 rounded-full mr-2"></span>
                    {item}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
          
          {/* Company Links */}
          <motion.div variants={itemVariants}>
            <h4 className="text-white text-lg font-semibold mb-6 relative inline-block">
              Company
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-400 to-purple-600"></span>
            </h4>
            <ul className="space-y-3">
              {['About', 'Careers', 'Contact', 'Privacy Policy'].map((item) => (
                <motion.li key={item} whileHover={{ x: 5 }}>
                  <Link 
                    to={['About', 'Contact'].includes(item) ? `/${item.toLowerCase().replace(' ', '-')}` : '/404'}
                    className="text-gray-400 hover:text-white transition-colors flex items-center"
                  >
                    <span className="w-1 h-1 bg-blue-400 rounded-full mr-2"></span>
                    {item}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
        
        {/* Bottom Bar */}
        <motion.div 
          variants={itemVariants}
          className="border-t border-gray-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center"
        >
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} DataViz. All rights reserved.
          </p>
          <div className="flex space-x-6">
            {['Terms', 'Privacy', 'Cookies'].map((item) => (
              <motion.div key={item} whileHover={{ y: -2 }}>
                <Link 
                  to={'/404'}
                  className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
                >
                  {item}
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
}

export default Footer;