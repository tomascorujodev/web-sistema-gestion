'use client'

import React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle, Home, ShoppingBag, MessageCircle } from 'lucide-react'
import Link from 'next/link'

export default function CheckoutSuccessPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const orderId = searchParams.get('orderId')
    const status = searchParams.get('status') // For MP callbacks

    return (
        <div className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full bg-[var(--foreground)]/5 border border-[var(--foreground)]/10 p-8 rounded-2xl text-center animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10" />
                </div>

                <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">
                    ¡Pedido Confirmado!
                </h1>

                {orderId && (
                    <p className="text-[var(--foreground)]/60 text-sm mb-6 uppercase tracking-wider">
                        Pedido #{orderId}
                    </p>
                )}

                <div className="space-y-4 mb-8">
                    <p className="text-[var(--foreground)]/80">
                        Hemos recibido tu pedido correctamente.
                    </p>
                    <div className="bg-[var(--foreground)]/5 p-4 rounded-xl text-sm text-[var(--foreground)]/70">
                        <p>
                            En breve nos pondremos en contacto contigo por <strong>WhatsApp</strong> o <strong>Teléfono</strong> para confirmar los detalles y la entrega.
                        </p>
                    </div>
                </div>

                <div className="space-y-3">
                    <Link
                        href="/"
                        className="block w-full bg-brand text-white font-bold py-4 rounded-xl hover:bg-red-700 transition-colors uppercase tracking-widest text-sm shadow-lg flex items-center justify-center gap-2"
                    >
                        <Home className="w-4 h-4" /> Volver al Inicio
                    </Link>

                    <a
                        href="https://wa.me/5492235454801"
                        target="_blank"
                        rel="noreferrer"
                        className="block w-full bg-[#25D366] text-white font-bold py-4 rounded-xl hover:opacity-90 transition-opacity uppercase tracking-widest text-sm shadow-lg flex items-center justify-center gap-2"
                    >
                        <MessageCircle className="w-4 h-4" /> Escribirnos al WhatsApp
                    </a>
                </div>
            </div>
        </div>
    )
}
