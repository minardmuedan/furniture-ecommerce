import categories from '@/lib/categories'
import { notFound } from 'next/navigation'

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params
  const selectedCategory = categories.find(({ slug }) => category === slug)
  if (!selectedCategory) return notFound()

  return (
    <div>
      <h1 className="text-2xl font-bold">{selectedCategory.title}</h1>
      <p className="text-muted-foreground text-sm">{selectedCategory.description}</p>

      <ul className="mt-20">
        {selectedCategory.subcategories.map((subcategory, i) => (
          <li key={i}>
            <h2>{subcategory.title}</h2>
            <p className="text-muted-foreground text-sm">{subcategory.description}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export const generateStaticParams = async () => categories.map(({ slug }) => ({ category: slug }))
