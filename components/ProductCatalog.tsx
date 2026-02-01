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

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <aside className="lg:w-64 flex-shrink-0 space-y-6">
                <div className="bg-[var(--foreground)]/5 border border-[var(--foreground)]/10 p-5">
                    <h3 className="text-lg font-bold text-[var(--foreground)] mb-4 flex items-center gap-2 uppercase tracking-wider">
                        <Filter className="h-4 w-4 text-brand" />
                        Categorías
                    </h3>
                    <div className="space-y-2 max-h-[65vh] overflow-y-auto custom-scrollbar pr-2">
                        <button
                            onClick={() => setShowOffersOnly(!showOffersOnly)}
                            className={`w-full text-left px-3 py-2 text-sm uppercase tracking-wide transition-colors flex items-center justify-between ${showOffersOnly
                                ? "bg-brand text-white font-bold"
                                : "text-brand border border-brand/30 hover:bg-brand/10"
                                }`}
                        >
                            <span>Solo Ofertas %</span>
                            {showOffersOnly && <X className="h-3 w-3" />}
                        </button>
                        <div className="h-px bg-[var(--foreground)]/10 my-4" />
                        <button
                            onClick={() => setSelectedCategory("Todos")}
                            className={`w-full text-left px-3 py-2 text-sm uppercase tracking-wide transition-colors ${selectedCategory === "Todos"
                                ? "bg-brand text-white font-bold"
                                : "text-[var(--foreground)]/60 hover:text-[var(--foreground)] hover:bg-[var(--foreground)]/5"
                                }`}
                        >
                            Todos
                        </button>
                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`w-full text-left px-3 py-2 text-sm uppercase tracking-wide transition-colors ${selectedCategory === category
                                    ? "bg-brand text-white font-bold"
                                    : "text-[var(--foreground)]/60 hover:text-[var(--foreground)] hover:bg-[var(--foreground)]/5"
                                    }`}
                            >
                                {category || "Sin Categoría"}
                            </button>
                        ))}
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
                {/* Search Bar (Local) */}
                <div className="mb-6 bg-[var(--foreground)]/5 border border-[var(--foreground)]/10 p-4 flex items-center gap-3">
                    <Search className="h-5 w-5 text-[var(--foreground)]/50" />
                    <input
                        type="text"
                        placeholder="Buscar productos..."
                        className="bg-transparent border-none focus:outline-none text-[var(--foreground)] w-full placeholder:text-[var(--foreground)]/50 uppercase text-sm tracking-wider"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Results Info */}
                <div className="mb-4 flex items-center justify-between text-[var(--foreground)]/60 text-sm uppercase tracking-wider">
                    <span>Mostrando {filteredProducts.length} productos</span>
                    {totalPages > 1 && (
                        <span>Página {currentPage} de {totalPages}</span>
                    )}
                </div>

                {/* Grid */}
                {paginatedProducts.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {paginatedProducts.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-4 py-8 border-t border-[var(--foreground)]/10">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="p-2 border border-[var(--foreground)]/10 text-[var(--foreground)] hover:bg-brand hover:border-brand hover:text-white disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:border-[var(--foreground)]/10 disabled:hover:text-[var(--foreground)] transition-colors"
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </button>

                                <span className="text-[var(--foreground)] font-bold bg-[var(--foreground)]/5 px-4 py-2 border border-[var(--foreground)]/10">
                                    {currentPage} / {totalPages}
                                </span>

                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="p-2 border border-[var(--foreground)]/10 text-[var(--foreground)] hover:bg-brand hover:border-brand hover:text-white disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:border-[var(--foreground)]/10 disabled:hover:text-[var(--foreground)] transition-colors"
                                >
                                    <ChevronRight className="h-5 w-5" />
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="py-20 text-center border border-dashed border-[var(--foreground)]/10 bg-[var(--foreground)]/5">
                        <p className="text-[var(--foreground)]/60">No se encontraron productos para "{searchQuery}".</p>
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
