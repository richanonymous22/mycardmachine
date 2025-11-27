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
    path: "/",
    hash: ""
  }, {
    name: "Calculator",
    path: "/#calculator",
    hash: "#calculator"
  }, {
    name: "How It Works",
    path: "/#how-it-works",
    hash: "#how-it-works"
  }, {
    name: "Testimonials",
    path: "/#testimonials",
    hash: "#testimonials"
  }, {
    name: "Blog",
    path: "/blog",
    hash: ""
  }];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    if (hash && location.pathname === "/") {
      e.preventDefault();
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };
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
              <div className="relative w-10 h-10 md:w-12 md:h-12">
                <img src={logo} alt="My Card Machine" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="text-base text-foreground leading-tight text-left md:text-lg font-bold font-sans">
                  My Card Machine
                </span>
                
              </div>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => <Link 
                key={link.path} 
                to={link.path} 
                onClick={(e) => handleNavClick(e, link.hash)}
                className={`relative text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === link.path || (link.hash && location.hash === link.hash) 
                    ? "text-primary" 
                    : "text-foreground/70"
                }`}
              >
                {link.name}
                {(location.pathname === link.path || (link.hash && location.hash === link.hash)) && (
                  <motion.div 
                    layoutId="navbar-indicator" 
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary" 
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 30
                    }} 
                  />
                )}
              </Link>)}
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
            {navLinks.map(link => <Link 
                key={link.path} 
                to={link.path} 
                onClick={(e) => {
                  handleNavClick(e, link.hash);
                  setIsOpen(false);
                }} 
                className={`block py-2 text-sm font-medium transition-colors ${
                  location.pathname === link.path || (link.hash && location.hash === link.hash)
                    ? "text-primary" 
                    : "text-foreground/70 hover:text-primary"
                }`}
              >
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