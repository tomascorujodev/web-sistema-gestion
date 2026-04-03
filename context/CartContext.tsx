"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useConfig } from "./ConfigContext";

export interface Product {
    id: number;
    name: string;
    price: number;
    imageUrl?: string;
    category?: string;
    excludeFromCoupons?: boolean;
}

export interface CartItem extends Product {
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (product: Product) => void;
    removeFromCart: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    clearCart: () => void;
    cartTotal: number;
    cartCount: number;
    isCartOpen: boolean;
    setIsCartOpen: (open: boolean) => void;
    appliedCoupon: any;
    applyCoupon: (coupon: any) => boolean;
    removeCoupon: () => void;
    discountAmount: number;
    shippingCost: number;
    freeShippingThreshold: number;
    isShippingModuleEnabled: boolean;
    finalTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const [appliedCoupon, setAppliedCoupon] = useState<any>(null); // Store full coupon object
    const { config } = useConfig();

    // Load from local storage
    useEffect(() => {
        const savedCart = localStorage.getItem("petshop-cart");
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart));
            } catch (e) {
                console.error("Failed to parse cart", e);
            }
        }
        setIsInitialized(true);
    }, []);

    // Save to local storage
    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem("petshop-cart", JSON.stringify(items));
        }
    }, [items, isInitialized]);

    const addToCart = (product: Product) => {
        setItems(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
        setIsCartOpen(true);
    };

    const removeFromCart = (id: number) => {
        setItems(prev => prev.filter(item => item.id !== id));
    };

    const updateQuantity = (id: number, quantity: number) => {
        if (quantity < 1) return removeFromCart(id);
        setItems(prev => prev.map(item => item.id === id ? { ...item, quantity } : item));
    };

    const clearCart = () => {
        setItems([]);
        setAppliedCoupon(null);
    };

    const applyCoupon = (coupon: any): boolean => {
        if (coupon.category) {
            const hasEligibleItems = items.some(item =>
                !item.excludeFromCoupons && item.category && item.category.toLowerCase() === coupon.category.toLowerCase()
            );
            if (!hasEligibleItems) {
                return false;
            }
        } else {
            const hasEligibleItems = items.some(item => !item.excludeFromCoupons);
            if (!hasEligibleItems) return false;
        }
        setAppliedCoupon(coupon);
        return true;
    };

    const removeCoupon = () => {
        setAppliedCoupon(null);
    };

    const cartTotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
    const cartCount = items.reduce((count, item) => count + item.quantity, 0);

    // Calculate discount
    let discountAmount = 0;
    if (appliedCoupon) {
        let eligibleTotal = 0;
        if (!appliedCoupon.category) {
            // Apply to all non-excluded items
            eligibleTotal = items
                .filter(item => !item.excludeFromCoupons)
                .reduce((sum, item) => sum + (item.price * item.quantity), 0);
        } else {
            // Apply only to category and non-excluded items
            eligibleTotal = items
                .filter(item => !item.excludeFromCoupons && item.category && item.category.toLowerCase() === appliedCoupon.category.toLowerCase())
                .reduce((sum, item) => sum + (item.price * item.quantity), 0);
        }
        discountAmount = eligibleTotal * (appliedCoupon.discountPercentage / 100);
    }

    // Shipping logic (simplified for live cart, can be detail refined in checkout)
    let currentShippingCost = 0;
    if (config.isShippingModuleEnabled) {
        if (config.freeShippingThreshold > 0 && cartTotal >= config.freeShippingThreshold) {
            currentShippingCost = 0;
        } else {
            currentShippingCost = config.flatShippingCost;
        }
    }

    const finalTotal = Math.max(0, cartTotal - discountAmount);

    return (
        <CartContext.Provider value={{
            items,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            cartTotal,
            cartCount,
            isCartOpen,
            setIsCartOpen,
            appliedCoupon,
            applyCoupon,
            removeCoupon,
            discountAmount,
            shippingCost: currentShippingCost,
            freeShippingThreshold: config.freeShippingThreshold,
            isShippingModuleEnabled: config.isShippingModuleEnabled,
            finalTotal
        }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used within a CartProvider");
    return context;
};
