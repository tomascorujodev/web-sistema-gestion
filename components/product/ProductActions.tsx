
"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface ProductActionsProps {
    product: {
        id: number;
        name: string;
        price: number;
        offerPrice?: number;
        isOnOffer?: boolean;
        imageUrl: string;
        inStock: boolean;
    };
    primaryColor: string;
}

export default function ProductActions({ product, primaryColor }: ProductActionsProps) {
    const { addToCart } = useCart();

    const displayPrice = product.isOnOffer && product.offerPrice ? product.offerPrice : product.price;

    const handleAddToCart = () => {
        addToCart({
            id: product.id,
            name: product.name,
            price: displayPrice,
            imageUrl: product.imageUrl
        });
    };

    return (
        <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="flex-1 bg-[var(--foreground)] text-[var(--background)] py-4 px-8 rounded-xl font-bold text-lg hover:bg-brand hover:text-white transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
        >
            <ShoppingCart className="w-6 h-6 group-hover:scale-110 transition-transform" />
            {product.inStock ? "Agregar al Carrito" : "Sin Stock"}
        </button>
    );
}
