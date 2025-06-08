import { motion } from "framer-motion";
import { OptimizedImage } from "@/components/OptimizedImage";

export default function HeritageSection() {
  return (
    <section
      id="heritage"
      className="py-20 bg-gradient-to-br from-cuca-yellow/10 to-cuca-red/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="font-montserrat font-bold text-4xl sm:text-5xl text-cuca-black mb-8">
              Nossa <span className="text-cuca-red">História</span>
            </h2>
            <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
              <p>
                Há mais de cinco décadas, a CUCA se estabeleceu como símbolo da
                cultura angolana. Nascida do orgulho nacional e da paixão pela
                excelência, nossa cerveja representa mais que uma bebida - é
                parte da identidade de Angola.
              </p>
              <p>
                Com raízes profundas na tradição cervejeira, combinamos técnicas
                ancestrais com tecnologia moderna para criar o sabor único que
                conquistou gerações de angolanos.
              </p>
              <p>
                <strong className="text-cuca-red">
                  "Em Angola, cerveja é CUCA"
                </strong>{" "}
                não é apenas nosso slogan - é uma verdade que ecoa em cada
                celebração, em cada momento de confraternização, em cada gole de
                nossa cerveja especial.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-3xl font-montserrat font-bold text-cuca-red mb-2">
                  50+
                </div>
                <div className="text-gray-600">Anos de Tradição</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-montserrat font-bold text-cuca-red mb-2">
                  #1
                </div>
                <div className="text-gray-600">Cerveja de Angola</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-300">
              <OptimizedImage
                src="/cuca-brinde-2025.jpg"
                alt="Brinde ao Novo Ano com CUCA - O sabor da união"
                className="w-full h-auto"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority={true}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl overflow-hidden shadow-lg">
                <OptimizedImage
                  src="/cuca-beer.jpg"
                  alt="Cerveja CUCA Original - O sabor da união"
                  className="w-full h-auto object-cover"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              </div>
              <div className="rounded-xl overflow-hidden shadow-lg">
                <OptimizedImage
                  src="/cuca-brinde-2025.jpg"
                  alt="Momentos especiais com CUCA"
                  className="w-full h-auto object-cover"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
