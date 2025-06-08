import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

const socialLinks = [
  { icon: Facebook, href: "#" },
  { icon: Instagram, href: "#" },
  { icon: Twitter, href: "#" },
  { icon: Youtube, href: "#" },
];

const quickLinks = [
  { name: "Início", href: "#home" },
  { name: "Produtos", href: "#products" },
  { name: "Nossa História", href: "#heritage" },
  { name: "Contato", href: "#contact" },
];

const legalLinks = [
  { name: "Política de Privacidade", href: "#" },
  { name: "Termos de Uso", href: "#" },
  { name: "Consumo Responsável", href: "#" },
];

export default function Footer() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId.replace("#", ""));
    if (element) {
      const offsetTop = element.offsetTop - 60;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  };

  return (
    <footer className="bg-cuca-black text-cuca-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <img 
                src="/images/cuca-logo.png" 
                alt="CUCA Logo" 
                className="h-12 w-auto mr-3"
              />
              <div className="text-3xl font-montserrat font-bold text-cuca-yellow">
                CUCA
              </div>
            </div>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Em Angola, cerveja é CUCA. Há mais de 50 anos levando qualidade,
              tradição e o verdadeiro sabor angolano para sua mesa.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="text-gray-400 hover:text-cuca-yellow transition-colors"
                >
                  <social.icon className="h-6 w-6" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-montserrat font-semibold text-lg mb-4">
              Links Rápidos
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-gray-300 hover:text-cuca-yellow transition-colors text-left"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-montserrat font-semibold text-lg mb-4">
              Legal
            </h4>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-cuca-yellow transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-4 text-sm text-gray-400">
              <p>
                Beba com moderação.
                <br />
                Venda proibida para menores de 18 anos.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>
            &copy; 2025 Kenylson Lourenço. Todos os direitos reservados. | Em Angola, cerveja
            é CUCA.
          </p>
        </div>
      </div>
    </footer>
  );
}
