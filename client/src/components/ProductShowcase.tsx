import { motion } from "framer-motion";
import { Award, Leaf, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { OptimizedImage } from "@/components/OptimizedImage";

const products = [
  {
    name: "CUCA Original",
    description: "Nossa receita clássica, com sabor equilibrado e refrescante que conquistou Angola",
    alcohol: "5.0% álcool",
    image: "/cuca-beer.jpg",
  },
  {
    name: "CUCA Premium",
    description: "Edição especial com ingredientes selecionados para paladares exigentes",
    alcohol: "5.5% álcool",
    image: "/cuca-beer.jpg",
  },
  {
    name: "CUCA Light",
    description: "Versão leve com menos calorias, mantendo todo o sabor tradicional",
    alcohol: "3.5% álcool",
    image: "/cuca-beer.jpg",
  },
];

const features = [
  {
    icon: Award,
    title: "Qualidade Premium",
    description: "Ingredientes selecionados e processo de fabricação rigoroso",
  },
  {
    icon: Leaf,
    title: "100% Natural",
    description: "Sem conservantes artificiais, apenas ingredientes naturais",
  },
  {
    icon: Heart,
    title: "Tradição Angolana",
    description: "Receita tradicional passada através de gerações",
  },
];

export default function ProductShowcase() {
  return (
    <section id="products" className="py-12 sm:py-16 lg:py-20 bg-background dark:bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="font-montserrat font-bold text-3xl sm:text-4xl lg:text-5xl text-foreground mb-4 sm:mb-6">
            Nossos <span className="text-cuca-yellow">Produtos</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto px-4">
            Descubra a linha completa de cervejas CUCA, cada uma com seu sabor
            único e qualidade excepcional
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {products.map((product, index) => (
            <motion.div
              key={product.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="group"
            >
              <Card className="bg-card dark:bg-card rounded-2xl shadow-xl hover:shadow-2xl overflow-hidden transition-all duration-300 border-0 dark:border dark:border-gray-200">
                <motion.div
                  className="h-48 sm:h-56 lg:h-64 relative overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <OptimizedImage
                    src={product.image}
                    alt={`${product.name} - CUCA Cerveja`}
                    className="w-full h-full object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.div>
                <CardContent className="p-4 sm:p-6">
                  <h3 className="font-montserrat font-bold text-xl sm:text-2xl text-card-foreground mb-2 sm:mb-3">
                    {product.name}
                  </h3>
                  <p className="text-muted-foreground mb-4 text-sm sm:text-base leading-relaxed">{product.description}</p>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
                    <span className="text-cuca-yellow font-semibold text-sm sm:text-base">
                      {product.alcohol}
                    </span>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button className="bg-cuca-red text-white hover:bg-red-700 transition-all duration-300 w-full sm:w-auto text-sm sm:text-base">
                        Saiba Mais
                      </Button>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Additional Product Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="text-center group"
            >
              <motion.div 
                className="bg-cuca-yellow/20 dark:bg-cuca-yellow/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-cuca-yellow/30 dark:group-hover:bg-cuca-yellow/40 transition-colors duration-300"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <feature.icon className="text-cuca-yellow h-8 w-8" />
              </motion.div>
              <h4 className="font-montserrat font-semibold text-lg sm:text-xl text-foreground mb-2">
                {feature.title}
              </h4>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed px-2">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
