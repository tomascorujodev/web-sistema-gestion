"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import ProductCard from "@/components/ProductCard";
import { Search, Filter, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useSearchParams } from "next/navigation";

interface Product {
    id: number;
    sku: string;
    name: string;
    category: string;
    price: number;
    imageUrl?: string;
    inStock: boolean;
    isOffer?: boolean;
    originalPrice?: number;
}

interface ProductCatalogProps {
    products: Product[];
    categories: string[];
}

const ITEMS_PER_PAGE = 12;

function CatalogContent({ products, categories }: ProductCatalogProps) {
    const searchParams = useSearchParams();
    const initialSearch = searchParams.get("search") || "";

    const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
    const [searchQuery, setSearchQuery] = useState(initialSearch);
    const [currentPage, setCurrentPage] = useState(1);
    const [showOffersOnly, setShowOffersOnly] = useState(false);
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);

    // Sync state with URL if it changes externally
    useEffect(() => {
        const query = searchParams.get("search");
        if (query !== null) {
            setSearchQuery(query);
        }
    }, [searchParams]);

    // Filter and Sort
    const filteredProducts = useMemo(() => {
        return products
            .filter(product => {
                const matchesCategory = selectedCategory === "Todos" || product.category === selectedCategory;
                const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
                const matchesOffer = !showOffersOnly || product.isOffer;
                return matchesCategory && matchesSearch && matchesOffer;
            })
            .sort((a, b) => {
                // Primary sort by Category
                const catCompare = (a.category || "").localeCompare(b.category || "");
                if (catCompare !== 0) return catCompare;
                // Secondary sort by Name
                return a.name.localeCompare(b.name);
            });
    }, [products, selectedCategory, searchQuery, showOffersOnly]);

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategory, searchQuery, showOffersOnly]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            // Scroll to top of grid
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleCategoryClick = (category: string) => {
        setSelectedCategory(category);
        if (window.innerWidth < 1024) {
            setIsFiltersOpen(false);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            {/* Mobile Filter Trigger */}
            <div className="lg:hidden flex gap-2">
                <button
                    onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                    className="flex-1 flex items-center justify-between bg-neutral-900 border border-white/10 p-4 font-bold text-white uppercase tracking-wider transition-all duration-300 active:scale-[0.98]"
                >
                    <span className="flex items-center gap-2">
                        <Filter className={`h-4 w-4 transition-colors ${isFiltersOpen ? 'text-brand' : 'text-gray-400'}`} />
                        {isFiltersOpen ? 'Cerrar Filtros' : 'Filtrar por Categoría'}
                    </span>
                    <span className="text-[10px] bg-brand/20 text-brand px-2 py-0.5 rounded-full">
                        {selectedCategory === "Todos" ? categories.length : 1}
                    </span>
                </button>
                {selectedCategory !== "Todos" && (
                    <button
                        onClick={() => setSelectedCategory("Todos")}
                        className="bg-neutral-900 border border-white/10 p-4 text-brand"
                    >
                        <X className="h-5 w-5" />
                    </button>
                )}
            </div>

            {/* Sidebar Filters */}
            <aside className={`lg:w-64 flex-shrink-0 space-y-6 transition-all duration-500 overflow-hidden ${isFiltersOpen ? 'max-h-[1000px] opacity-100 mb-6' : 'max-h-0 lg:max-h-none opacity-0 lg:opacity-100 lg:mb-0 pointer-events-none lg:pointer-events-auto'}`}>
                <div className="bg-neutral-900 border border-white/10 p-6 shadow-2xl">
                    <h3 className="hidden lg:flex text-lg font-bold text-white mb-6 items-center gap-2 uppercase tracking-wider">
                        <Filter className="h-4 w-4 text-brand" />
                        Categorías
                    </h3>

                    <div className="space-y-1.5 max-h-[70vh] overflow-y-auto custom-scrollbar pr-2">
                        <button
                            onClick={() => {
                                setShowOffersOnly(!showOffersOnly);
                                if (window.innerWidth < 1024) setIsFiltersOpen(false);
                            }}
                            className={`w-full text-left px-4 py-3 text-sm uppercase tracking-widest transition-all duration-300 flex items-center justify-between group ${showOffersOnly
                                ? "bg-brand text-white font-black"
                                : "text-brand border border-brand/20 hover:bg-brand/5"
                                }`}
                        >
                            <span className="flex items-center gap-2">
                                % Ofertas Especiales
                            </span>
                            {showOffersOnly && <X className="h-4 w-4" />}
                        </button>

                        <div className="h-px bg-white/5 my-6" />

                        <button
                            onClick={() => handleCategoryClick("Todos")}
                            className={`w-full text-left px-4 py-3 text-sm uppercase tracking-widest transition-all duration-300 border-l-2 ${selectedCategory === "Todos"
                                ? "border-brand bg-brand/10 text-white font-bold pl-5"
                                : "border-transparent text-gray-500 hover:text-white hover:bg-white/5 hover:pl-5"
                                }`}
                        >
                            Todas las categorías
                        </button>

                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() => handleCategoryClick(category)}
                                className={`w-full text-left px-4 py-3 text-sm uppercase tracking-widest transition-all duration-300 border-l-2 ${selectedCategory === category
                                    ? "border-brand bg-brand/10 text-white font-bold pl-5"
                                    : "border-transparent text-gray-500 hover:text-white hover:bg-white/5 hover:pl-5"
                                    }`}
                            >
                                {category || "Otros"}
                            </button>
                        ))}
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
                {/* Search Bar (Local) */}
                <div className="mb-8 relative group">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-500 group-focus-within:text-brand transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar en el catálogo..."
                        className="w-full bg-neutral-900 border border-white/10 py-4 pl-12 pr-4 focus:outline-none focus:border-brand/50 text-white placeholder:text-gray-600 uppercase text-xs tracking-[0.2em] transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Results Info */}
                <div className="mb-6 flex items-center justify-between text-gray-500 text-[10px] uppercase tracking-[0.2em]">
                    <div className="flex items-center gap-4">
                        <span>Total: <span className="text-white font-bold">{filteredProducts.length}</span></span>
                        {selectedCategory !== "Todos" && (
                            <span className="flex items-center gap-1 bg-white/5 px-2 py-0.5 text-brand rounded">
                                {selectedCategory}
                            </span>
                        )}
                    </div>
                    {totalPages > 1 && (
                        <span>Pág. {currentPage} de {totalPages}</span>
                    )}
                </div>

                {/* Grid */}
                {paginatedProducts.length > 0 ? (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 mb-12">
                            {paginatedProducts.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-4 py-12 border-t border-white/5">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="p-3 bg-neutral-900 border border-white/10 text-white hover:bg-brand hover:border-brand disabled:opacity-30 disabled:hover:bg-neutral-900 disabled:hover:border-white/10 transition-all active:scale-95"
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </button>

                                <span className="text-white text-sm font-bold tracking-widest bg-neutral-900 px-6 py-3 border border-white/10 min-w-[100px] text-center">
                                    {currentPage} <span className="text-gray-600 mx-1">/</span> {totalPages}
                                </span>

                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="p-3 bg-neutral-900 border border-white/10 text-white hover:bg-brand hover:border-brand disabled:opacity-30 disabled:hover:bg-neutral-900 disabled:hover:border-white/10 transition-all active:scale-95"
                                >
                                    <ChevronRight className="h-5 w-5" />
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="py-32 text-center border border-dashed border-white/10 bg-white/[0.02]">
                        <Search className="h-12 w-12 text-gray-700 mx-auto mb-4" />
                        <p className="text-gray-400 uppercase tracking-widest text-sm">No se encontraron productos</p>
                        <button
                            onClick={() => { setSearchQuery(""); setSelectedCategory("Todos"); }}
                            className="mt-6 text-brand text-xs uppercase tracking-widest border-b border-brand pb-1 hover:text-white hover:border-white transition-all"
                        >
                            Limpiar filtros
                        </button>
                    </div>
                )}
            </div>

        </div>
    );
}

export default function ProductCatalog(props: ProductCatalogProps) {
    return (
        <Suspense fallback={<div className="text-white text-center py-20">Cargando catálogo...</div>}>
            <CatalogContent {...props} />
        </Suspense>
    );
}
