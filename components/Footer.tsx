import Link from "next/link";
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-neutral-900 border-t border-white/10 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                    {/* Brand */}
                    <div className="space-y-6">
                        <Link href="/" className="block w-48">
                            <img
                                src="/streetdog-logo-blanco.png"
                                alt="Street Dog Pet Shop"
                                className="w-full h-auto object-contain"
                            />
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
                            Dedicados a ofrecer los mejores productos para el cuidado y felicidad de tus mascotas. Calidad premium y atención personalizada.
                        </p>
                        <div className="flex space-x-4">
                            <a href="https://www.instagram.com/streetdogmdp/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-brand transition-colors">
                                <Instagram className="h-6 w-6" />
                            </a>
                        </div>
                    </div>

                    {/* Locations */}
                    <div>
                        <h4 className="text-white font-bold uppercase tracking-wider mb-6">Nuestras Sucursales</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-brand flex-shrink-0 mt-0.5" />
                                <div>
                                    <span className="block text-white font-medium mb-1">Sucursal Tucumán</span>
                                    <span>Tucumán 3279, Mar del Plata</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-brand flex-shrink-0 mt-0.5" />
                                <div>
                                    <span className="block text-white font-medium mb-1">Sucursal Independencia</span>
                                    <span>Independencia 4169, Mar del Plata</span>
                                </div>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-white font-bold uppercase tracking-wider mb-6">Contacto</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li className="flex items-center gap-3">
                                <Phone className="h-5 w-5 text-brand flex-shrink-0" />
                                <span>+54 9 223 545 4801 (Tucumán)</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="h-5 w-5 text-brand flex-shrink-0" />
                                <span>+54 223 345 5657 (Independencia)</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-brand flex-shrink-0" />
                                <span>streetdogmdp@gmail.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
                    <p className="text-gray-500 text-sm">
                        &copy; {new Date().getFullYear()} Street Dog Pet Shop. Todos los derechos reservados.
                    </p>
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                        <span>Desarrollado por</span>
                        <a
                            href="https://www.linkedin.com/in/tomas-corujo/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-brand hover:text-white transition-colors font-medium border-b border-transparent hover:border-white"
                        >
                            Tomás Corujo
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
