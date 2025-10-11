import { Home, Building2, Store, Search, MapPin, TrendingUp, Shield, Clock, Users, CheckCircle, ArrowRight, Star, Phone, Mail } from 'lucide-react';
import Link from 'next/link';

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-500 to-green-500 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItaDJWMzZoLTJ6bS00LTRWMTBoMnYyMGgtMnptLTIgMnYtMmgtMnYyaDJ6bTQgNHYtMmgtMnYyaDJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
                <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
                <span>La plataforma #1 en Bolivia</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Encuentra tu casa
                <span className="block text-green-300">soñada hoy</span>
              </h1>
              
              <p className="text-xl text-blue-100 leading-relaxed">
                Miles de propiedades en venta, alquiler y anticrético. Tu próximo hogar está a un clic de distancia.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link href="/ventas" className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                  Ver Propiedades
                </Link>
                <Link href="/publicar" className="bg-blue-700/50 backdrop-blur-sm text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700/70 transition-all border border-white/30">
                  Publicar Gratis
                </Link>
              </div>
              
              <div className="grid grid-cols-3 gap-6 pt-6">
                <div>
                  <div className="text-3xl font-bold">500+</div>
                  <div className="text-blue-200 text-sm">Propiedades</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">2000+</div>
                  <div className="text-blue-200 text-sm">Clientes Felices</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">50+</div>
                  <div className="text-blue-200 text-sm">Zonas</div>
                </div>
              </div>
            </div>
            
            <div className="relative hidden md:block">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-green-400 rounded-3xl transform rotate-3"></div>
              <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden transform -rotate-2 hover:rotate-0 transition-transform">
                <img 
                  src="https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&h=800&fit=crop" 
                  alt="Casa moderna" 
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                  <div className="text-white">
                    <p className="text-sm font-semibold">Destacado</p>
                    <p className="text-2xl font-bold">Casa en Zona Sur</p>
                    <p className="text-green-300 font-semibold">$250,000 USD</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Property Types Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Encuentra tu propiedad ideal</h2>
            <p className="text-xl text-gray-600">Casas, departamentos, lotes y locales comerciales</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="group bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all cursor-pointer transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-blue-500 transition-colors">
                <Home className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Casas</h3>
              <p className="text-gray-600 mb-4">Encuentra la casa perfecta para tu familia</p>
              <p className="text-blue-600 font-semibold">250+ disponibles</p>
            </div>
            
            <div className="group bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all cursor-pointer transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-green-500 transition-colors">
                <Building2 className="w-8 h-8 text-green-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Departamentos</h3>
              <p className="text-gray-600 mb-4">Vive en el centro con todas las comodidades</p>
              <p className="text-green-600 font-semibold">180+ disponibles</p>
            </div>
            
            <div className="group bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all cursor-pointer transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-purple-500 transition-colors">
                <Store className="w-8 h-8 text-purple-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Locales</h3>
              <p className="text-gray-600 mb-4">Espacios comerciales en zonas estratégicas</p>
              <p className="text-purple-600 font-semibold">50+ disponibles</p>
            </div>
            
            <div className="group bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all cursor-pointer transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-orange-500 transition-colors">
                <MapPin className="w-8 h-8 text-orange-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Lotes</h3>
              <p className="text-gray-600 mb-4">Terrenos para construir tu proyecto</p>
              <p className="text-orange-600 font-semibold">70+ disponibles</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">¿Por qué elegir TuCasa?</h2>
              <p className="text-xl text-gray-600 mb-8">La plataforma más confiable para encontrar tu próximo hogar</p>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Shield className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">100% Verificado</h3>
                    <p className="text-gray-600">Todas las propiedades son verificadas por nuestro equipo</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Respuesta Rápida</h3>
                    <p className="text-gray-600">Conecta con propietarios en tiempo real</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Asesoría Personalizada</h3>
                    <p className="text-gray-600">Nuestro equipo te acompaña en cada paso</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-orange-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Mejores Precios</h3>
                    <p className="text-gray-600">Encuentra las mejores ofertas del mercado</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <img 
                  src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=500&fit=crop" 
                  alt="Casa 1" 
                  className="w-full h-64 object-cover rounded-2xl shadow-lg"
                />
                <img 
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop" 
                  alt="Casa 2" 
                  className="w-full h-48 object-cover rounded-2xl shadow-lg"
                />
              </div>
              <div className="space-y-4 pt-8">
                <img 
                  src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop" 
                  alt="Casa 3" 
                  className="w-full h-48 object-cover rounded-2xl shadow-lg"
                />
                <img 
                  src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&h=500&fit=crop" 
                  alt="Casa 4" 
                  className="w-full h-64 object-cover rounded-2xl shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-green-500 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">¿Tienes una propiedad para vender o alquilar?</h2>
          <p className="text-xl mb-8 text-blue-100">Publica gratis y llega a miles de compradores potenciales</p>
          <Link href="/publicar" className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl inline-flex items-center gap-2">
            Publicar Ahora
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Lo que dicen nuestros clientes</h2>
            <p className="text-xl text-gray-600">Miles de personas ya encontraron su hogar ideal</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-md">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 mb-6">"Encontré mi departamento en solo 2 semanas. La plataforma es muy fácil de usar y el proceso fue súper rápido."</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold">MR</span>
                </div>
                <div>
                  <p className="font-bold text-gray-900">María Rodríguez</p>
                  <p className="text-sm text-gray-500">La Paz</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-md">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 mb-6">"Vendí mi casa en menos de un mes. Excelente servicio y atención personalizada en todo momento."</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold">JM</span>
                </div>
                <div>
                  <p className="font-bold text-gray-900">Juan Martínez</p>
                  <p className="text-sm text-gray-500">Santa Cruz</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-md">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 mb-6">"La mejor plataforma inmobiliaria que he usado. Todo verificado y seguro. 100% recomendado."</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-bold">AG</span>
                </div>
                <div>
                  <p className="font-bold text-gray-900">Ana González</p>
                  <p className="text-sm text-gray-500">Cochabamba</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Home className="w-8 h-8 text-blue-400" />
                <span className="text-2xl font-bold">TuCasa</span>
              </div>
              <p className="text-gray-400">La plataforma inmobiliaria líder en Bolivia</p>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Propiedades</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Casas</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Departamentos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Lotes</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Locales</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Empresa</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Sobre nosotros</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contacto</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Ayuda</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Contacto</h3>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>+591 123 4567</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>info@tucasa.com</span>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>La Paz, Bolivia</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 TuCasa. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}