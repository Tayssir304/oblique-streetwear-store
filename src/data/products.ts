export type ProductCategory =
  | 'All'
  | 'Hoodies & Sweats'
  | 'Pants & Denim'
  | 'Tees & Outerwear'
  | 'Footwear & Gear';

export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  garmentType: string;
  category: Exclude<ProductCategory, 'All'>;
  price: number;
  image: string;
  colors: ProductColor[];
  sizes: string[];
  fit: string;
  fabric: string;
  description: string;
  details: string[];
  badge?: string;
}

export const EDITORIAL_LOOKBOOK_IMAGE =
  '/src/assets/images/editorial_lookbook_wide_1795625747574.jpg';

export const PRODUCTS: Product[] = [
  {
    id: 'kuro-boxy-hoodie',
    slug: 'kuro-500gsm-boxy-hoodie',
    name: 'Kuro 500gsm Boxy Hoodie',
    garmentType: 'Oversized Hoodie',
    category: 'Hoodies & Sweats',
    price: 165,
    image: '/src/assets/images/hoodie_oversized_charcoal_1795625742394.jpg',
    colors: [
      { name: 'Washed Charcoal', hex: '#262629' },
      { name: 'Obsidian Black', hex: '#111113' },
      { name: 'Concrete Ash', hex: '#52525B' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    fit: 'Oversized Drop-Shoulder',
    fabric: '500gsm Organic French Terry',
    description:
      'Engineered with an exaggerated drop-shoulder silhouette and a structured double-lined capuche that holds its architectural volume. Enzyme-washed for a lived-in matte charcoal finish.',
    details: [
      '100% heavyweight ring-spun cotton (500gsm)',
      'Double-layered structured hood with zero drawstrings',
      'Dropped shoulders with wide ribbed cuffs and hem',
      'Garment-dyed and sun-faded finish',
    ],
    badge: 'Core Drop',
  },
  {
    id: 'slate-zip-hoodie',
    slug: 'slate-two-way-zip-hoodie',
    name: 'Slate Two-Way Zip Hoodie',
    garmentType: 'Zip-Up Hoodie',
    category: 'Hoodies & Sweats',
    price: 180,
    image: '/src/assets/images/hoodie_zip_slate_1795625742842.jpg',
    colors: [
      { name: 'Distressed Slate', hex: '#525860' },
      { name: 'Faded Onyx', hex: '#1C1D20' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    fit: 'Boxy Cropped Fit',
    fabric: '480gsm Sun-Faded Loopback',
    description:
      'Cropped right at the belt line for effortless layering over oversized tees and baggy denim. Equipped with custom brushed steel two-way hardware and subtle distressed seam abrasion.',
    details: [
      'Custom YKK Excella two-way brushed silver zipper',
      'Boxy torso with slightly elongated sleeves',
      'Hand-distressed cuffs and shoulder seams',
      'Pre-shrunk heavyweight loopback fleece',
    ],
    badge: 'New Release',
  },
  {
    id: 'raw-baggy-denim',
    slug: 'vintage-indigo-baggy-jeans',
    name: '80s Indigo Baggy Carpenter Denim',
    garmentType: 'Baggy Jeans',
    category: 'Pants & Denim',
    price: 210,
    image: '/src/assets/images/jeans_baggy_indigo_1795625742261.jpg',
    colors: [
      { name: 'Vintage Indigo', hex: '#374B63' },
      { name: 'Dirty Rinse Black', hex: '#1F2124' },
    ],
    sizes: ['28', '30', '32', '34', '36'],
    fit: 'Ultra-Baggy Wide Stack',
    fabric: '14.5oz Japanese Cotton Denim',
    description:
      'Cut with a generous 24-inch leg opening designed to stack cleanly over chunky trail sneakers. Features reinforced carpenter utility panels, subtle whiskering, and antique copper rivets.',
    details: [
      '14.5oz rigid non-stretch selvedge denim',
      'Double-stitched utility side pockets & hammer loop',
      'Vintage enzyme stone wash with hand-sanded whiskers',
      'Custom debossed leather rear waistband patch',
    ],
    badge: 'Bestseller',
  },
  {
    id: 'architectural-wide-pants',
    slug: 'architectural-pleated-wide-pants',
    name: 'Architectural Pleated Wide Trousers',
    garmentType: 'Wide-Leg Pants',
    category: 'Pants & Denim',
    price: 195,
    image: '/src/assets/images/pants_wide_pleated_1795625750914.jpg',
    colors: [
      { name: 'Pitch Black', hex: '#101012' },
      { name: 'Graphite', hex: '#313238' },
    ],
    sizes: ['28', '30', '32', '34', '36'],
    fit: 'Fluid Extra-Wide Leg',
    fabric: '320gsm Technical Wool Blend',
    description:
      'Tailoring meets street proportion. Deep twin front pleats create sweeping movement in stride, finished with an internal drawstring waist and crisp drape.',
    details: [
      'Crease-resistant technical suiting weave',
      'Deep double front pleats for expansive volume',
      'Concealed interior drawcord + belt loops',
      'Full-length wide hem with reinforced heel tape',
    ],
  },
  {
    id: 'ripstop-parachute-cargos',
    slug: 'ripstop-parachute-cargo-pants',
    name: 'Ripstop Parachute Utility Cargos',
    garmentType: 'Cargo Pants',
    category: 'Pants & Denim',
    price: 225,
    image: '/src/assets/images/pants_cargo_olive_1795625743823.jpg',
    colors: [
      { name: 'Olive Charcoal', hex: '#343A30' },
      { name: 'Matte Black', hex: '#131416' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    fit: 'Relaxed Articulated Cut',
    fabric: 'Water-Repellent Nylon Ripstop',
    description:
      'Multi-pocket technical cargos built with 3D gusseted thigh compartments, articulated knee pleats, detachable webbing straps, and cinchable bungee ankle toggles.',
    details: [
      '8-pocket tactical configuration with concealed snaps',
      'Durable water-repellent (DWR) crinkle nylon',
      'Articulated knee darts for unrestricted movement',
      'Adjustable shock-cord cuffs to switch wide or tapered',
    ],
    badge: 'Limited Run',
  },
  {
    id: 'urban-structure-tee',
    slug: 'urban-structure-graphic-tee',
    name: 'Urban Structure Heavyweight Tee',
    garmentType: 'Graphic T-Shirt',
    category: 'Tees & Outerwear',
    price: 78,
    image: '/src/assets/images/tee_graphic_bone_1795625744610.jpg',
    colors: [
      { name: 'Bone Off-White', hex: '#EAE6DF' },
      { name: 'Washed Ink', hex: '#19191D' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    fit: 'Boxy Drop-Shoulder',
    fabric: '310gsm Combed Jersey',
    description:
      'Cut from dense 310gsm carded cotton jersey that drapes cleanly off the chest without clinging. Features high-density water-based architectural screenprint graphics.',
    details: [
      'Thick 1.2-inch mock-ribbed collar that never sags',
      'Soft-hand water-based multi-layer screenprint',
      'Slightly cropped body with extended elbow-length sleeves',
      '100% organic heavyweight cotton jersey',
    ],
  },
  {
    id: 'acid-espresso-crewneck',
    slug: 'acid-wash-espresso-sweatshirt',
    name: 'Acid-Wash Espresso Crewneck',
    garmentType: 'Oversized Sweatshirt',
    category: 'Hoodies & Sweats',
    price: 145,
    image: '/src/assets/images/sweatshirt_oversized_ash_1795625744305.jpg',
    colors: [
      { name: 'Espresso Ash', hex: '#3B322E' },
      { name: 'Mineral Slate', hex: '#3F434A' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    fit: 'Oversized Reverse-Weave',
    fabric: '500gsm Acid-Washed Fleece',
    description:
      'Vintage athletic proportions reimagined with an acid-washed espresso patina, tonal V-insert collar detailing, and cross-grain side gussets built to keep its boxy structure.',
    details: [
      '500gsm heavy combed cotton fleece',
      'Individual potassium spray wash—each piece unique',
      'Reverse-weave ribbed side panels',
      'Reinforced coverstitch seams throughout',
    ],
  },
  {
    id: 'waxed-canvas-jacket',
    slug: 'waxed-canvas-work-jacket',
    name: 'Waxed Canvas Cropped Work Jacket',
    garmentType: 'Outerwear Jacket',
    category: 'Tees & Outerwear',
    price: 290,
    image: '/src/assets/images/jacket_cropped_work_1795625745035.jpg',
    colors: [
      { name: 'Oil-Black Canvas', hex: '#1A1B1E' },
      { name: 'Raw Earth', hex: '#3C3630' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    fit: 'Boxy Cropped Outerwear',
    fabric: '16oz Waxed Cotton Duck',
    description:
      'Heavy-duty utility jacket cut in a contemporary boxy crop with matte snap storm placket, oversized dual chest flap pockets, and quilted satin interior lining.',
    details: [
      '16oz weather-resistant waxed duck canvas',
      'Matte black coated snap hardware + concealed zip',
      'Quilted insulated interior with internal chest pocket',
      'Distressed edges that patina naturally with wear',
    ],
    badge: 'Archive Piece',
  },
  {
    id: 'apex-lugged-sneakers',
    slug: 'apex-trail-lugged-sneakers',
    name: 'Apex Trail Lugged Sneakers',
    garmentType: 'Chunky Sneakers',
    category: 'Footwear & Gear',
    price: 260,
    image: '/src/assets/images/sneakers_chunky_obsidian_1795625745805.jpg',
    colors: [
      { name: 'Obsidian / Cream', hex: '#1B1C20' },
      { name: 'Triple Chalk', hex: '#D8D6D0' },
    ],
    sizes: ['EU 39', 'EU 40', 'EU 41', 'EU 42', 'EU 43', 'EU 44', 'EU 45'],
    fit: 'True to Size (Wide Toe Box)',
    fabric: 'Italian Suede & Ballistic Mesh',
    description:
      'Sculptural low-top trail silhouette pairing plush obsidian suede overlays with breathable cream open mesh and a dual-density lugged outsole engineered for urban terrain.',
    details: [
      'Vibram-inspired custom high-traction rubber outsole',
      'Quick-cinch toggle lace system + spare tonal laces',
      'Molded EVA cushioned midsole for all-day comfort',
      'Reflective 3M heel pull tab',
    ],
    badge: 'Drop 04 Hero',
  },
  {
    id: 'ballistic-sling-set',
    slug: 'ballistic-crossbody-beanie-pack',
    name: 'Utility Crossbody & Ribbed Beanie Kit',
    garmentType: 'Trendy Accessories',
    category: 'Footwear & Gear',
    price: 120,
    image: '/src/assets/images/accessory_crossbody_beanie_1795625746551.jpg',
    colors: [
      { name: 'Stealth Black / Silver', hex: '#141518' },
      { name: 'Charcoal / Chrome', hex: '#383B42' },
    ],
    sizes: ['One Size'],
    fit: 'Adjustable Utility Fit',
    fabric: '1680D Ballistic Nylon & Merino Knit',
    description:
      'Complete daily street carry bundle: weatherproof 1680D ballistic nylon crossbody bag with Fidlock buckle, brushed steel curb-link strap accent, and heavyweight fisherman ribbed beanie.',
    details: [
      '1680D water-resistant ballistic nylon sling (4.5L)',
      'Detachable brushed stainless steel curb chain detail',
      '100% extra-fine ribbed merino-blend cuff beanie',
      'Internal padded sleeve + quick-access front zip',
    ],
  },
];
