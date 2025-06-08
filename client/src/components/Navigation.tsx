import { useState, useEffect } from "react";
import { Menu, X, Moon, Sun, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [location] = useLocation();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    // Check for saved theme preference or default to 'light'
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.offsetTop - 60;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
    setIsOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-background shadow-lg dark:bg-background/95" 
          : "bg-background/95 backdrop-blur-md dark:bg-background/80"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <motion.div 
            className="flex-shrink-0 flex items-center"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <img 
              src="/images/cuca-logo.png" 
              alt="CUCA Logo" 
              className="h-10 w-auto mr-2"
            />
            <span className="text-2xl font-montserrat font-bold text-cuca-yellow">
              CUCA
            </span>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex items-baseline space-x-8">
              <Link href="/">
                <motion.span 
                  className="text-foreground hover:text-cuca-yellow transition-colors duration-300 font-medium cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Início
                </motion.span>
              </Link>
              <motion.button
                onClick={() => scrollToSection("products")}
                className="text-foreground hover:text-cuca-yellow transition-colors duration-300 font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Produtos
              </motion.button>
              <motion.button
                onClick={() => scrollToSection("heritage")}
                className="text-foreground hover:text-cuca-yellow transition-colors duration-300 font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Nossa História
              </motion.button>
              <Link href="/pontos-venda">
                <motion.span 
                  className="text-foreground hover:text-cuca-yellow transition-colors duration-300 font-medium cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Pontos de Venda
                </motion.span>
              </Link>
              <Link href="/galeria-fas">
                <motion.span 
                  className="text-foreground hover:text-cuca-yellow transition-colors duration-300 font-medium cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Galeria dos Fãs
                </motion.span>
              </Link>
              <motion.button
                onClick={() => scrollToSection("contact")}
                className="text-foreground hover:text-cuca-yellow transition-colors duration-300 font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Contato
              </motion.button>
            </div>

            {/* User Access */}
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                {user?.role !== "admin" && (
                  <Link href="/dashboard">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="outline"
                        className="bg-cuca-red text-white border-cuca-red hover:bg-cuca-red/90 hover:text-white flex items-center gap-2"
                      >
                        <User className="h-4 w-4" />
                        Minha Conta
                      </Button>
                    </motion.div>
                  </Link>
                )}
                {user?.role === "admin" && (
                  <Link href="/admin">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="outline"
                        className="bg-cuca-red text-white border-cuca-red hover:bg-cuca-red/90 hover:text-white flex items-center gap-2"
                      >
                        <Settings className="h-4 w-4" />
                        Admin
                      </Button>
                    </motion.div>
                  </Link>
                )}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={() => {
                      fetch('/api/auth/logout', { method: 'POST' })
                        .then(() => window.location.reload());
                    }}
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Sair
                  </Button>
                </motion.div>
              </div>
            ) : (
              <Link href="/login">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="outline"
                    className="bg-cuca-red text-white border-cuca-red hover:bg-cuca-red/90 hover:text-white"
                  >
                    Entrar
                  </Button>
                </motion.div>
              </Link>
            )}
            
            {/* Dark Mode Toggle */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleDarkMode}
                className="text-foreground hover:text-cuca-yellow"
              >
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            </motion.div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Dark Mode Toggle for Mobile */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleDarkMode}
                className="text-foreground hover:text-cuca-yellow"
              >
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(!isOpen)}
                className="text-foreground hover:text-cuca-yellow"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="md:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-2 pt-2 pb-3 space-y-1 bg-background border-t dark:border-gray-200">
              <Link href="/">
                <motion.span 
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-left px-3 py-2 text-foreground hover:text-cuca-yellow transition-colors cursor-pointer"
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Início
                </motion.span>
              </Link>
              <motion.button
                onClick={() => scrollToSection("products")}
                className="block w-full text-left px-3 py-2 text-foreground hover:text-cuca-yellow transition-colors"
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                Produtos
              </motion.button>
              <motion.button
                onClick={() => scrollToSection("heritage")}
                className="block w-full text-left px-3 py-2 text-foreground hover:text-cuca-yellow transition-colors"
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                Nossa História
              </motion.button>
              <Link href="/pontos-venda">
                <motion.span 
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-left px-3 py-2 text-foreground hover:text-cuca-yellow transition-colors cursor-pointer"
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Pontos de Venda
                </motion.span>
              </Link>
              <Link href="/galeria-fas">
                <motion.span 
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-left px-3 py-2 text-foreground hover:text-cuca-yellow transition-colors cursor-pointer"
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Galeria dos Fãs
                </motion.span>
              </Link>
              <motion.button
                onClick={() => scrollToSection("contact")}
                className="block w-full text-left px-3 py-2 text-foreground hover:text-cuca-yellow transition-colors"
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                Contato
              </motion.button>
              {/* User Access Mobile */}
              {isAuthenticated ? (
                <div className="space-y-2 mt-2">
                  {user?.role !== "admin" && (
                    <Link href="/dashboard">
                      <motion.span 
                        onClick={() => setIsOpen(false)}
                        className="block w-full text-left px-3 py-2 bg-cuca-red text-white rounded-md mx-2 text-center cursor-pointer hover:bg-cuca-red/90 transition-colors flex items-center justify-center gap-2"
                        whileHover={{ x: 5 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <User className="h-4 w-4" />
                        Minha Conta
                      </motion.span>
                    </Link>
                  )}
                  {user?.role === "admin" && (
                    <Link href="/admin">
                      <motion.span 
                        onClick={() => setIsOpen(false)}
                        className="block w-full text-left px-3 py-2 bg-cuca-red text-white rounded-md mx-2 text-center cursor-pointer hover:bg-cuca-red/90 transition-colors flex items-center justify-center gap-2"
                        whileHover={{ x: 5 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Settings className="h-4 w-4" />
                        Admin
                      </motion.span>
                    </Link>
                  )}
                  <motion.button 
                    onClick={() => {
                      setIsOpen(false);
                      fetch('/api/auth/logout', { method: 'POST' })
                        .then(() => window.location.reload());
                    }}
                    className="block w-full text-left px-3 py-2 border border-gray-300 text-gray-700 rounded-md mx-2 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Sair
                  </motion.button>
                </div>
              ) : (
                <Link href="/login">
                  <motion.span 
                    onClick={() => setIsOpen(false)}
                    className="block w-full text-left px-3 py-2 bg-cuca-red text-white rounded-md mx-2 mt-2 text-center cursor-pointer hover:bg-cuca-red/90 transition-colors"
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Entrar
                  </motion.span>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
