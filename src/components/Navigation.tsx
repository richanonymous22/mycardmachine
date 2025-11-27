import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import logo from "@/assets/logo.png";
export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const navLinks = [{
    name: "Home",
    path: "/"
  }, {
    name: "Compare",
    path: "/#calculator"
  }, {
    name: "How it Works",
    path: "/#how-it-works"
  }];
  return <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-card/80 backdrop-blur-xl border-b border-border shadow-lg" : "bg-card/60 backdrop-blur-md"}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div whileHover={{
            scale: 1.05
          }} whileTap={{
            scale: 0.95
          }} className="flex items-center gap-3">
              <div className="relative w-12 h-12 md:w-14 md:h-14">
                <img src={logo} alt="My Card Machine" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg text-foreground leading-tight text-left md:text-xl font-bold font-sans">
                  My Card Machine
                </span>
                
              </div>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => {
                const element = document.getElementById('calculator-section');
                element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="relative text-sm font-medium text-foreground/70 transition-colors hover:text-primary"
            >
              Calculator
            </button>
            <button 
              onClick={() => {
                const element = document.getElementById('how-it-works');
                element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="relative text-sm font-medium text-foreground/70 transition-colors hover:text-primary"
            >
              How It Works
            </button>
            <button 
              onClick={() => {
                const testimonials = document.querySelector('[class*="animate-testimonial-scroll"]');
                testimonials?.parentElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }}
              className="relative text-sm font-medium text-foreground/70 transition-colors hover:text-primary"
            >
              Testimonials
            </button>
            <Link 
              to="/v1"
              className="relative text-sm font-medium text-foreground/70 transition-colors hover:text-primary"
            >
              Classic View
            </Link>
          </div>

          {/* CTA Buttons - Desktop */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="sm" className="text-foreground/70 hover:text-foreground hover:bg-primary/10" asChild>
              <a href="tel:+442012345678">
                <Phone className="w-4 h-4 mr-2" />
                Call Us
              </a>
            </Button>
            <Button size="sm" className="bg-gradient-to-r from-primary to-primary-hover shadow-glow hover:shadow-xl transition-all" asChild>
              <a href="#calculator">
                Get Started
              </a>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 rounded-lg hover:bg-primary/10 transition-colors" aria-label="Toggle menu">
            {isOpen ? <X className="w-6 h-6 text-foreground" /> : <Menu className="w-6 h-6 text-foreground" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <motion.div initial={false} animate={{
        height: isOpen ? "auto" : 0
      }} className="overflow-hidden md:hidden">
          <div className="py-4 space-y-3 border-t border-border/50">
            {navLinks.map(link => <Link key={link.path} to={link.path} onClick={() => setIsOpen(false)} className={`block py-2 text-sm font-medium transition-colors ${location.pathname === link.path ? "text-primary" : "text-foreground/70 hover:text-primary"}`}>
                {link.name}
              </Link>)}
            <div className="pt-3 space-y-2 border-t border-border/50">
              <Button variant="outline" size="sm" className="w-full" asChild>
                <a href="tel:+442012345678">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Us
                </a>
              </Button>
              <Button size="sm" className="w-full bg-gradient-to-r from-primary to-primary-hover" asChild>
                <a href="#calculator">
                  Get Started
                </a>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </nav>;
};