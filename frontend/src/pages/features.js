import React, { useState, useEffect } from "react";
import { LineChart, PieChart, Database, Bot, BarChart3, Users, Zap, Shield, Globe, Code, ChevronDown } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

const FadeIn = ({ children, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);
  
  return (
    <div className={`transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {children}
    </div>
  );
};

const FeatureCard = ({ icon, title, desc, index }) => {
  return (
    <div className="p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-100">
      <div className="w-14 h-14 mb-6 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600">
        {React.cloneElement(icon, { className: "h-6 w-6" })}
      </div>
      <h3 className="text-xl font-semibold mb-3 text-gray-900">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{desc}</p>
    </div>
  );
};

const Tabs = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className="flex flex-wrap border-b border-gray-200 mb-8">
      {tabs.map((tab, index) => (
        <button
          key={index}
          className={`py-4 px-6 text-lg font-medium border-b-2 transition-colors ${
            activeTab === index
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab(index)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

const FAQItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className="border-b border-gray-200 py-6">
      <button
        className="flex justify-between items-center w-full text-left font-medium text-lg text-gray-900"
        onClick={onClick}
      >
        <span>{question}</span>
        <ChevronDown className={`h-5 w-5 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div className={`mt-2 text-gray-600 overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
        <p className="pb-4">{answer}</p>
      </div>
    </div>
  );
};

const FeaturesPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [openFAQ, setOpenFAQ] = useState(null);

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
    {
      icon: <BarChart3 />,
      title: "Advanced Analytics",
      desc: "Perform complex statistical analysis with just a few clicks using our built-in tools.",
    },
    {
      icon: <Users />,
      title: "Team Collaboration",
      desc: "Share dashboards and reports with your team and collaborate in real-time.",
    },
    {
      icon: <Zap />,
      title: "Real-time Data",
      desc: "Connect to live data sources and visualize changes as they happen.",
    },
    {
      icon: <Shield />,
      title: "Enterprise Security",
      desc: "Bank-level security with encryption, access controls, and compliance certifications.",
    },
  ];

  const tabs = ["All Features", "Visualization", "Analytics", "Collaboration"];
  
  const faqs = [
    {
      question: "How do I import my data?",
      answer: "You can import data from CSV, Excel, JSON files, or connect directly to databases like MySQL, PostgreSQL, and MongoDB. We also offer API integration for real-time data streaming."
    },
    {
      question: "Can I collaborate with my team?",
      answer: "Yes, our platform supports real-time collaboration. You can share dashboards, leave comments, and set different permission levels for team members."
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely. We use end-to-end encryption, comply with major data protection regulations, and offer enterprise-grade security features including SSO and role-based access control."
    },
    {
      question: "What support options are available?",
      answer: "We offer 24/7 email support for all users, with priority support for enterprise customers. We also have extensive documentation, video tutorials, and a community forum."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Data Analyst, TechCorp",
      content: "This platform has transformed how we present data to stakeholders. The interactive features allow everyone to explore the data themselves."
    },
    {
      name: "Michael Chen",
      role: "Marketing Director, GrowthLab",
      content: "The AI insights have helped us identify trends we would have otherwise missed. It's like having a data scientist on the team."
    },
    {
      name: "Emily Rodriguez",
      role: "Product Manager, InnovateCo",
      content: "The collaboration features have made cross-department reporting so much easier. We're all working from the same accurate data now."
    }
  ];
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        jwtDecode(token);
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
    <div className="mt-12 min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <FadeIn delay={100}>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Powerful Data Visualization Tools</h1>
          </FadeIn>
          <FadeIn delay={300}>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-10">
              Transform raw data into meaningful insights with our comprehensive suite of visualization tools.
            </p>
          </FadeIn>
          <FadeIn delay={500}>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a href={isLoggedIn ? "/analyses" : "/login"}>
              <button className="px-6 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors">
                Get Started
              </button>
              </a>
              <button className="px-6 py-3 border border-white text-white font-medium rounded-lg hover:bg-white/10 transition-colors">
                Get Demo
              </button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8" id="features">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <FadeIn delay={100}>
              <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-600 mb-4">
                Features
              </span>
            </FadeIn>
            <FadeIn delay={200}>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Everything You Need for Data Visualization
              </h2>
            </FadeIn>
            <FadeIn delay={300}>
              <p className="max-w-2xl mx-auto text-lg text-gray-600">
                Our comprehensive toolset helps you transform complex data into clear, actionable insights.
              </p>
            </FadeIn>
          </div>

          <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => (
              <FadeIn key={i} delay={100 * (i % 4)}>
                <FeatureCard 
                  icon={feature.icon}
                  title={feature.title}
                  desc={feature.desc}
                  index={i}
                />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <FadeIn delay={100}>
              <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-600 mb-4">
                Use Cases
              </span>
            </FadeIn>
            <FadeIn delay={200}>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Solutions for Every Team
              </h2>
            </FadeIn>
            <FadeIn delay={300}>
              <p className="max-w-2xl mx-auto text-lg text-gray-600">
                Discover how our platform can help different teams achieve their goals.
              </p>
            </FadeIn>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FadeIn delay={100}>
              <div className="bg-white p-8 rounded-xl shadow-md">
                <div className="w-14 h-14 mb-6 flex items-center justify-center rounded-lg bg-green-100 text-green-600">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Business Intelligence</h3>
                <p className="text-gray-600 mb-4">
                  Create executive dashboards and track KPIs with real-time data updates and automated reporting.
                </p>
                <ul className="text-gray-600 space-y-2">
                  <li className="flex items-start">
                    <div className="h-5 w-5 text-green-500 mr-2">✓</div>
                    <span>Financial dashboards</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-5 w-5 text-green-500 mr-2">✓</div>
                    <span>Sales performance tracking</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-5 w-5 text-green-500 mr-2">✓</div>
                    <span>Operational metrics</span>
                  </li>
                </ul>
              </div>
            </FadeIn>

            <FadeIn delay={200}>
              <div className="bg-white p-8 rounded-xl shadow-md">
                <div className="w-14 h-14 mb-6 flex items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                  <Globe className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Marketing Analytics</h3>
                <p className="text-gray-600 mb-4">
                  Track campaign performance, customer journeys, and ROI across multiple channels.
                </p>
                <ul className="text-gray-600 space-y-2">
                  <li className="flex items-start">
                    <div className="h-5 w-5 text-green-500 mr-2">✓</div>
                    <span>Multi-channel attribution</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-5 w-5 text-green-500 mr-2">✓</div>
                    <span>Customer segmentation</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-5 w-5 text-green-500 mr-2">✓</div>
                    <span>Conversion funnel analysis</span>
                  </li>
                </ul>
              </div>
            </FadeIn>

            <FadeIn delay={300}>
              <div className="bg-white p-8 rounded-xl shadow-md">
                <div className="w-14 h-14 mb-6 flex items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                  <Code className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Product & Engineering</h3>
                <p className="text-gray-600 mb-4">
                  Monitor system performance, user behavior, and feature adoption with custom dashboards.
                </p>
                <ul className="text-gray-600 space-y-2">
                  <li className="flex items-start">
                    <div className="h-5 w-5 text-green-500 mr-2">✓</div>
                    <span>User engagement metrics</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-5 w-5 text-green-500 mr-2">✓</div>
                    <span>Error tracking & monitoring</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-5 w-5 text-green-500 mr-2">✓</div>
                    <span>Feature usage analysis</span>
                  </li>
                </ul>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <FadeIn delay={100}>
              <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-600 mb-4">
                Testimonials
              </span>
            </FadeIn>
            <FadeIn delay={200}>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                What Our Customers Say
              </h2>
            </FadeIn>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <FadeIn key={index} delay={100 * (index + 1)}>
                <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold mr-4">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                      <p className="text-gray-600 text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 italic">"{testimonial.content}"</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <FadeIn delay={100}>
              <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-600 mb-4">
                FAQ
              </span>
            </FadeIn>
            <FadeIn delay={200}>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
            </FadeIn>
            <FadeIn delay={300}>
              <p className="max-w-2xl mx-auto text-lg text-gray-600">
                Find answers to common questions about our data visualization platform.
              </p>
            </FadeIn>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openFAQ === index}
                onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-600">
        <div className="max-w-7xl mx-auto text-center">
          <FadeIn delay={100}>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Transform Your Data?</h2>
          </FadeIn>
          <FadeIn delay={300}>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-10">
              Join thousands of data-driven professionals who use our platform to create stunning visualizations and uncover hidden insights.
            </p>
          </FadeIn>
          <FadeIn delay={500}>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href={isLoggedIn ? "/analyses" : "/login"}>
              <button className="px-6 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors">
                Get Started
              </button>
              </a>
              <a href="/demo">
              <button className="px-6 py-3 border border-white text-white font-medium rounded-lg hover:bg-white/10 transition-colors">
                Get Demo
              </button>
              </a>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
    <Footer/>
    </>
  );
};

export default FeaturesPage;