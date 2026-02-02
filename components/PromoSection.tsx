import { Truck, CreditCard, ShieldCheck, Store } from "lucide-react";

export default function PromoSection() {
    return (
        <section className="py-16 bg-neutral-900 border-y border-white/10">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="flex flex-col items-center text-center p-6 bg-black border border-white/5 hover:border-brand/30 transition-colors group">
                        <div className="p-4 bg-white/5 rounded-full mb-4 group-hover:bg-brand group-hover:text-white transition-colors text-gray-300">
                            <Truck className="h-8 w-8" />
                        </div>
                        <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-2">Envíos Gratis</h3>
                        <p className="text-sm text-gray-500">En compras superiores a $90.000</p>
                    </div>

                    <div className="flex flex-col items-center text-center p-6 bg-black border border-white/5 hover:border-brand/30 transition-colors group">
                        <div className="p-4 bg-white/5 rounded-full mb-4 group-hover:bg-brand group-hover:text-white transition-colors text-gray-300">
                            <CreditCard className="h-8 w-8" />
                        </div>
                        <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-2">3 y 6 Cuotas</h3>
                        <p className="text-sm text-gray-500">Sin interés con tarjetas bancarias</p>
                    </div>

                    <div className="flex flex-col items-center text-center p-6 bg-black border border-white/5 hover:border-brand/30 transition-colors group">
                        <div className="p-4 bg-white/5 rounded-full mb-4 group-hover:bg-brand group-hover:text-white transition-colors text-gray-300">
                            <ShieldCheck className="h-8 w-8" />
                        </div>
                        <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-2">Compra Segura</h3>
                        <p className="text-sm text-gray-500">Tus datos están protegidos siempre</p>
                    </div>

                    <div className="flex flex-col items-center text-center p-6 bg-black border border-white/5 hover:border-brand/30 transition-colors group">
                        <div className="p-4 bg-white/5 rounded-full mb-4 group-hover:bg-brand group-hover:text-white transition-colors text-gray-300">
                            <Store className="h-8 w-8" />
                        </div>
                        <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-2">Retiro en tienda</h3>
                        <p className="text-sm text-gray-500">Gratis en sucursal</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
