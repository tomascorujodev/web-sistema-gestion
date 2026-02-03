import Link from 'next/link'
import ProductCarousel from '@/components/ProductCarousel'
import HeroCarousel from '@/components/HeroCarousel'
import PromoSection from '@/components/PromoSection'
import { ArrowRight } from 'lucide-react'

// Fetch data from the Backend API
async function getProducts() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/store/products`, {
      next: { revalidate: 60 }
    });

    if (!res.ok) {
      throw new Error('Failed to fetch products');
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export default async function Home() {
  const products: any[] = await getProducts();

  // Logic to categorize products
  // 1. Offers: Filter by isOffer boolean from API
  const offerProducts = products.filter(p => p.isOffer).slice(0, 10);

  // 2. Featured: Take next 8 non-offer products
  const featuredProducts = products.filter(p => !p.isOffer).slice(0, 8);

  // 3. Accessories: Filter by category name
  const accessoriesProducts = products.filter(p =>
    (p.category || "").toUpperCase().includes("ACCESORIOS")
  ).slice(0, 10); // Limit to 10

  // 4. Fallback for Accessories if empty (e.g. use "Juguetes" or just random others)
  const displayAccessories = accessoriesProducts.length > 0 ? accessoriesProducts : products.filter(p => !p.isOffer).slice(8, 18);
  const accessoriesTitle = accessoriesProducts.length > 0 ? "Accesorios" : "Más Vendidos";

  return (
    <div className="min-h-screen bg-[var(--background)] pb-20">
      {/* Hero Section */}
      <HeroCarousel />

      {/* Offers Carousel */}
      {offerProducts.length > 0 && (
        <ProductCarousel title="Ofertas Imperdibles" products={offerProducts} />
      )}

      {/* Featured Carousel */}
      <ProductCarousel title="Productos Destacados" products={featuredProducts} />

      {/* Promo Info Section */}
      <PromoSection />

      {/* Secondary Carousel (Accessories or Best Sellers) */}
      <ProductCarousel title={accessoriesTitle} products={displayAccessories} />

      {/* Call to Action - View All */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto bg-[var(--foreground)]/5 border border-[var(--foreground)]/10 p-12 relative overflow-hidden group">
          <div className="absolute inset-0 bg-brand/5 group-hover:bg-brand/10 transition-colors"></div>
          <h2 className="text-3xl font-bold text-[var(--foreground)] mb-6 relative z-10">¿No encontraste lo que buscabas?</h2>
          <p className="text-[var(--foreground)]/60 mb-8 relative z-10">Tenemos miles de productos más en nuestro catálogo completo.</p>
          <Link href="/products" className="inline-flex items-center gap-2 bg-[var(--foreground)] text-[var(--background)] px-8 py-3 font-bold hover:opacity-90 transition-opacity uppercase tracking-wider relative z-10">
            Ver Catálogo Completo <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
