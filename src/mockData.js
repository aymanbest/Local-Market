export const mockUsers = [
  { id: 1, username: 'customer@example.com', password: 'customer123', role: 'customer', name: 'John Doe' },
  { id: 2, username: 'producer@example.com', password: 'producer123', role: 'producer', name: 'Jane Smith' },
  { id: 3, username: 'admin@example.com', password: 'admin123', role: 'admin', name: 'Admin User' },
];

export const mockProducts = [
  { id: 1, name: 'Fresh Apples', price: 2.99, image: 'https://via.placeholder.com/150', producer: 2, inventory: 100 },
  { id: 2, name: 'Organic Carrots', price: 1.99, image: 'https://via.placeholder.com/150', producer: 2, inventory: 150 },
  { id: 3, name: 'Free-range Eggs', price: 4.99, image: 'https://via.placeholder.com/150', producer: 2, inventory: 50 },
  { id: 4, name: 'Artisan Bread', price: 3.99, image: 'https://via.placeholder.com/150', producer: 2, inventory: 30 },
];

export const mockOrders = [
  { id: 1, customer: 1, products: [{ id: 1, quantity: 2 }, { id: 3, quantity: 1 }], status: 'Delivered', total: 10.97 },
  { id: 2, customer: 1, products: [{ id: 2, quantity: 3 }, { id: 4, quantity: 1 }], status: 'Processing', total: 9.96 },
];

export const mockTransactions = [
  { id: 1, date: '2023-05-01', customer: 'John Doe', producer: 'Farm Fresh', amount: 50.25, status: 'Completed' },
  { id: 2, date: '2023-05-02', customer: 'Jane Smith', producer: 'Organic Delights', amount: 35.99, status: 'Pending' },
  { id: 3, date: '2023-05-03', customer: 'Bob Johnson', producer: 'Farm Fresh', amount: 22.50, status: 'Completed' },
  { id: 4, date: '2023-05-04', customer: 'Alice Brown', producer: 'Green Acres', amount: 41.75, status: 'Completed' },
  { id: 5, date: '2023-05-05', customer: 'Charlie Davis', producer: 'Organic Delights', amount: 18.99, status: 'Failed' },
];

export const mockAnalytics = {
  salesByCategory: [
    { name: 'Fruits', value: 400 },
    { name: 'Vegetables', value: 300 },
    { name: 'Dairy', value: 200 },
    { name: 'Bakery', value: 100 },
  ],
  revenueByMonth: [
    { name: 'Jan', revenue: 4000 },
    { name: 'Feb', revenue: 3000 },
    { name: 'Mar', revenue: 5000 },
    { name: 'Apr', revenue: 4500 },
    { name: 'May', revenue: 6000 },
  ],
  topProducers: [
    { name: 'Farm Fresh', sales: 12000 },
    { name: 'Organic Delights', sales: 10000 },
    { name: 'Green Acres', sales: 8000 },
    { name: 'Sunny Fields', sales: 6000 },
  ],
};

export const mockProducerProducts = [
  { 
    id: 1, 
    name: 'Fresh Apples', 
    category: 'Fruits',
    price: 2.99, 
    inventory: 100, 
    sales: 50,
    active: true,
    image: 'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?q=80&w=250',
    description: 'Fresh, crispy apples from local orchards'
  },
  { 
    id: 2, 
    name: 'Organic Carrots', 
    category: 'Vegetables',
    price: 1.99, 
    inventory: 150, 
    sales: 75,
    active: true,
    image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?q=80&w=250',
    description: 'Farm-fresh organic carrots'
  },
  { 
    id: 3, 
    name: 'Free-range Eggs', 
    category: 'Dairy & Eggs',
    price: 4.99, 
    inventory: 50, 
    sales: 25,
    active: true,
    image: 'https://images.unsplash.com/photo-1518569656558-1f25e69d93d7?q=80&w=250',
    description: 'Farm-fresh free range eggs'
  },
  { 
    id: 4, 
    name: 'Artisan Bread', 
    category: 'Bakery',
    price: 3.99, 
    inventory: 5, 
    sales: 15,
    active: true,
    image: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?q=80&w=250',
    description: 'Freshly baked artisan bread'
  },
];

export const mockProducerOrders = [
  { id: 1, customer: 'John Doe', products: ['Fresh Apples', 'Free-range Eggs'], total: 15.97, status: 'Delivered' },
  { id: 2, customer: 'Jane Smith', products: ['Organic Carrots', 'Artisan Bread'], total: 9.97, status: 'Processing' },
  { id: 3, customer: 'Bob Johnson', products: ['Fresh Apples', 'Organic Carrots'], total: 7.98, status: 'Pending' },
];

export const mockProducerAnalytics = {
  salesByProduct: [
    { name: 'Fresh Apples', value: 400 },
    { name: 'Organic Carrots', value: 300 },
    { name: 'Free-range Eggs', value: 200 },
    { name: 'Artisan Bread', value: 100 },
  ],
  revenueByMonth: [
    { name: 'Jan', revenue: 1000 },
    { name: 'Feb', revenue: 1500 },
    { name: 'Mar', revenue: 1200 },
    { name: 'Apr', revenue: 1800 },
    { name: 'May', revenue: 2000 },
  ],
};

export const mockCart = [
  { id: 1, name: 'Fresh Apples', price: 2.99, quantity: 2 },
  { id: 3, name: 'Free-range Eggs', price: 4.99, quantity: 1 },
];

export const mockOrderHistory = [
  { id: 1, date: '2023-05-01', products: ['Fresh Apples', 'Free-range Eggs'], total: 10.97, status: 'Delivered' },
  { id: 2, date: '2023-05-10', products: ['Organic Carrots', 'Artisan Bread'], total: 9.97, status: 'Processing' },
];

export const mockNotifications = [
  {
    id: 1,
    type: 'lowStock',
    title: 'Low Stock Alert',
    message: 'Organic Apples are running low (5 units remaining)',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    read: false,
    productId: 1
  },
  {
    id: 2,
    type: 'newOrder',
    title: 'New Order Received',
    message: 'Order #1234 needs processing',
    timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    read: false,
    orderId: 1234
  },
  {
    id: 3,
    type: 'review',
    title: 'New Product Review',
    message: 'Fresh Strawberries received a 5-star review',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    read: true,
    productId: 2
  },
  {
    id: 4,
    type: 'sale',
    title: 'Sales Milestone',
    message: 'Organic Bananas reached 100 sales!',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
    read: true,
    productId: 3
  }
];

export const mockNotificationsadmin = [
  {
    id: 1,
    type: 'newUser',
    title: 'New User Registration',
    message: 'A new producer account requires approval',
    timestamp: Date.now() - 1000 * 60 * 30, // 30 minutes ago
    read: false
  },
  {
    id: 2,
    type: 'security',
    title: 'Security Alert',
    message: 'Multiple failed login attempts detected',
    timestamp: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
    read: false
  },
  {
    id: 3,
    type: 'system',
    title: 'System Update',
    message: 'New platform features available',
    timestamp: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
    read: true
  }
];

