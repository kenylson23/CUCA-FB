import { motion } from "framer-motion";
import { MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CTASection() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.offsetTop - 60;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-20 bg-gradient-to-r from-cuca-yellow to-cuca-red">
      <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="font-montserrat font-bold text-4xl sm:text-5xl text-cuca-white mb-6"
        >
          Faça Parte da Nossa História
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-xl text-cuca-white/90 mb-8 leading-relaxed"
        >
          Junte-se a milhões de angolanos que escolhem CUCA. Descubra onde
          encontrar nossa cerveja ou entre em contato conosco para mais
          informações.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <motion.div
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0 15px 30px rgba(0, 0, 0, 0.15)"
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Button
              onClick={() => scrollToSection("contact")}
              className="bg-cuca-white text-cuca-red font-montserrat font-semibold px-8 py-4 text-lg hover:bg-gray-100 transition-colors duration-200 shadow-lg"
            >
              <MapPin className="mr-2 h-5 w-5" />
              Encontre CUCA Perto de Você
            </Button>
          </motion.div>
          <motion.div
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0 10px 25px rgba(255, 255, 255, 0.2)"
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Button
              onClick={() => scrollToSection("contact")}
              variant="outline"
              className="border-2 border-cuca-white text-cuca-white hover:bg-cuca-white hover:text-cuca-red font-montserrat font-semibold px-8 py-4 text-lg transition-colors duration-200"
            >
              <Phone className="mr-2 h-5 w-5" />
              Entre em Contato
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
