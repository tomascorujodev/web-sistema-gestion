"use client";

import { useCart, CartItem } from "@/context/CartContext";
import { X, Trash2, ShoppingBag, Minus, Plus, Truck, Store, Tag, ArrowRight } from "lucide-react";
import { useState, useMemo } from "react";
import Link from "next/link";

export default function CartSidebar() {
    const {
        items,
        removeFromCart,
        updateQuantity,
        cartTotal,
        isCartOpen,
        setIsCartOpen,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        discountAmount,
        finalTotal
    } = useCart();



    // Coupon State (local UI state)
    const [couponCode, setCouponCode] = useState("");
    const [couponLoading, setCouponLoading] = useState(false);
    const [couponMessage, setCouponMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    if (!isCartOpen) return null;

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) return;
        setCouponLoading(true);
        setCouponMessage(null);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/store/coupons/validate/${couponCode}`);
            if (response.ok) {
                const data = await response.json();
                const success = applyCoupon({
                    code: data.code,
                    discountPercentage: data.discountPercentage,
                    category: data.category
                });
                if (success) {
                    setCouponMessage({ type: 'success', text: `¡Cupón ${data.code} aplicado!` });
                } else {
                    setCouponMessage({ type: 'error', text: `Este cupón solo es válido para productos de la categoría: ${data.category}` });
                }
            } else {
                setCouponMessage({ type: 'error', text: 'Cupón inválido o expirado.' });
            }
        } catch (error) {
            console.error("Coupon validation error", error);
            setCouponMessage({ type: 'error', text: 'Error al validar cupón.' });
        } finally {
            setCouponLoading(false);
        }
    };

    const handleRemoveCoupon = () => {
        removeCoupon();
        setCouponCode("");
        setCouponMessage(null);
    };

    return (
        <div className="fixed inset-0 z-[60]">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={() => setIsCartOpen(false)}
            />

            {/* Drawer */}
            <div className="absolute right-0 top-0 h-full w-full max-w-md bg-[var(--background)] border-l border-[var(--foreground)]/10 shadow-2xl flex flex-col">
                <div className="flex items-center justify-between p-6 border-b border-[var(--foreground)]/10 bg-[var(--foreground)]/5">
                    <h2 className="text-xl font-bold flex items-center gap-3 text-[var(--foreground)] tracking-wide uppercase">
                        <ShoppingBag className="h-5 w-5 text-brand" />
                        Tu Carrito
                    </h2>
                    <button
                        onClick={() => setIsCartOpen(false)}
                        className="p-2 hover:bg-[var(--foreground)]/10 rounded-full transition-colors text-[var(--foreground)]/50 hover:text-[var(--foreground)]"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {items.length === 0 ? (
                        <div className="text-center text-gray-500 py-20 flex flex-col items-center gap-4">
                            <ShoppingBag className="h-12 w-12 opacity-20" />
                            <p>Tu carrito está vacío.</p>
                        </div>
                    ) : (
                        items.map(item => (
                            <div key={item.id} className="flex gap-4 bg-[var(--foreground)]/5 p-4 border border-[var(--foreground)]/5">
                                {item.imageUrl && (
                                    <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover bg-[var(--foreground)]/5" />
                                )}
                                <div className="flex-1">
                                    <h4 className="font-medium line-clamp-2 text-[var(--foreground)] text-sm mb-1">{item.name}</h4>
                                    <p className="text-brand font-bold">${item.price}</p>
                                </div>
                                <div className="flex flex-col items-end gap-3">
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="text-[var(--foreground)]/40 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                    <div className="flex items-center border border-[var(--foreground)]/10">
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            className="p-1 px-2 hover:bg-[var(--foreground)]/10 text-[var(--foreground)]/40 hover:text-[var(--foreground)] transition-colors border-r border-[var(--foreground)]/10"
                                        >
                                            <Minus className="h-3 w-3" />
                                        </button>
                                        <span className="text-sm font-medium w-8 text-center text-[var(--foreground)]">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            className="p-1 px-2 hover:bg-[var(--foreground)]/10 text-[var(--foreground)]/40 hover:text-[var(--foreground)] transition-colors border-l border-[var(--foreground)]/10"
                                        >
                                            <Plus className="h-3 w-3" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {items.length > 0 && (
                    <div className="p-6 border-t border-[var(--foreground)]/10 bg-[var(--foreground)]/5">
                        {/* Coupon Section */}
                        <div className="mb-6">
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--foreground)]/50" />
                                    <input
                                        type="text"
                                        placeholder="Código de cupón"
                                        className="w-full bg-[var(--background)] border border-[var(--foreground)]/10 pl-10 pr-4 py-2 text-sm text-[var(--foreground)] focus:outline-none focus:border-brand placeholder:text-[var(--foreground)]/40"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                        disabled={!!appliedCoupon}
                                    />
                                </div>
                                {!appliedCoupon ? (
                                    <button
                                        onClick={handleApplyCoupon}
                                        disabled={!couponCode || couponLoading}
                                        className="bg-[var(--foreground)] text-[var(--background)] px-4 py-2 text-sm font-bold hover:bg-brand hover:text-white transition-colors disabled:opacity-50"
                                    >
                                        {couponLoading ? "..." : "APLICAR"}
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleRemoveCoupon}
                                        className="bg-red-500/10 text-red-500 p-2 hover:bg-red-500/20 transition-colors rounded-r border-t border-r border-b border-red-500/20"
                                        title="Eliminar cupón"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                            {couponMessage && (
                                <p className={`text-xs mt-2 ${couponMessage.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                                    {couponMessage.text}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2 mb-6 text-sm">
                            <div className="flex justify-between items-center text-[var(--foreground)]/60">
                                <span>Subtotal</span>
                                <span>${cartTotal.toFixed(2)}</span>
                            </div>
                            {discountAmount > 0 && (
                                <div className="flex justify-between items-center text-green-500">
                                    <span>Descuento ({appliedCoupon?.code})</span>
                                    <span>-${discountAmount.toFixed(2)}</span>
                                </div>
                            )}
                            <div className="flex justify-between items-center pt-2 border-t border-[var(--foreground)]/10">
                                <span className="text-[var(--foreground)] font-bold uppercase tracking-wider">Total</span>
                                <span className="text-2xl font-bold text-[var(--foreground)]">${finalTotal.toFixed(2)}</span>
                            </div>
                        </div>

                        <Link
                            href="/checkout"
                            className="w-full bg-brand text-white font-bold py-4 hover:bg-red-700 transition-colors uppercase tracking-widest text-sm shadow-lg text-center flex items-center justify-center gap-2"
                            onClick={() => setIsCartOpen(false)}
                        >
                            Iniciar Compra <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
