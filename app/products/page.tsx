import ProductCatalog from "@/components/ProductCatalog";

// Fetch data from the Backend API
async function getData() {
    try {
        const productsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/store/products`, { cache: 'no-store' });
        const categoriesRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/store/categories`, { cache: 'no-store' });

        const products = productsRes.ok ? await productsRes.json() : [];
        const categories = categoriesRes.ok ? await categoriesRes.json() : [];

        return { products, categories };
    } catch (error) {
        console.error("Error fetching data:", error);
        return { products: [], categories: [] };
    }
}

export default async function ProductsPage() {
    const { products, categories } = await getData();

    return (
        <div className="min-h-screen bg-[var(--background)]">
            {/* Header */}
            <div className="bg-neutral-900 border-b border-white/10 py-12 px-4">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl font-bold text-white uppercase tracking-tighter">
                        Catálogo de <span className="text-brand">Productos</span>
                    </h1>
                    <p className="text-gray-400 mt-2 font-light">Explorá nuestra selección completa.</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-12">
                <ProductCatalog products={products} categories={categories} />
            </div>
        </div>
    );
}
