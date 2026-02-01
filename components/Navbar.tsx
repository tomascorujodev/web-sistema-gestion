"use client";

import Link from "next/link";
import { ShoppingBag, Menu, X, Search } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { setIsCartOpen, cartCount } = useCart();
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            setIsOpen(false);
            router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <nav className="fixed w-full z-50 bg-black/90 backdrop-blur-md border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 gap-4">
                    <div className="flex items-center flex-shrink-0">
                        <Link href="/" className="flex items-center">
                            <img
                                src="/streetdog-logo-blanco.png"
                                alt="Street Dog Logo"
                                className="h-12 w-auto object-contain"
                            />
                        </Link>
                    </div>

                    {/* Desktop Search Bar */}
                    <div className="hidden md:flex flex-1 max-w-md mx-4">
                        <form onSubmit={handleSearch} className="w-full relative">
                            <input
                                type="text"
                                placeholder="BUSCAR..."
                                className="w-full bg-neutral-900 text-white border border-white/10 py-2 px-4 pl-10 focus:outline-none focus:border-brand transition-colors text-sm rounded-none uppercase tracking-wide placeholder:text-gray-600"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                        </form>
                    </div>

                    <div className="hidden md:block">
                        <div className="flex items-baseline space-x-6">
                            <Link href="/" className="text-gray-300 hover:text-brand px-3 py-2 text-sm font-medium transition-colors uppercase tracking-wide">
                                Inicio
                            </Link>
                            <Link href="/products" className="text-gray-300 hover:text-brand px-3 py-2 text-sm font-medium transition-colors uppercase tracking-wide">
                                Productos
                            </Link>

                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsOpen(true)}
                            className="md:hidden p-2 rounded-full text-gray-300 hover:text-white hover:bg-white/10 transition-all"
                        >
                            <Search className="h-5 w-5" />
                        </button>
                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="p-2 rounded-full text-gray-300 hover:text-white hover:bg-white/10 transition-all relative"
                        >
                            <ShoppingBag className="h-5 w-5" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 h-4 w-4 bg-brand text-white text-[10px] flex items-center justify-center rounded-full font-bold">
                                    {cartCount}
                                </span>
                            )}
                        </button>
                        <div className="-mr-2 flex md:hidden">
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
                            >
                                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden bg-black border-b border-white/10">
                    <div className="p-4 border-b border-white/10">
                        <form onSubmit={handleSearch} className="w-full relative">
                            <input
                                type="text"
                                placeholder="Buscar..."
                                className="w-full bg-neutral-900 text-white border border-white/10 rounded-lg py-2 px-4 pl-10 focus:outline-none focus:border-brand"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                        </form>
                    </div>
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link href="/" className="text-gray-300 hover:text-brand block px-3 py-2 rounded-md text-base font-medium">
                            INICIO
                        </Link>
                        <Link href="/products" className="text-gray-300 hover:text-brand block px-3 py-2 rounded-md text-base font-medium">
                            PRODUCTOS
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
