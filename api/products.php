<?php
include_once 'db.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : 'list';

if ($method === 'GET') {
    if ($action === 'categories') {
        returnCategories();
    } elseif ($action === 'brands') {
        returnBrands();
    } else {
        // List products, optionally filtered
        $category = isset($_GET['category']) ? $_GET['category'] : '';
        $brand = isset($_GET['brand']) ? $_GET['brand'] : '';
        returnProducts($conn, $category, $brand);
    }
}

function returnCategories() {
    $categories = [
        ["id" => "men", "name" => "Men's Sector", "image" => "assets/images/cat_men.jpg"],
        ["id" => "women", "name" => "Women's Sector", "image" => "assets/images/cat_women.jpg"],
        ["id" => "kids", "name" => "Kids' Sector", "image" => "assets/images/cat_kids.jpg"],
        ["id" => "sports", "name" => "Sports", "image" => "assets/images/cat_sports.jpg"]
    ];
    echo json_encode($categories);
}

function returnBrands() {
    $brands = ["Nike", "Adidas", "Puma", "Reebok", "New Balance", "Vans"];
    echo json_encode($brands);
}

function returnProducts($conn, $category, $brand) {
    // Extended Mock Data (15 items)
    $mockProducts = [
        [
            "id" => 1,
            "name" => "Air Phantom 1",
            "price" => 120.00,
            "category" => "men",
            "brand" => "Nike",
            "image" => "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=500&q=80",
            "description" => "Sleek bluish-black design for the modern man. Features advanced cushioning."
        ],
        [
            "id" => 2,
            "name" => "Ash Runner X",
            "price" => 95.50,
            "category" => "women",
            "brand" => "Adidas",
            "image" => "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=80",
            "description" => "Lightweight runner with ash accents. Perfect for morning jogs."
        ],
        [
            "id" => 3,
            "name" => "Urban Glide",
            "price" => 110.00,
            "category" => "men",
            "brand" => "Puma",
            "image" => "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=500&q=80",
            "description" => "Street style meets comfort. Durable sole for city walking."
        ],
        [
            "id" => 4,
            "name" => "Course Classic",
            "price" => 85.00,
            "category" => "women",
            "brand" => "Nike",
            "image" => "https://images.unsplash.com/photo-1543508282-6319a3e2621f?auto=format&fit=crop&w=500&q=80",
            "description" => "Timeless design for everyday wear. Soft leather upper."
        ],
        [
            "id" => 5,
            "name" => "Future Rider",
            "price" => 130.00,
            "category" => "sports",
            "brand" => "Puma",
            "image" => "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=500&q=80",
            "description" => "High performance gear. Shock absorption technology included."
        ],
        [
            "id" => 6,
            "name" => "Old Skool",
            "price" => 70.00,
            "category" => "kids",
            "brand" => "Vans",
            "image" => "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=500&q=80",
            "description" => "Classic skate shoe for the little ones. Durable canvas."
        ],
        [
            "id" => 7,
            "name" => "Air Force One",
            "price" => 100.00,
            "category" => "men",
            "brand" => "Nike",
            "image" => "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=500&q=80",
            "description" => "The legend lives on. Classic white on white."
        ],
        [
            "id" => 8,
            "name" => "Ultraboost DNA",
            "price" => 180.00,
            "category" => "sports",
            "brand" => "Adidas",
            "image" => "https://images.unsplash.com/photo-1587563871167-1ee9c731aef4?auto=format&fit=crop&w=500&q=80",
            "description" => "Energy return like no other. Primeknit upper."
        ],
        [
            "id" => 9,
            "name" => "Classic Slip-On",
            "price" => 60.00,
            "category" => "women",
            "brand" => "Vans",
            "image" => "https://images.unsplash.com/photo-1560769629-975e13f0c470?auto=format&fit=crop&w=500&q=80",
            "description" => "No laces, no problems. Iconic checkerboard pattern."
        ],
        [
            "id" => 10,
            "name" => "NB 574 Core",
            "price" => 89.99,
            "category" => "men",
            "brand" => "New Balance",
            "image" => "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=500&q=80",
            "description" => "The most New Balance shoe ever. Versatile and reliable."
        ],
        [
            "id" => 11,
            "name" => "Club C 85",
            "price" => 75.00,
            "category" => "women",
            "brand" => "Reebok",
            "image" => "https://images.unsplash.com/photo-1584735175315-9d5816380698?auto=format&fit=crop&w=500&q=80",
            "description" => "Court-inspired style. Soft leather feel."
        ],
        [
            "id" => 12,
            "name" => "Kyrie Flytrap",
            "price" => 90.00,
            "category" => "kids",
            "brand" => "Nike",
            "image" => "https://images.unsplash.com/photo-1518002171953-a080ee32280d?auto=format&fit=crop&w=500&q=80",
            "description" => "Built for quick cuts on the court. Secure fit."
        ],
        [
            "id" => 13,
            "name" => "Stan Smith",
            "price" => 85.00,
            "category" => "men",
            "brand" => "Adidas",
            "image" => "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=500&q=80",
            "description" => "Minimalist tennis style. 50% recycled materials."
        ],
        [
            "id" => 14,
            "name" => "Suede Classic",
            "price" => 70.00,
            "category" => "women",
            "brand" => "Puma",
            "image" => "https://images.unsplash.com/photo-1605034313761-73ea4a0cfbf3?auto=format&fit=crop&w=500&q=80",
            "description" => "The icon that started it all. Smooth suede."
        ],
        [
            "id" => 15,
            "name" => "Chuck Taylor",
            "price" => 65.00,
            "category" => "kids",
            "brand" => "Converse",
            "image" => "https://images.unsplash.com/photo-1607522370275-f14206c11517?auto=format&fit=crop&w=500&q=80",
            "description" => "The one and only. High top canvas."
        ],
        [
            "id" => 16,
            "name" => "Air Max 90",
            "price" => 130.00,
            "category" => "men",
            "brand" => "Nike",
            "image" => "https://images.unsplash.com/photo-1547844153-ac53f938f978?auto=format&fit=crop&w=500&q=80",
            "description" => "Retro style with modern comfort. Visible Air unit."
        ],
        [
            "id" => 17,
            "name" => "Superstar",
            "price" => 90.00,
            "category" => "women",
            "brand" => "Adidas",
            "image" => "https://images.unsplash.com/photo-1516478177764-9fe5bd7e9717?auto=format&fit=crop&w=500&q=80",
            "description" => "The shell toe icon. Leather upper."
        ],
        [
            "id" => 18,
            "name" => "RS-X Puzzle",
            "price" => 110.00,
            "category" => "men",
            "brand" => "Puma",
            "image" => "https://images.unsplash.com/photo-1629193237583-b9d97a5b6d51?auto=format&fit=crop&w=500&q=80",
            "description" => "Bold puzzle design. Bulky silhouette."
        ],
        [
            "id" => 19,
            "name" => "Zoom Pegasus",
            "price" => 125.00,
            "category" => "sports",
            "brand" => "Nike",
            "image" => "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=500&q=80",
            "description" => "Your workhorse with wings. Responsive foam."
        ],
        [
            "id" => 20,
            "name" => "Sk8-Hi",
            "price" => 75.00,
            "category" => "men",
            "brand" => "Vans",
            "image" => "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=500&q=80",
            "description" => "Legendary high top. Sturdy suede and canvas."
        ],
        [
            "id" => 21,
            "name" => "NMD_R1",
            "price" => 140.00,
            "category" => "men",
            "brand" => "Adidas",
            "image" => "https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?auto=format&fit=crop&w=500&q=80",
            "description" => "Streamlined shape with Boost cushioning."
        ],
        [
            "id" => 22,
            "name" => "Cali Star",
            "price" => 80.00,
            "category" => "women",
            "brand" => "Puma",
            "image" => "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=500&q=80", // Reusing image with different context for variety
            "description" => "West Coast vibes. Stacked sole."
        ],
        [
            "id" => 23,
            "name" => "Free Run 5.0",
            "price" => 100.00,
            "category" => "sports",
            "brand" => "Nike",
            "image" => "https://images.unsplash.com/photo-1588117260148-447884962bc5?auto=format&fit=crop&w=500&q=80",
            "description" => "Flexible outsole for natural movement."
        ],
        [
            "id" => 24,
            "name" => "Gazelle",
            "price" => 80.00,
            "category" => "women",
            "brand" => "Adidas",
            "image" => "https://images.unsplash.com/photo-1579338559194-a162d8417876?auto=format&fit=crop&w=500&q=80",
            "description" => "The ultimate suede sneaker. Retro vibes."
        ],
        [
            "id" => 25,
            "name" => "Authentic",
            "price" => 55.00,
            "category" => "kids",
            "brand" => "Vans",
            "image" => "https://images.unsplash.com/photo-1520256862855-398228c45660?auto=format&fit=crop&w=500&q=80",
            "description" => "The original Vans style. Simple and low profile."
        ]
    ];


    // Filter Logic (In-memory for mock)
    $filtered = array_filter($mockProducts, function($p) use ($category, $brand) {
        $matchCat = empty($category) || $p['category'] === $category;
        $matchBrand = empty($brand) || $p['brand'] === $brand;
        return $matchCat && $matchBrand;
    });

    echo json_encode(array_values($filtered));
}

?>
