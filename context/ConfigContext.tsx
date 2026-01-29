"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface SiteConfig {
    primaryColor: string;
    secondaryColor: string;
    carouselImages: any[];
    isStoreEnabled: boolean;
}

interface ConfigContextType {
    config: SiteConfig;
    loading: boolean;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api`;

export function ConfigProvider({ children }: { children: ReactNode }) {
    const [config, setConfig] = useState<SiteConfig>({
        primaryColor: "#E11D48", // Default
        secondaryColor: "#000000",
        carouselImages: [],
        isStoreEnabled: true
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const res = await fetch(`${API_URL}/site-config`, { cache: 'no-store' });
                if (res.ok) {
                    const data = await res.json();
                    setConfig({
                        primaryColor: data.primaryColor || "#E11D48",
                        secondaryColor: data.secondaryColor || "#000000",
                        carouselImages: data.carouselImages || [],
                        isStoreEnabled: data.isStoreEnabled !== undefined ? data.isStoreEnabled : true
                    });
                }
            } catch (error) {
                console.error("Error fetching site config:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchConfig();
    }, []);

    return (
        <ConfigContext.Provider value={{ config, loading }}>
            {children}
        </ConfigContext.Provider>
    );
}

export function useConfig() {
    const context = useContext(ConfigContext);
    if (context === undefined) {
        throw new Error("useConfig must be used within a ConfigProvider");
    }
    return context;
}
