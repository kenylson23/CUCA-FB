import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    quote: "CUCA é mais que uma cerveja, é tradição. Cada gole me lembra das celebrações em família e dos momentos especiais da nossa cultura.",
    name: "João Santos",
    location: "Luanda, Angola",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
  },
  {
    quote: "A qualidade da CUCA é incomparável. É a cerveja que sempre escolho para compartilhar com amigos em qualquer ocasião especial.",
    name: "Maria Fernandes",
    location: "Benguela, Angola",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b618?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
  },
  {
    quote: "Como angolano vivendo no exterior, CUCA me conecta com casa. É um pedaço de Angola em cada garrafa.",
    name: "Carlos Domingos",
    location: "Lisboa, Portugal",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-cuca-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-montserrat font-bold text-4xl sm:text-5xl text-cuca-white mb-6">
            O Que Dizem <span className="text-cuca-yellow">Sobre Nós</span>
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Depoimentos de quem conhece e ama a verdadeira cerveja angolana
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="bg-white rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-300">
                <CardContent className="p-8">
                  <Quote className="text-cuca-yellow h-10 w-10 mb-4" />
                  <p className="text-gray-700 mb-6 italic">
                    {testimonial.quote}
                  </p>
                  <div className="flex items-center">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4 object-cover"
                    />
                    <div>
                      <div className="font-semibold text-cuca-black">
                        {testimonial.name}
                      </div>
                      <div className="text-gray-500 text-sm">
                        {testimonial.location}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
