"use client";

import { useRef } from "react";
import ProductCard from "./ProductCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Product } from "@/context/CartContext";

interface ProductCarouselProps {
    title: string;
    products: (Product & { category?: string; stock?: number; inStock?: boolean })[];
}

export default function ProductCarousel({ title, products }: ProductCarouselProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = 300;
            if (direction === "left") {
                current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
            } else {
                current.scrollBy({ left: scrollAmount, behavior: "smooth" });
            }
        }
    };

    if (products.length === 0) return null;

    return (
        <section className="py-12 border-b border-[var(--foreground)]/10">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-[var(--foreground)] uppercase tracking-widest border-l-4 border-brand pl-4">
                        {title}
                    </h2>
                    <div className="flex gap-2">
                        <button
                            onClick={() => scroll("left")}
                            className="p-2 border border-[var(--foreground)]/10 rounded-full hover:bg-brand hover:text-white hover:border-brand transition-colors text-[var(--foreground)]/50"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                            onClick={() => scroll("right")}
                            className="p-2 border border-[var(--foreground)]/10 rounded-full hover:bg-brand hover:text-white hover:border-brand transition-colors text-[var(--foreground)]/50"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                <div
                    ref={scrollRef}
                    className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {products.map(product => (
                        <div key={product.id} className="w-[280px] md:w-[320px] flex-none snap-start h-full">
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
