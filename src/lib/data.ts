export interface Product {
    id: string;
    title: string;
    description: string;
    price: number;
    category: 'Fireplaces' | 'Doors' | 'Lighting' | 'Garden' | 'Furniture';
    image: string;
    status: 'available' | 'sold';
    dimensions?: string;
}

export const products: Product[] = [
    {
        id: '1',
        title: 'Victorian Cast Iron Combination Fireplace',
        description: 'A stunning original Victorian cast iron combination fireplace with intricate fruit and floral detailing. Fully restored and burnished.',
        price: 850,
        category: 'Fireplaces',
        image: 'https://images.unsplash.com/photo-1545082195-2fe9b5b53d4c?auto=format&fit=crop&q=80&w=800',
        status: 'available',
        dimensions: 'H: 102cm x W: 76cm'
    },
    {
        id: '2',
        title: 'Reclaimed Victorian 4-Panel Pine Door',
        description: 'Original 19th-century stripped pine door. Classic 4-panel design, ready for waxing or painting.',
        price: 180,
        category: 'Doors',
        image: 'https://images.unsplash.com/photo-1506306462723-5e396edb4a69?auto=format&fit=crop&q=80&w=800',
        status: 'available',
        dimensions: 'H: 198cm x W: 76cm'
    },
    {
        id: '3',
        title: 'Edwardian Tiled Insert',
        description: 'Beautiful original Edwardian tiled insert with original tube-lined tiles in art nouveau style.',
        price: 1200,
        category: 'Fireplaces',
        image: 'https://images.unsplash.com/photo-1623920959223-28b9391ab6ce?auto=format&fit=crop&q=80&w=800',
        status: 'available',
        dimensions: 'H: 96cm x W: 96cm'
    },
    {
        id: '4',
        title: 'Stone Garden Trough',
        description: 'Hand-carved sandstone trough, perfect for a garden planter. Weathered beautifully over time.',
        price: 450,
        category: 'Garden',
        image: 'https://images.unsplash.com/photo-1598256989495-2cfc804e12e0?auto=format&fit=crop&q=80&w=800',
        status: 'available',
        dimensions: 'L: 120cm x D: 40cm'
    },
    {
        id: '5',
        title: 'Ornate Cast Iron Radiator',
        description: 'Original distinct ornate cast iron radiator. Pressure tested and ready to plumb in.',
        price: 550,
        category: 'Furniture',
        image: 'https://images.unsplash.com/photo-1546944365-d68a9fc4c769?auto=format&fit=crop&q=80&w=800',
        status: 'sold',
        dimensions: 'W: 80cm x H: 75cm'
    },
    {
        id: '6',
        title: 'Stained Glass Panel',
        description: 'Geometric Art Deco stained glass panel reclaimed from details of a 1930s front door.',
        price: 295,
        category: 'Doors',
        image: 'https://images.unsplash.com/photo-1560124890-449e701e612f?auto=format&fit=crop&q=80&w=800',
        status: 'available',
        dimensions: 'H: 60cm x W: 40cm'
    },
    {
        id: '7',
        title: 'Georgian Brass Fender',
        description: 'A heavy polished brass fender from the Georgian period. Pierced fretwork design with lion paw feet.',
        price: 325,
        category: 'Fireplaces',
        image: 'https://images.unsplash.com/photo-1628744876497-eb30460be9f6?auto=format&fit=crop&q=80&w=800',
        status: 'available',
        dimensions: 'W: 135cm'
    },
    {
        id: '8',
        title: 'Reclaimed Oak Beams',
        description: 'Solid oak structural beams reclaimed from a French barn. Full of character and age.',
        price: 120,
        category: 'Garden',
        image: 'https://images.unsplash.com/photo-1589129140855-3943ed2987eb?auto=format&fit=crop&q=80&w=800',
        status: 'available',
        dimensions: 'L: 2.2m x W: 20cm'
    }
];
