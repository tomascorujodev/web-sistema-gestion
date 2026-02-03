'use client'

import React, { useEffect, useState, useCallback } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import Link from 'next/link'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'

interface CarouselImage {
    id: number;
    imageUrl: string;
    title: string;
    link: string;
    mobileImageUrl?: string | null;
}

// Fallback images if no carousel images are configured
const DEFAULT_IMAGES: CarouselImage[] = [
    {
        id: 999,
        imageUrl: "https://images.unsplash.com/photo-1551730459-92db2a308d6b?q=80&w=2574&auto=format&fit=crop",
        title: "Nueva Colección 2025",
        link: "/products",
        mobileImageUrl: null
    }
];

export default function HeroCarousel() {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000 })])
    const [images, setImages] = useState<CarouselImage[]>(DEFAULT_IMAGES)
    const [config, setConfig] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev()
    }, [emblaApi])

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext()
    }, [emblaApi])

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/site-config`);
                if (res.ok) {
                    const data = await res.json()
                    setConfig(data)
                    if (data.carouselImages && data.carouselImages.length > 0) {
                        setImages(data.carouselImages)
                    }
                }
            } catch (error) {
                console.error("Error fetching site config:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchConfig()
    }, [])

    // Dynamic Styles based on config
    const primaryColor = config?.primaryColor || '#E11D48'; // Default red
    const secondaryColor = config?.secondaryColor || '#000000';

    return (
        <div className="relative group">
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex">
                    {images.map((img) => (
                        <div className="flex-[0_0_100%] min-w-0 relative h-[500px] md:h-[500px] lg:h-[70vh]" key={img.id}>
                            <picture>
                                {/* Mobile Image */}
                                {img.mobileImageUrl && (
                                    <source
                                        media="(max-width: 768px)"
                                        srcSet={img.mobileImageUrl}
                                    />
                                )}
                                {/* Desktop/Default Image */}
                                <img
                                    src={img.imageUrl}
                                    alt={img.title || 'Slide'}
                                    className="w-full h-full object-cover"
                                />
                            </picture>
                        </div>
                    ))}
                </div>
            </div>

            <button className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0" onClick={scrollPrev}>
                <ChevronLeft size={32} />
            </button>
            <button className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0" onClick={scrollNext}>
                <ChevronRight size={32} />
            </button>
        </div>
    )
}
