import Link from "next/link";
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-neutral-900 border-t border-white/10 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold text-white tracking-wider">
                            PETSHOP<span className="text-brand">STORE</span>
                        </h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Dedicados a ofrecer los mejores productos para el cuidado y felicidad de tus mascotas. Calidad premium y atención personalizada.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-brand transition-colors">
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-brand transition-colors">
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-brand transition-colors">
                                <Twitter className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="text-white font-bold uppercase tracking-wider mb-6">Navegación</h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><Link href="/" className="hover:text-brand transition-colors">Inicio</Link></li>
                            <li><Link href="/products" className="hover:text-brand transition-colors">Catálogo Completo</Link></li>
                            <li><Link href="/products?category=Accesorios" className="hover:text-brand transition-colors">Accesorios</Link></li>
                            <li><Link href="/about" className="hover:text-brand transition-colors">Sobre Nosotros</Link></li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h4 className="text-white font-bold uppercase tracking-wider mb-6">Atención al Cliente</h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><Link href="#" className="hover:text-brand transition-colors">Envíos y Devoluciones</Link></li>
                            <li><Link href="#" className="hover:text-brand transition-colors">Preguntas Frecuentes</Link></li>
                            <li><Link href="#" className="hover:text-brand transition-colors">Términos y Condiciones</Link></li>
                            <li><Link href="#" className="hover:text-brand transition-colors">Política de Privacidad</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-white font-bold uppercase tracking-wider mb-6">Contacto</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-brand flex-shrink-0" />
                                <span>Tucumán 3279,<br />Mar del Plata, Argentina</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-brand flex-shrink-0" />
                                <span>Independencia 4169,<br />Mar del Plata, Argentina</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="h-5 w-5 text-brand flex-shrink-0" />
                                <span>+54 223 548 4801 - Tucumán</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="h-5 w-5 text-brand flex-shrink-0" />
                                <span>+54 223 345 5657 - Independencia</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-brand flex-shrink-0" />
                                <span>streetdogmdp@gmail.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center bg-transparent">
                    <p className="text-gray-500 text-sm mb-4 md:mb-0">
                        &copy; {new Date().getFullYear()} PetShop Store. Todos los derechos reservados.
                    </p>
                    <div className="flex space-x-6 text-sm text-gray-500">
                        {/* Payment methods icons could go here */}
                        <span>Visa</span>
                        <span>Mastercard</span>
                        <span>MercadoPago</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
