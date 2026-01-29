"use client";

import { useCart } from "@/context/CartContext";
import { X, Trash2, ShoppingBag, Minus, Plus, Truck, Store } from "lucide-react";
import { useState } from "react";

export default function CartSidebar() {
    const { isCartOpen, setIsCartOpen, items, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        address: "",
        deliveryMethod: "envio", // "envio" or "retiro"
        branch: "Sucursal Tucumán",
        notes: ""
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    if (!isCartOpen) return null;

    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (formData.deliveryMethod === 'envio' && !formData.address) {
            alert("Por favor, ingresá una dirección de envío.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/store/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customerName: formData.name,
                    customerPhone: formData.phone,
                    customerAddress: formData.deliveryMethod === 'envio' ? formData.address : `RETIRO EN: ${formData.branch}`,
                    customerEmail: "web@order.com",
                    deliveryMethod: formData.deliveryMethod,
                    branch: formData.deliveryMethod === 'retiro' ? formData.branch : null,
                    notes: formData.notes,
                    items: items.map(item => ({ productId: item.id, quantity: item.quantity }))
                })
            });

            if (response.ok) {
                setSuccess(true);
                clearCart();
                setTimeout(() => {
                    setSuccess(false);
                    setIsCheckingOut(false);
                    setIsCartOpen(false);
                    setFormData({ name: "", phone: "", address: "", deliveryMethod: "envio", branch: "Sucursal Tucumán", notes: "" });
                }, 3000);
            } else {
                alert("Hubo un error al procesar el pedido.");
            }
        } catch (error) {
            console.error("Checkout error:", error);
            alert("Error de conexión con el servidor.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60]">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={() => setIsCartOpen(false)}
            />

            {/* Drawer */}
            <div className="absolute right-0 top-0 h-full w-full max-w-md bg-neutral-900 border-l border-white/10 shadow-2xl flex flex-col">
                <div className="flex items-center justify-between p-6 border-b border-white/10 bg-black">
                    <h2 className="text-xl font-bold flex items-center gap-3 text-white tracking-wide uppercase">
                        <ShoppingBag className="h-5 w-5 text-brand" />
                        Tu Carrito
                    </h2>
                    <button
                        onClick={() => setIsCartOpen(false)}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {success ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in">
                        <div className="w-20 h-20 bg-brand rounded-full flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(157,62,60,0.5)]">
                            <span className="text-4xl text-white">✓</span>
                        </div>
                        <h3 className="text-2xl font-bold mb-2 text-white">¡Pedido Registrado!</h3>
                        <p className="text-gray-400">Tu pedido ha sido enviado al sistema correctamente.</p>
                    </div>
                ) : (
                    <>
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {items.length === 0 ? (
                                <div className="text-center text-gray-500 py-20 flex flex-col items-center gap-4">
                                    <ShoppingBag className="h-12 w-12 opacity-20" />
                                    <p>Tu carrito está vacío.</p>
                                </div>
                            ) : (
                                items.map(item => (
                                    <div key={item.id} className="flex gap-4 bg-black p-4 border border-white/5">
                                        {item.imageUrl && (
                                            <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover bg-neutral-800" />
                                        )}
                                        <div className="flex-1">
                                            <h4 className="font-medium line-clamp-2 text-white text-sm mb-1">{item.name}</h4>
                                            <p className="text-brand font-bold">${item.price}</p>
                                        </div>
                                        <div className="flex flex-col items-end gap-3">
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-gray-500 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                            <div className="flex items-center border border-white/10">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="p-1 px-2 hover:bg-white/10 text-gray-400 hover:text-white transition-colors border-r border-white/10"
                                                >
                                                    <Minus className="h-3 w-3" />
                                                </button>
                                                <span className="text-sm font-medium w-8 text-center text-white">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="p-1 px-2 hover:bg-white/10 text-gray-400 hover:text-white transition-colors border-l border-white/10"
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
                            <div className="p-6 border-t border-white/10 bg-black">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-gray-400 uppercase text-sm tracking-wider">Total Estimado</span>
                                    <span className="text-3xl font-bold text-white">${cartTotal}</span>
                                </div>

                                {isCheckingOut ? (
                                    <form onSubmit={handleCheckout} className="space-y-4 animate-in slide-in-from-bottom-5">
                                        <div className="space-y-4">
                                            <input
                                                required
                                                placeholder="Nombre Completo"
                                                className="w-full bg-neutral-900 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-brand transition-colors placeholder:text-gray-600"
                                                value={formData.name}
                                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            />
                                            <input
                                                required
                                                placeholder="Teléfono (WhatsApp)"
                                                className="w-full bg-neutral-900 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-brand transition-colors placeholder:text-gray-600"
                                                value={formData.phone}
                                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                            />

                                            <div className="grid grid-cols-2 gap-2 mt-4">
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, deliveryMethod: 'envio' })}
                                                    className={`flex flex-col items-center gap-2 p-3 border transition-all ${formData.deliveryMethod === 'envio'
                                                        ? 'border-brand bg-brand/10 text-brand'
                                                        : 'border-white/10 text-gray-500 hover:bg-white/5'
                                                        }`}
                                                >
                                                    <Truck className="h-5 w-5" />
                                                    <span className="text-[10px] font-bold uppercase">Para Envío</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, deliveryMethod: 'retiro' })}
                                                    className={`flex flex-col items-center gap-2 p-3 border transition-all ${formData.deliveryMethod === 'retiro'
                                                        ? 'border-brand bg-brand/10 text-brand'
                                                        : 'border-white/10 text-gray-500 hover:bg-white/5'
                                                        }`}
                                                >
                                                    <Store className="h-5 w-5" />
                                                    <span className="text-[10px] font-bold uppercase">Para Retiro</span>
                                                </button>
                                            </div>

                                            {formData.deliveryMethod === 'envio' ? (
                                                <input
                                                    required
                                                    placeholder="Dirección de Entrega"
                                                    className="w-full bg-neutral-900 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-brand transition-colors placeholder:text-gray-600 animate-in fade-in slide-in-from-top-2"
                                                    value={formData.address}
                                                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                                                />
                                            ) : (
                                                <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                                    <label className="text-gray-500 text-[10px] font-bold uppercase block px-1">Elegir Sucursal</label>
                                                    <select
                                                        required
                                                        className="w-full bg-neutral-900 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-brand transition-colors appearance-none cursor-pointer"
                                                        value={formData.branch}
                                                        onChange={e => setFormData({ ...formData, branch: e.target.value })}
                                                    >
                                                        <option value="Sucursal Tucumán">Sucursal Tucumán</option>
                                                        <option value="Sucursal Independencia">Sucursal Independencia</option>
                                                    </select>
                                                </div>
                                            )}

                                            <textarea
                                                placeholder="Notas adicionales..."
                                                className="w-full bg-neutral-900 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-brand transition-colors placeholder:text-gray-600 h-20 resize-none"
                                                value={formData.notes}
                                                onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                            />
                                        </div>
                                        <div className="flex gap-3 pt-2">
                                            <button
                                                type="button"
                                                onClick={() => setIsCheckingOut(false)}
                                                className="flex-1 px-4 py-3 border border-white/20 text-white hover:bg-white/5 transition-colors font-medium uppercase text-sm tracking-wider"
                                            >
                                                Volver
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="flex-1 bg-brand text-white font-bold py-3 hover:bg-red-700 transition-colors disabled:opacity-50 uppercase text-sm tracking-widest shadow-lg"
                                            >
                                                {loading ? "Enviando..." : "Confirmar"}
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <button
                                        onClick={() => setIsCheckingOut(true)}
                                        className="w-full bg-white text-black font-bold py-4 hover:bg-gray-200 transition-colors uppercase tracking-widest text-sm shadow-[4px_4px_0px_0px_#9D3E3C] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
                                    >
                                        Iniciar Pedido
                                    </button>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
