import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { Product, Order, Review } from './src/types';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const REVIEWS: Review[] = [
  {
    id: 'r1',
    productId: '1',
    userName: 'Alex Chen',
    rating: 5,
    comment: 'Best headphones I have ever owned. The noise cancellation is unreal.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'r2',
    productId: '1',
    userName: 'Sarah Jenkins',
    rating: 4,
    comment: 'Sound quality is great, but they get a bit warm after 4 hours of use.',
    createdAt: new Date().toISOString()
  }
];

const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Luminary Ultra Headphones',
    price: 24999,
    category: 'Audio',
    description: 'Experience pure sound with active noise cancellation and 40-hour battery life. Designed for comfort and cinematic clarity.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1000',
    highlights: ['Active Noise Cancellation', '40h Battery Life', 'Wireless Bluetooth 5.2', 'Spatial Audio Support'],
    specs: {
      'Driver Size': '40mm',
      'Battery Life': '40 Hours',
      'Connectivity': 'Bluetooth 5.2',
      'Weight': '250g',
      'Noise Cancelling': 'Yes (Active)'
    },
    inStock: true
  },
  {
    id: '2',
    name: 'Zenith Smart Watch',
    price: 15999,
    category: 'Wearables',
    description: 'A masterpiece of engineering and style. Track your fitness, monitor heart rate, and stay connected with a stunning OLED display.',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1000',
    highlights: ['OLED Retina Display', 'Waterproof (50m)', 'ECG & SpO2 Tracking', '7-Day Battery'],
    specs: {
      'Display': 'OLED 1.5"',
      'Battery Life': '7 Days',
      'Water Resistance': '50m',
      'Sensors': 'ECG, Heart Rate, SpO2',
      'GPS': 'Built-in'
    },
    inStock: true
  },
  {
    id: '3',
    name: 'Nomad Canvas Backpack',
    price: 4999,
    category: 'Accessories',
    description: 'Durable, waterproof, and designed for the modern explorer. Featuring a padded laptop sleeve and hidden security pockets.',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=1000',
    highlights: ['Waxed Canvas Material', '15" Laptop Compartment', 'Water-Resistant Zippers', 'Ergonomic Straps'],
    specs: {
      'Material': 'Waxed Canvas',
      'Capacity': '25 Liters',
      'Laptop Size': 'Up to 15"',
      'Pockets': '8 Total',
      'Weight': '1.2kg'
    },
    inStock: true
  },
  {
    id: '4',
    name: 'Titan Pro Gaming Mouse',
    price: 8999,
    category: 'Gaming',
    description: 'Precision redefined. With a 26k DPI sensor and customizable RGB lighting, the Titan Pro is built for competitive play.',
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=1000',
    highlights: ['26,000 DPI Sensor', 'Ultra-Lightweight (58g)', 'Optical Switches', 'Wireless/Wired Mode'],
    specs: {
      'Sensor': 'Titan 26K Optical',
      'DPI': '26,000',
      'Weight': '58g',
      'Battery Life': '120 Hours',
      'Buttons': '6 Programmable'
    },
    inStock: false
  },
  {
    id: '5',
    name: 'Minimalist Walnut Desk',
    price: 45000,
    category: 'Home Office',
    description: 'Handcrafted from solid walnut, this desk combines timeless elegance with functional cable management for a clean workspace.',
    image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&q=80&w=1000',
    highlights: ['Solid Walnut Wood', 'Integrated Cable Tray', 'Hidden Drawer', 'Sustainably Sourced'],
    specs: {
      'Material': 'Solid Walnut',
      'Dimensions': '120cm x 60cm x 75cm',
      'Finish': 'Natural Oil',
      'Assembly': 'Required',
      'Weight Capacity': '80kg'
    },
    inStock: true
  },
  {
    id: '6',
    name: 'Aero Pure Humidifier',
    price: 6499,
    category: 'Home Office',
    description: 'Breathe easier with the Aero Pure. Advanced ultrasonic technology ensures silent operation and optimal humidity levels.',
    image: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&q=80&w=1000',
    highlights: ['Ultrasonic Silent Tech', 'Warm/Cool Mist', 'Aromatherapy Drawer', 'Smart Humidity Sensor'],
    specs: {
      'Water Tank': '4 Liters',
      'Coverage': '40 sq. meters',
      'Mist Type': 'Ultrasonic',
      'Run Time': 'Up to 24 hours',
      'Auto-Off': 'Yes'
    },
    inStock: false
  }
];

const ORDERS: Order[] = [];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get('/api/products', (req, res) => {
    res.json(PRODUCTS);
  });

  app.get('/api/orders', (req, res) => {
    res.json(ORDERS);
  });

  app.get('/api/products/:id', (req, res) => {
    const product = PRODUCTS.find(p => p.id === req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    
    // Attach reviews to product
    const productReviews = REVIEWS.filter(r => r.productId === product.id);
    res.json({ ...product, reviews: productReviews });
  });

  app.post('/api/reviews', (req, res) => {
    const { productId, userName, rating, comment } = req.body;
    
    if (!productId || !userName || !rating || !comment) {
      return res.status(400).json({ error: 'Missing review details' });
    }

    const newReview: Review = {
      id: `REV-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      productId,
      userName,
      rating,
      comment,
      createdAt: new Date().toISOString()
    };

    REVIEWS.push(newReview);
    res.status(201).json(newReview);
  });

  app.post('/api/orders', (req, res) => {
    const { items, total, customer } = req.body;
    
    if (!items || !total || !customer) {
      return res.status(400).json({ error: 'Missing order details' });
    }

    const newOrder: Order = {
      id: `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      items,
      total,
      customer,
      status: 'processing',
      createdAt: new Date().toISOString()
    };

    ORDERS.push(newOrder);
    res.status(201).json(newOrder);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
