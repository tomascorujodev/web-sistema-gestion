"use client";

import { useConfig } from "@/context/ConfigContext";
import { Wrench } from "lucide-react";

export default function MaintenanceGuard({ children }: { children: React.ReactNode }) {
    const { config, loading } = useConfig();

    if (loading) return null; // Or a simpler loader if preferred to avoid flash

    if (config.isStoreEnabled === false) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-4">
                <div className="text-center max-w-md animate-fade-in-up">
                    <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Wrench size={40} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-bold mb-4 font-outfit">En Mantenimiento</h1>
                    <p className="text-gray-400 mb-8">
                        Estamos realizando mejoras en nuestra tienda. Por favor vuelva a intentarlo en unos minutos.
                    </p>
                    <div className="w-16 h-1 bg-gradient-to-r from-brand-start to-brand-end mx-auto rounded-full"></div>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
