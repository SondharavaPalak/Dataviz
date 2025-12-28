import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import AboutPage from "./pages/about";
import Contact from "./pages/contact";
import Signup from "./pages/signup";
import Login from "./pages/login";
import DataAnalysisApp from "./pages/analyze";
import Demo from "./pages/demo";
import FeaturesPage from "./pages/features";
import NotFound from "./pages/404";
function App() {
  return (
    <Router>
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/analyses" element={<DataAnalysisApp/>}/>
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/demo" element={<Demo />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="/features" element={<FeaturesPage/>}/>
      </Routes>
    </Router>
  );
}

export default App;
