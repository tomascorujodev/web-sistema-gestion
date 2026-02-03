import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import ProductActions from "@/components/product/ProductActions";

// Fetch product data on the server
async function getProduct(id: string) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/store/products/${id}`, {
            cache: 'no-store' // Keep no-store for individual products to ensure stock accuracy? Or maybe minimal cache like 10s
        });

        if (!res.ok) return null;

        const data = await res.json();
        return {
            ...data,
            inStock: data.stock > 0
        };
    } catch (error) {
        console.error(error);
        return null;
    }
}

// Fetch site config (colors)
async function getConfig() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/site-config`, { next: { revalidate: 60 } });
        if (res.ok) return await res.json();
    } catch (error) {
        console.error(error);
    }
    return {};
}


export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const product = await getProduct(id);
    const config = await getConfig();

    if (!product) {
        return (
            <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-4">
                <h1 className="text-2xl font-bold mb-4">Producto no encontrado</h1>
                <Link href="/products" className="bg-white text-black px-6 py-2 rounded-full font-bold hover:bg-brand hover:text-white transition">
                    Volver al catálogo
                </Link>
            </div>
        );
    }

    const primaryColor = config.primaryColor || '#E11D48';

    // Logic for price display
    const discountPercentage = product.isOnOffer && product.offerPrice
        ? Math.round(((product.price - product.offerPrice) / product.price) * 100)
        : null;

    const displayPrice = product.isOnOffer && product.offerPrice ? product.offerPrice : product.price;

    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pt-24 pb-12 px-4 md:px-8">
            <div className="max-w-6xl mx-auto">
                <Link
                    href="/products"
                    className="inline-flex items-center text-[var(--foreground)]/60 hover:text-[var(--foreground)] mb-8 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Volver
                </Link>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Image Section */}
                    <div className="relative bg-[var(--foreground)]/5 rounded-2xl overflow-hidden border border-[var(--foreground)]/10" style={{ aspectRatio: "1/1" }}>
                        {product.imageUrl ? (
                            <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-[var(--foreground)]/5">
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
                                <span className="bg-[var(--background)] text-[var(--foreground)] text-xs font-bold px-3 py-1.5 uppercase tracking-wider w-fit">
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
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-[var(--foreground)]">
                            {product.name}
                        </h1>

                        <div className="mb-8 p-6 bg-[var(--foreground)]/5 rounded-xl border border-[var(--foreground)]/10 backdrop-blur-sm">
                            <div className="flex items-baseline gap-4 mb-2">
                                <span className="text-4xl font-black text-[var(--foreground)]">
                                    ${displayPrice.toFixed(2)}
                                </span>
                                {product.isOnOffer && (
                                    <span className="text-xl text-[var(--foreground)]/40 line-through decoration-2 decoration-brand/50">
                                        ${product.price.toFixed(2)}
                                    </span>
                                )}
                            </div>
                            <p className="text-[var(--foreground)]/60 text-sm">
                                {product.inStock ? "Disponible para entrega inmediata" : "Consultar disponibilidad"}
                            </p>
                        </div>

                        {/* Description */}
                        <div className="mb-10">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-[var(--foreground)]">
                                <div className="w-1 h-6 bg-brand rounded-full" style={{ backgroundColor: primaryColor }} />
                                Descripción
                            </h3>
                            <div className="text-[var(--foreground)]/80 leading-relaxed space-y-4 text-lg">
                                {product.description ? (
                                    product.description.split('\n').map((line: string, i: number) => (
                                        <p key={i}>{line}</p>
                                    ))
                                ) : (
                                    <p className="italic text-[var(--foreground)]/40">Sin descripción disponible.</p>
                                )}
                            </div>
                        </div>

                        {/* Actions Component (Client Side) */}
                        <div className="flex gap-4">
                            <ProductActions product={product} primaryColor={primaryColor} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
