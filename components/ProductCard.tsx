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
            imageUrl: product.imageUrl
        });
    };

    return (
        <div className="group relative bg-neutral-900 border border-white/5 overflow-hidden hover:border-brand/50 transition-all duration-300 h-full flex flex-col">
            <Link href={`/products/${product.id}`} className="block relative bg-white/5 overflow-hidden" style={{ aspectRatio: "1/1" }}>
                {product.imageUrl ? (
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-700 text-4xl font-bold bg-neutral-800">
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
                    {product.inStock && (
                        <span className="bg-white text-black text-[10px] font-bold px-2 py-1 uppercase tracking-wider w-fit">
                            Stock
                        </span>
                    )}
                </div>
            </Link>

            <div className="p-5 flex-1 flex flex-col">
                <p className="text-gray-500 text-xs font-bold uppercase mb-1 tracking-wider">{product.category || 'General'}</p>
                <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 leading-tight group-hover:text-brand transition-colors">{product.name}</h3>
                <div className="flex items-center justify-between mt-auto pt-4">
                    <div className="flex flex-col">
                        {product.isOffer && product.originalPrice && (
                            <span className="text-gray-500 text-xs line-through block mb-0.5">${product.originalPrice.toFixed(2)}</span>
                        )}
                        <span className="text-xl font-bold text-white">${displayPrice.toFixed(2)}</span>
                    </div>
                    <button
                        onClick={handleAddToCart}
                        className="bg-white text-black p-3 hover:bg-brand hover:text-white transition-colors active:scale-95 border border-transparent hover:border-white/20"
                        aria-label="Add to cart"
                    >
                        <ShoppingCart className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
