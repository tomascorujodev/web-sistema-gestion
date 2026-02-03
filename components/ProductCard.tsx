"use client";

import { ShoppingCart } from "lucide-react";
import { useCart, Product } from "@/context/CartContext";
import Link from "next/link";

interface ProductCardProps {
    product: Product & {
        category?: string;
        stock?: number;
        inStock?: boolean;
        isOffer?: boolean;
        offerPrice?: number | null;
        originalPrice?: number | null;
    };
}

export default function ProductCard({ product }: ProductCardProps) {
    const { addToCart } = useCart();

    // Calculate discount percentage if on offer
    const discountPercentage = product.isOffer && product.offerPrice && product.originalPrice
        ? Math.round(((product.originalPrice - product.offerPrice) / product.originalPrice) * 100)
        : null;

    // Determine the display price (offer price if on offer, otherwise regular price)
    const displayPrice = product.isOffer && product.offerPrice ? product.offerPrice : product.price;

    const handleAddToCart = () => {
        addToCart({
            id: product.id,
            name: product.name,
            price: displayPrice, // Use the actual price (offer or regular)
            imageUrl: product.imageUrl,
            category: product.category || 'General'
        });
    };

    return (
        <div className="group relative bg-[var(--foreground)]/5 border border-[var(--foreground)]/10 overflow-hidden hover:border-brand/50 transition-all duration-300 h-full flex flex-col">
            <Link href={`/products/${product.id}`} className="block relative bg-[var(--background)]/5 overflow-hidden" style={{ aspectRatio: "1/1" }}>
                {product.imageUrl ? (
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-[var(--foreground)]/50 text-4xl font-bold bg-[var(--foreground)]/10">
                        ?
                    </div>
                )}

                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-2">
                    {product.isOffer && discountPercentage && (
                        <span className="bg-brand text-white text-[10px] font-black px-3 py-1 uppercase tracking-tighter shadow-xl">
                            -{discountPercentage}% OFF
                        </span>
                    )}
                    {product.inStock ? (
                        <span className="bg-[var(--background)] text-[var(--foreground)] text-[10px] font-bold px-2 py-1 uppercase tracking-wider w-fit">
                            Stock
                        </span>
                    ) : (
                        <span className="bg-neutral-600 text-white text-[10px] font-black px-2 py-1 uppercase tracking-wider w-fit shadow-md">
                            SIN STOCK
                        </span>
                    )}
                </div>
            </Link>

            <div className="p-5 flex-1 flex flex-col">
                <p className="text-[var(--foreground)]/60 text-xs font-bold uppercase mb-1 tracking-wider">{product.category || 'General'}</p>
                <h3 className="text-lg font-bold text-[var(--foreground)] mb-2 line-clamp-2 leading-tight group-hover:text-brand transition-colors">{product.name}</h3>
                <div className="flex items-center justify-between mt-auto pt-4">
                    <div className="flex flex-col">
                        {product.isOffer && product.originalPrice && (
                            <span className="text-[var(--foreground)]/60 text-xs line-through block mb-0.5">${product.originalPrice.toFixed(2)}</span>
                        )}
                        <span className="text-xl font-bold text-[var(--foreground)]">${displayPrice.toFixed(2)}</span>
                    </div>
                    <button
                        onClick={handleAddToCart}
                        disabled={!product.inStock}
                        className="bg-[var(--foreground)] text-[var(--background)] p-3 hover:bg-brand hover:text-white transition-colors active:scale-95 border border-transparent hover:border-[var(--background)]/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[var(--foreground)] disabled:hover:text-[var(--background)]"
                        aria-label="Add to cart"
                    >
                        <ShoppingCart className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
