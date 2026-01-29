"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import { useCart, Product } from "@/context/CartContext";
import Link from "next/link";
import { useConfig } from "@/context/ConfigContext";

const API_URL = "http://localhost:5027/api";

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { addToCart } = useCart();
    const { config } = useConfig();
    const [product, setProduct] = useState<Product & { description?: string; category?: string; stock?: number; inStock?: boolean; isOnOffer?: boolean; offerPrice?: number } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!params.id) return;

        const fetchProduct = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/store/products/${params.id}`);
                if (!res.ok) {
                    if (res.status === 404) throw new Error("Producto no encontrado");
                    throw new Error("Error al cargar el producto");
                }
                const data = await res.json();

                // Calculate derived fields similarly to backend or store logic if needed
                // But data should be complete from API
                setProduct({
                    ...data,
                    inStock: data.stock > 0
                });
            } catch (err) {
                console.error(err);
                setError(err instanceof Error ? err.message : "Error desconocido");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [params.id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand"></div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-4">
                <h1 className="text-2xl font-bold mb-4">Error</h1>
                <p className="text-gray-400 mb-6">{error || "Producto no encontrado"}</p>
                <Link href="/" className="bg-white text-black px-6 py-2 rounded-full font-bold hover:bg-brand hover:text-white transition">
                    Volver al inicio
                </Link>
            </div>
        );
    }

    const primaryColor = config.primaryColor || '#E11D48'; // Default rose-600

    // Logic for price display
    const discountPercentage = product.isOnOffer && product.offerPrice
        ? Math.round(((product.price - product.offerPrice) / product.price) * 100)
        : null;

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
        <div className="min-h-screen bg-neutral-950 text-white pt-24 pb-12 px-4 md:px-8">
            <div className="max-w-6xl mx-auto">
                <button
                    onClick={() => router.back()}
                    className="flex items-center text-gray-400 hover:text-white mb-8 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Volver
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Image Section */}
                    <div className="relative bg-neutral-900 rounded-2xl overflow-hidden border border-white/5" style={{ aspectRatio: "1/1" }}>
                        {product.imageUrl ? (
                            <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-neutral-800">
                                <span className="text-6xl font-bold">?</span>
                            </div>
                        )}

                        {/* Badges */}
                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                            {product.isOnOffer && discountPercentage && (
                                <span
                                    className="text-white text-xs font-black px-4 py-1.5 uppercase tracking-tighter shadow-xl"
                                    style={{ backgroundColor: primaryColor }}
                                >
                                    -{discountPercentage}% OFF
                                </span>
                            )}
                            {product.inStock && (
                                <span className="bg-white text-black text-xs font-bold px-3 py-1.5 uppercase tracking-wider w-fit">
                                    Stock
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Info Section */}
                    <div className="flex flex-col justify-center">
                        <span className="text-brand font-bold uppercase tracking-widest mb-2" style={{ color: primaryColor }}>
                            {product.category || 'General'}
                        </span>
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                            {product.name}
                        </h1>

                        <div className="mb-8 p-6 bg-neutral-900/50 rounded-xl border border-white/5 backdrop-blur-sm">
                            <div className="flex items-baseline gap-4 mb-2">
                                <span className="text-4xl font-black text-white">
                                    ${displayPrice.toFixed(2)}
                                </span>
                                {product.isOnOffer && (
                                    <span className="text-xl text-gray-500 line-through decoration-2 decoration-brand/50">
                                        ${product.price.toFixed(2)}
                                    </span>
                                )}
                            </div>
                            <p className="text-gray-400 text-sm">
                                {product.inStock ? "Disponible para entrega inmediata" : "Consultar disponibilidad"}
                            </p>
                        </div>

                        {/* Description */}
                        <div className="mb-10">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <div className="w-1 h-6 bg-brand rounded-full" style={{ backgroundColor: primaryColor }} />
                                Descripción
                            </h3>
                            <div className="text-gray-300 leading-relaxed space-y-4 text-lg">
                                {product.description ? (
                                    product.description.split('\n').map((line, i) => (
                                        <p key={i}>{line}</p>
                                    ))
                                ) : (
                                    <p className="italic text-gray-500">Sin descripción disponible.</p>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4">
                            <button
                                onClick={handleAddToCart}
                                disabled={!product.inStock}
                                className="flex-1 bg-white text-black py-4 px-8 rounded-xl font-bold text-lg hover:bg-gray-200 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
                            >
                                <ShoppingCart className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                Agregar al Carrito
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
