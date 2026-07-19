import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone, ArrowRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import logo from "@/assets/logo.png";

type NavLink = {
  name: string;
  to: string;
  section?: string; // anchor id on "/"
};

const navLinks: NavLink[] = [
  { name: "Home", to: "/", section: "top" },
  { name: "Calculator", to: "/", section: "calculator-section" },
  { name: "How It Works", to: "/", section: "how-it-works" },
  { name: "Our Clients", to: "/", section: "testimonials" },
  { name: "Blog", to: "/blog" },
  { name: "Classic View", to: "/v1" },
];

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("top");
  const location = useLocation();
  const onHome = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll-spy for section highlighting on home
  useEffect(() => {
    if (!onHome) return;
    const ids = navLinks.filter((l) => l.section && l.section !== "top").map((l) => l.section!);
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActiveSection(visible[0].target.id);
        else if (window.scrollY < 200) setActiveSection("top");
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5, 1] }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [onHome]);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, link: NavLink) => {
      setIsOpen(false);
      if (link.section && onHome) {
        e.preventDefault();
        if (link.section === "top") {
          window.scrollTo({ top: 0, behavior: "smooth" });
          setActiveSection("top");
        } else {
          document.getElementById(link.section)?.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    },
    [onHome]
  );

  const isActive = (link: NavLink) => {
    if (link.to !== "/") return location.pathname === link.to;
    if (!onHome) return false;
    return link.section === activeSection;
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "backdrop-blur-2xl bg-background/60 border-b border-border/60 shadow-lg"
            : "backdrop-blur-xl bg-background/30"
        }`}
      >
        {/* subtle liquid highlight */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-[72px]">
            <Link to="/" className="flex items-center gap-3 group shrink-0">
              <motion.div
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="flex items-center gap-3"
              >
                <div className="relative w-9 h-9 md:w-10 md:h-10 rounded-xl overflow-hidden ring-1 ring-border/60">
                  <img src={logo} alt="My Card Machine" className="w-full h-full object-contain" />
                </div>
                <span className="font-display text-base md:text-lg font-bold tracking-tight text-foreground">
                  My Card Machine
                </span>
              </motion.div>
            </Link>

            {/* Desktop links — glass pill */}
            <div className="hidden lg:flex items-center">
              <div className="relative flex items-center gap-1 rounded-full border border-border/60 bg-card/40 backdrop-blur-xl px-1.5 py-1.5 shadow-inner">
                {navLinks.map((link) => {
                  const active = isActive(link);
                  return (
                    <Link
                      key={link.name}
                      to={link.to}
                      onClick={(e) => handleClick(e, link)}
                      className={`relative px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        active ? "text-primary-foreground" : "text-foreground/70 hover:text-foreground"
                      }`}
                    >
                      {active && (
                        <motion.span
                          layoutId="nav-pill"
                          transition={{ type: "spring", stiffness: 380, damping: 32 }}
                          className="absolute inset-0 rounded-full bg-primary shadow-[0_0_24px_-6px_hsl(var(--primary)/0.6)]"
                        />
                      )}
                      <span className="relative z-10">{link.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* CTAs */}
            <div className="hidden md:flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-foreground/80 hover:text-foreground hover:bg-card/60"
                asChild
              >
                <a href="tel:+442012345678">
                  <Phone className="w-4 h-4 mr-2" />
                  Call
                </a>
              </Button>
              <Button
                size="sm"
                className="rounded-full bg-primary hover:bg-primary-hover text-primary-foreground font-semibold shadow-[0_0_24px_-6px_hsl(var(--primary)/0.6)]"
                asChild
              >
                <Link to="/" onClick={(e) => handleClick(e, { name: "cta", to: "/", section: "calculator-section" })}>
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Link>
              </Button>
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setIsOpen((v) => !v)}
              className="md:hidden p-2 rounded-xl border border-border/60 bg-card/40 backdrop-blur-xl hover:bg-card/70 transition-colors"
              aria-label="Toggle menu"
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 bg-background/70 backdrop-blur-md md:hidden"
            />
            <motion.div
              key="drawer"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-[68px] inset-x-3 z-50 rounded-3xl border border-border/60 bg-card/80 backdrop-blur-2xl shadow-2xl p-3 md:hidden"
            >
              <ul className="flex flex-col">
                {navLinks.map((link) => {
                  const active = isActive(link);
                  return (
                    <li key={link.name}>
                      <Link
                        to={link.to}
                        onClick={(e) => handleClick(e, link)}
                        className={`flex items-center justify-between px-4 py-3.5 rounded-2xl text-base font-medium transition-colors ${
                          active
                            ? "bg-primary text-primary-foreground"
                            : "text-foreground/80 hover:bg-secondary-hover hover:text-foreground"
                        }`}
                      >
                        {link.name}
                        <ArrowRight className="w-4 h-4 opacity-60" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <div className="grid grid-cols-2 gap-2 pt-3 mt-2 border-t border-border/60">
                <Button variant="outline" className="rounded-full" asChild>
                  <a href="tel:+442012345678">
                    <Phone className="w-4 h-4 mr-2" /> Call
                  </a>
                </Button>
                <Button
                  className="rounded-full bg-primary hover:bg-primary-hover text-primary-foreground"
                  asChild
                >
                  <Link
                    to="/"
                    onClick={(e) =>
                      handleClick(e, { name: "cta", to: "/", section: "calculator-section" })
                    }
                  >
                    Get Started
                  </Link>
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
