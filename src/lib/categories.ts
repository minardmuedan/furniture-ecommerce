const baseCategories = [
  {
    title: 'Living Room',
    description: 'Furniture and decor to create a cozy, stylish, and functional living space.',
    subcategories: [
      { title: 'Sofas', description: 'Comfortable seating for stylish living spaces.' },
      { title: 'Coffee Tables', description: 'Functional centerpiece for your living room.' },
      { title: 'TV Stands', description: 'Sleek support for your entertainment system.' },
    ],
  },
  {
    title: 'Outdoor',
    description: 'Durable furniture designed for outdoor comfort, relaxation, and gatherings.',
    subcategories: [
      { title: 'Patio Furniture', description: 'Outdoor comfort for relaxing moments.' },
      { title: 'Garden Chairs', description: 'Stylish seating for outdoor spaces.' },
      { title: 'Tables', description: 'Versatile surfaces for any occasion outdoors.' },
    ],
  },
  {
    title: 'Bedroom',
    description: 'Essential furniture for restful and organized bedrooms.',
    subcategories: [
      { title: 'Beds', description: 'Restful retreats for peaceful sleep.' },
      { title: 'Nightstands', description: 'Convenient bedside storage solutions.' },
      { title: 'Dressers', description: 'Stylish storage for your bedroom essentials.' },
      { title: 'Wardrobes', description: 'Spacious storage for clothing and accessories.' },
    ],
  },
  {
    title: 'Storage',
    description: 'Smart storage solutions to keep your home tidy and organized.',
    subcategories: [
      { title: 'Shelves', description: 'Open storage for display and functionality.' },
      { title: 'Cabinets', description: 'Closed storage for a clutter-free look.' },
      { title: 'Wardrobes', description: 'Ample space for clothing and linens.' },
    ],
  },
  {
    title: 'Dining Room',
    description: 'Furniture for hosting meals, gatherings, and special occasions.',
    subcategories: [
      { title: 'Dining Tables', description: 'Inviting centerpiece for family meals.' },
      { title: 'Chairs', description: 'Comfortable seating for any room.' },
      { title: 'Sideboard & Buffets', description: 'Elegant storage for dining essentials.' },
    ],
  },
  {
    title: 'Kids',
    description: 'Fun, safe, and practical furniture designed for kids’ rooms.',
    subcategories: [
      { title: 'Bunk Beds', description: 'Space-saving sleeping solutions for kids.' },
      { title: 'Kids Desks', description: 'Functional study space for learning and creativity.' },
      { title: 'Toy Storage', description: 'Organized storage for toys and playthings.' },
    ],
  },
  {
    title: 'Office',
    description: 'Functional and ergonomic furniture for home and work offices.',
    subcategories: [
      { title: 'Desks', description: 'Functional workspace solutions for productivity.' },
      { title: 'Office Chairs', description: 'Supportive seating for productive workdays.' },
      { title: 'Bookcases', description: 'Organized display for your favorite reads.' },
    ],
  },
  {
    title: 'Accent',
    description: 'Decorative furniture and pieces to add character to any space.',
    subcategories: [
      { title: 'Mirrors', description: 'Reflective accents that enhance light and space.' },
      { title: 'Accent Chairs', description: 'Stylish standalone chairs for personality.' },
      { title: 'Side Tables', description: 'Chic and functional small tables for decor or essentials.' },
    ],
  },
] as const

const categories = baseCategories.map(category => ({
  ...category,
  slug: category.title.split(' ').join('-').toLowerCase(),
  subcategories: category.subcategories.map(subcategory => ({
    slug: subcategory.title.split(' ').join('-').toLowerCase(),
    ...subcategory,
  })),
}))

export default categories
export type Category = (typeof baseCategories)[number]['title']
export type SubCategory = (typeof baseCategories)[number]['subcategories'][number]['title']
