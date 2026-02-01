'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import { ArrowLeft, Check, ChevronRight, CreditCard, LayoutList, MapPin, Store, Truck, Wallet } from 'lucide-react'

export default function CheckoutPage() {
    const router = useRouter()
    const { items, finalTotal, discountAmount, appliedCoupon, clearCart } = useCart()
    const [loading, setLoading] = useState(false)
    const [step, setStep] = useState(1) // 1: Datos, 2: Pago
    const [errors, setErrors] = useState<Record<string, string>>({})

    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        phone: '',
        dniOrCuit: '',
        email: '',

        // Address
        addressStreet: '',
        addressNumber: '',
        addressFloor: '',
        addressApartment: '',
        addressNeighborhood: '',
        addressCity: 'Mar del Plata', // Default
        addressZipCode: '',

        deliveryMethod: 'envio', // envio, retiro
        branch: 'Sucursal Tucumán', // if retiro
        notes: '',

        paymentMethod: '' // coordinate, mercadopago
    })

    const validateStep1 = () => {
        const newErrors: Record<string, string> = {}
        if (!formData.name) newErrors.name = 'El nombre es requerido'
        if (!formData.surname) newErrors.surname = 'El apellido es requerido'
        if (!formData.phone) newErrors.phone = 'El teléfono es requerido'
        if (!formData.dniOrCuit) newErrors.dniOrCuit = 'DNI/CUIT es requerido'

        if (formData.deliveryMethod === 'envio') {
            if (!formData.addressStreet) newErrors.addressStreet = 'La calle es requerida'
            if (!formData.addressNumber) newErrors.addressNumber = 'La altura es requerida'
            if (!formData.addressCity) newErrors.addressCity = 'La ciudad es requerida'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const validateStep2 = () => {
        const newErrors: Record<string, string> = {}
        if (!formData.paymentMethod) newErrors.paymentMethod = 'Seleccioná un método de pago'
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validateStep2()) return

        setLoading(true)
        try {
            const payload = {
                customerName: formData.name,
                customerSurname: formData.surname,
                customerPhone: formData.phone,
                customerEmail: formData.email,
                dniOrCuit: formData.dniOrCuit,

                addressStreet: formData.addressStreet,
                addressNumber: formData.addressNumber,
                addressFloor: formData.addressFloor || '',
                addressApartment: formData.addressApartment || '',
                addressCity: formData.addressCity,
                addressNeighborhood: formData.addressNeighborhood || '',
                addressZipCode: formData.addressZipCode,

                deliveryMethod: formData.deliveryMethod,
                branch: formData.branch,
                notes: formData.notes,
                couponCode: appliedCoupon?.code || null,

                paymentMethod: formData.paymentMethod,

                items: items.map(i => ({
                    productId: i.id,
                    quantity: i.quantity
                }))
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/store/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

            if (!res.ok) throw new Error('Error al crear el pedido')

            const data = await res.json()

            if (formData.paymentMethod === 'mercadopago' && data.mpInitPoint) {
                // Redirect to Mercado Pago
                window.location.href = data.mpInitPoint
            } else {
                // Success - Coordinate
                clearCart() // Clear cart
                router.push(`/checkout/success?orderId=${data.orderId}`)
            }

        } catch (error) {
            console.error(error)
            alert("Hubo un error al procesar tu pedido. Intenta nuevamente.")
        } finally {
            setLoading(false)
        }
    }

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center p-4">
                <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">Tu carrito está vacío</h2>
                <button
                    onClick={() => router.push('/')}
                    className="bg-brand text-white px-6 py-3 rounded-full font-bold hover:opacity-90 transition-opacity"
                >
                    Volver a la tienda
                </button>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[var(--background)] pt-24 pb-12 px-4 md:px-8">
            <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Form Steps */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Progress Indicator */}
                    <div className="flex items-center gap-4 mb-8">
                        <div className={`flex items-center gap-2 ${step >= 1 ? 'text-brand' : 'text-[var(--foreground)]/40'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 font-bold ${step >= 1 ? 'border-brand bg-brand text-white' : 'border-current'}`}>1</div>
                            <span className="font-bold uppercase text-sm">Datos</span>
                        </div>
                        <div className="flex-1 h-px bg-[var(--foreground)]/10"></div>
                        <div className={`flex items-center gap-2 ${step >= 2 ? 'text-brand' : 'text-[var(--foreground)]/40'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 font-bold ${step >= 2 ? 'border-brand bg-brand text-white' : 'border-current'}`}>2</div>
                            <span className="font-bold uppercase text-sm">Pago</span>
                        </div>
                    </div>

                    {step === 1 && (
                        <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-6 flex items-center gap-2">
                                <LayoutList className="w-6 h-6 text-brand" />
                                Datos Personales
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase text-[var(--foreground)]/60">Nombre *</label>
                                    <input
                                        className={`w-full bg-[var(--foreground)]/5 border ${errors.name ? 'border-red-500' : 'border-[var(--foreground)]/10'} p-3 rounded text-[var(--foreground)] focus:outline-none focus:border-brand`}
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                    {errors.name && <span className="text-xs text-red-500">{errors.name}</span>}
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase text-[var(--foreground)]/60">Apellido *</label>
                                    <input
                                        className={`w-full bg-[var(--foreground)]/5 border ${errors.surname ? 'border-red-500' : 'border-[var(--foreground)]/10'} p-3 rounded text-[var(--foreground)] focus:outline-none focus:border-brand`}
                                        value={formData.surname}
                                        onChange={e => setFormData({ ...formData, surname: e.target.value })}
                                    />
                                    {errors.surname && <span className="text-xs text-red-500">{errors.surname}</span>}
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase text-[var(--foreground)]/60">DNI o CUIT *</label>
                                    <input
                                        className={`w-full bg-[var(--foreground)]/5 border ${errors.dniOrCuit ? 'border-red-500' : 'border-[var(--foreground)]/10'} p-3 rounded text-[var(--foreground)] focus:outline-none focus:border-brand`}
                                        value={formData.dniOrCuit}
                                        onChange={e => setFormData({ ...formData, dniOrCuit: e.target.value })}
                                    />
                                    {errors.dniOrCuit && <span className="text-xs text-red-500">{errors.dniOrCuit}</span>}
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase text-[var(--foreground)]/60">Teléfono (WhatsApp) *</label>
                                    <input
                                        className={`w-full bg-[var(--foreground)]/5 border ${errors.phone ? 'border-red-500' : 'border-[var(--foreground)]/10'} p-3 rounded text-[var(--foreground)] focus:outline-none focus:border-brand`}
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                    {errors.phone && <span className="text-xs text-red-500">{errors.phone}</span>}
                                </div>
                            </div>

                            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-6 flex items-center gap-2 pt-4 border-t border-[var(--foreground)]/10">
                                <Truck className="w-6 h-6 text-brand" />
                                Método de Entrega
                            </h2>

                            <div className="flex gap-4 mb-6">
                                <button
                                    onClick={() => setFormData({ ...formData, deliveryMethod: 'envio' })}
                                    className={`flex-1 p-4 border-2 rounded-xl flex flex-col items-center gap-2 transition-all ${formData.deliveryMethod === 'envio' ? 'border-brand bg-brand/5 text-brand' : 'border-[var(--foreground)]/10 text-[var(--foreground)]/60 hover:bg-[var(--foreground)]/5'}`}
                                >
                                    <Truck className="w-6 h-6" />
                                    <span className="font-bold uppercase">Envío a Domicilio</span>
                                </button>
                                <button
                                    onClick={() => setFormData({ ...formData, deliveryMethod: 'retiro' })}
                                    className={`flex-1 p-4 border-2 rounded-xl flex flex-col items-center gap-2 transition-all ${formData.deliveryMethod === 'retiro' ? 'border-brand bg-brand/5 text-brand' : 'border-[var(--foreground)]/10 text-[var(--foreground)]/60 hover:bg-[var(--foreground)]/5'}`}
                                >
                                    <Store className="w-6 h-6" />
                                    <span className="font-bold uppercase">Retiro en Sucursal</span>
                                </button>
                            </div>

                            {formData.deliveryMethod === 'retiro' ? (
                                <div className="mb-6 animate-in fade-in">
                                    <label className="text-xs font-bold uppercase text-[var(--foreground)]/60 block mb-1">Sucursal de Retiro</label>
                                    <select
                                        className="w-full bg-[var(--foreground)]/5 border border-[var(--foreground)]/10 p-3 rounded text-[var(--foreground)] focus:outline-none focus:border-brand [&>option]:bg-[var(--background)] [&>option]:text-[var(--foreground)]"
                                        value={formData.branch}
                                        onChange={e => setFormData({ ...formData, branch: e.target.value })}
                                    >
                                        <option value="Sucursal Tucumán">Sucursal Tucumán</option>
                                        <option value="Sucursal Independencia">Sucursal Independencia</option>
                                    </select>
                                </div>
                            ) : (
                                <div className="space-y-4 mb-6 animate-in fade-in">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="md:col-span-2 space-y-1">
                                            <label className="text-xs font-bold uppercase text-[var(--foreground)]/60">Calle *</label>
                                            <input
                                                className={`w-full bg-[var(--foreground)]/5 border ${errors.addressStreet ? 'border-red-500' : 'border-[var(--foreground)]/10'} p-3 rounded text-[var(--foreground)] focus:outline-none focus:border-brand`}
                                                value={formData.addressStreet}
                                                onChange={e => setFormData({ ...formData, addressStreet: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold uppercase text-[var(--foreground)]/60">Número *</label>
                                            <input
                                                className={`w-full bg-[var(--foreground)]/5 border ${errors.addressNumber ? 'border-red-500' : 'border-[var(--foreground)]/10'} p-3 rounded text-[var(--foreground)] focus:outline-none focus:border-brand`}
                                                value={formData.addressNumber}
                                                onChange={e => setFormData({ ...formData, addressNumber: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold uppercase text-[var(--foreground)]/60">Piso / Dpto</label>
                                            <div className="flex gap-2">
                                                <input
                                                    placeholder="Piso"
                                                    className="w-1/2 bg-[var(--foreground)]/5 border border-[var(--foreground)]/10 p-3 rounded text-[var(--foreground)] focus:outline-none focus:border-brand"
                                                    value={formData.addressFloor}
                                                    onChange={e => setFormData({ ...formData, addressFloor: e.target.value })}
                                                />
                                                <input
                                                    placeholder="Dpto"
                                                    className="w-1/2 bg-[var(--foreground)]/5 border border-[var(--foreground)]/10 p-3 rounded text-[var(--foreground)] focus:outline-none focus:border-brand"
                                                    value={formData.addressApartment}
                                                    onChange={e => setFormData({ ...formData, addressApartment: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold uppercase text-[var(--foreground)]/60">Barrio</label>
                                            <input
                                                className="w-full bg-[var(--foreground)]/5 border border-[var(--foreground)]/10 p-3 rounded text-[var(--foreground)] focus:outline-none focus:border-brand"
                                                value={formData.addressNeighborhood}
                                                onChange={e => setFormData({ ...formData, addressNeighborhood: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold uppercase text-[var(--foreground)]/60">Ciudad *</label>
                                            <input
                                                className={`w-full bg-[var(--foreground)]/5 border ${errors.addressCity ? 'border-red-500' : 'border-[var(--foreground)]/10'} p-3 rounded text-[var(--foreground)] focus:outline-none focus:border-brand`}
                                                value={formData.addressCity}
                                                onChange={e => setFormData({ ...formData, addressCity: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold uppercase text-[var(--foreground)]/60">Código Postal</label>
                                            <input
                                                className="w-full bg-[var(--foreground)]/5 border border-[var(--foreground)]/10 p-3 rounded text-[var(--foreground)] focus:outline-none focus:border-brand"
                                                value={formData.addressZipCode}
                                                onChange={e => setFormData({ ...formData, addressZipCode: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold uppercase text-[var(--foreground)]/60">Notas Adicionales</label>
                                        <textarea
                                            className="w-full bg-[var(--foreground)]/5 border border-[var(--foreground)]/10 p-3 rounded text-[var(--foreground)] focus:outline-none focus:border-brand h-20 resize-none"
                                            placeholder="Indicaciones para el repartidor, horarios, etc."
                                            value={formData.notes}
                                            onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="text-right">
                                <button
                                    onClick={() => {
                                        if (validateStep1()) setStep(2)
                                    }}
                                    className="bg-brand text-white px-8 py-3 rounded-xl font-bold uppercase tracking-widest hover:bg-red-700 transition-colors shadow-lg flex items-center gap-2 ml-auto"
                                >
                                    Siguiente Paso <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-6 flex items-center gap-2">
                                <Wallet className="w-6 h-6 text-brand" />
                                Método de Pago
                            </h2>

                            <div className="space-y-4 mb-8">
                                <label
                                    className={`flex items-center gap-4 p-6 border-2 rounded-xl cursor-pointer transition-all ${formData.paymentMethod === 'coordinate' ? 'border-brand bg-brand/5' : 'border-[var(--foreground)]/10 hover:bg-[var(--foreground)]/5'}`}
                                >
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${formData.paymentMethod === 'coordinate' ? 'border-brand' : 'border-gray-400'}`}>
                                        {formData.paymentMethod === 'coordinate' && <div className="w-3 h-3 bg-brand rounded-full"></div>}
                                    </div>
                                    <input
                                        type="radio"
                                        name="payment"
                                        className="hidden"
                                        checked={formData.paymentMethod === 'coordinate'}
                                        onChange={() => setFormData({ ...formData, paymentMethod: 'coordinate' })}
                                    />
                                    <div className="flex-1">
                                        <span className="font-bold text-lg text-[var(--foreground)] block">Coordinar con el Vendedor</span>
                                        <span className="text-sm text-[var(--foreground)]/60">Efectivo, Transferencia o Tarjeta en el local.</span>
                                    </div>
                                    <Store className="w-8 h-8 text-[var(--foreground)]/40" />
                                </label>

                                {/* Mercado Pago Temporarily Disabled
                                <label
                                    className={`flex items-center gap-4 p-6 border-2 rounded-xl cursor-pointer transition-all ${formData.paymentMethod === 'mercadopago' ? 'border-brand bg-brand/5' : 'border-[var(--foreground)]/10 hover:bg-[var(--foreground)]/5'}`}
                                >
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${formData.paymentMethod === 'mercadopago' ? 'border-brand' : 'border-gray-400'}`}>
                                        {formData.paymentMethod === 'mercadopago' && <div className="w-3 h-3 bg-brand rounded-full"></div>}
                                    </div>
                                    <input
                                        type="radio"
                                        name="payment"
                                        className="hidden"
                                        checked={formData.paymentMethod === 'mercadopago'}
                                        onChange={() => setFormData({ ...formData, paymentMethod: 'mercadopago' })}
                                    />
                                    <div className="flex-1">
                                        <span className="font-bold text-lg text-[var(--foreground)] block">Mercado Pago</span>
                                        <span className="text-sm text-[var(--foreground)]/60">Tarjetas de Débito, Crédito, Dinero en cuenta.</span>
                                    </div>
                                    <CreditCard className="w-8 h-8 text-[var(--foreground)]/40" />
                                </label>
                                */}
                                {errors.paymentMethod && <p className="text-red-500 text-sm mt-2">{errors.paymentMethod}</p>}
                            </div>

                            <div className="flex justify-between items-center">
                                <button
                                    onClick={() => setStep(1)}
                                    className="text-[var(--foreground)]/60 hover:text-[var(--foreground)] font-medium flex items-center gap-2"
                                >
                                    <ArrowLeft className="w-4 h-4" /> Volver
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="bg-green-600 text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-green-700 transition-colors shadow-lg flex items-center gap-2 disabled:opacity-50"
                                >
                                    {loading ? 'Procesando...' : formData.paymentMethod === 'mercadopago' ? 'Ir a Pagar' : 'Finalizar Pedido'}
                                    {!loading && <Check className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-[var(--foreground)]/5 border border-[var(--foreground)]/10 rounded-xl p-6 sticky top-28">
                        <h3 className="text-lg font-bold text-[var(--foreground)] mb-4 uppercase tracking-wider">Tu Pedido</h3>

                        <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                            {items.map(item => (
                                <div key={item.id} className="flex gap-3 text-sm">
                                    {item.imageUrl && (
                                        <img src={item.imageUrl} alt={item.name} className="w-12 h-12 object-cover rounded bg-[var(--background)]" />
                                    )}
                                    <div className="flex-1">
                                        <p className="font-medium text-[var(--foreground)] line-clamp-2">{item.name}</p>
                                        <p className="text-[var(--foreground)]/60 text-xs">Cant: {item.quantity}</p>
                                    </div>
                                    <p className="font-bold text-[var(--foreground)]">${(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-2 pt-4 border-t border-[var(--foreground)]/10 text-sm">
                            {appliedCoupon && (
                                <div className="flex justify-between text-green-600">
                                    <span>Descuento ({appliedCoupon.code})</span>
                                    <span>-${discountAmount.toFixed(2)}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-xl font-bold text-[var(--foreground)] pt-2">
                                <span>Total</span>
                                <span>${finalTotal.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
