"use client";

import { CartProvider } from "@/context/CartContext";
import { ConfigProvider } from "@/context/ConfigContext";
import MaintenanceGuard from "./MaintenanceGuard";
import CartSidebar from "./CartSidebar";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ConfigProvider>
            <CartProvider>
                <MaintenanceGuard>
                    {children}
                    <CartSidebar />
                </MaintenanceGuard>
            </CartProvider>
        </ConfigProvider>
    );
}
