// frontend/src/components/layout/Footer.tsx

import React from 'react';
import Container from '../common/Container';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <Container>
        <div className="py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Sol: Logo/Marka */}
            <div>
              <h3 className="text-xl font-bold mb-2">E-Commerce</h3>
              <p className="text-gray-400 text-sm">
                Güvenli alışverişin adresi
              </p>
            </div>

            {/* Orta: Hızlı Linkler */}
            <div>
              <h4 className="font-semibold mb-3">Hızlı Linkler</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="/products" className="text-gray-400 hover:text-white transition">
                    Ürünler
                  </a>
                </li>
                <li>
                  <a href="/about" className="text-gray-400 hover:text-white transition">
                    Hakkımızda
                  </a>
                </li>
                <li>
                  <a href="/contact" className="text-gray-400 hover:text-white transition">
                    İletişim
                  </a>
                </li>
              </ul>
            </div>

            {/* Sağ: İletişim */}
            <div>
              <h4 className="font-semibold mb-3">İletişim</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Email: info@ecommerce.com</li>
                <li>Tel: +90 555 123 45 67</li>
              </ul>
            </div>

          </div>

          {/* Alt: Copyright */}
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400">
            <p>&copy; {currentYear} E-Commerce. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;