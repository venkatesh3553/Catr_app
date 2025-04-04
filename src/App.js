import './App.css'
const React = require('react');
const { useState, useEffect } = React;

const PRODUCTS = [
  { id: 1, name: "Laptop", price: 500 },
  { id: 2, name: "Smartphone", price: 300 },
  { id: 3, name: "Headphones", price: 100 },
  { id: 4, name: "Smartwatch", price: 150 },
];

const FREE_GIFT = { id: 99, name: "Wireless Mouse", price: 0 };
const THRESHOLD = 1000;

function App() {
  const [quantities, setQuantities] = useState({});
  const [cart, setCart] = useState([]);
  const [showGiftMsg, setShowGiftMsg] = useState(false);

  const updateQuantity = (id, change) => {
    setQuantities(prev => ({
      ...prev,
      [id]: Math.max((prev[id] || 0) + change, 0),
    }));
  };

  const addToCart = (product) => {
    const qty = quantities[product.id] || 1;
    if (qty === 0) return;

    setCart(prev => {
      const existing = prev.find(p => p.id === product.id);
      if (existing) {
        return prev.map(p =>
          p.id === product.id ? { ...p, quantity: p.quantity + qty } : p
        );
      }
      return [...prev, { ...product, quantity: qty }];
    });

    setQuantities(prev => ({ ...prev, [product.id]: 0 }));
  };

  const updateCartQty = (id, change) => {
    setCart(prev =>
      prev
        .map(item =>
          item.id === id ? { ...item, quantity: Math.max(item.quantity + change, 1) } : item
        )
    );
  };

  const removeFromCart = (id) => {
    if (id === FREE_GIFT.id) return; // Prevent gift removal
    setCart(prev => prev.filter(p => p.id !== id));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const hasGift = cart.some(p => p.id === FREE_GIFT.id);

  useEffect(() => {
    if (subtotal >= THRESHOLD && !hasGift) {
      setCart(prev => [...prev, { ...FREE_GIFT, quantity: 1 }]);
      setShowGiftMsg(true);
      setTimeout(() => setShowGiftMsg(false), 3000);
    } else if (subtotal < THRESHOLD && hasGift) {
      setCart(prev => prev.filter(p => p.id !== FREE_GIFT.id));
    }
  }, [subtotal]);

  return React.createElement('div', { className: 'app' },
    React.createElement('h1', null, 'Shopping List'),
    React.createElement('card-bg-div', { className: 'products' },
      React.createElement('p', null, 'Products'),
      PRODUCTS.map(product =>
        
        React.createElement('card-div', { key: product.id, className: 'product' },
          React.createElement('div', null, product.name + ' - $' + product.price),
          
          React.createElement('div', { className: 'quantity-controls' },
            // React.createElement('button-minus', { onClick: () => updateQuantity(product.id, -1) }, '-'),
            // React.createElement('span', null, quantities[product.id] || 0),
            // React.createElement('button-plus', { onClick: () => updateQuantity(product.id, 1) }, '+')
          ),
          React.createElement('button', { onClick: () => addToCart(product) }, 'Add to Cart')
        )
      )
    ),
    React.createElement('p', null, 'Cart Summary'),
    React.createElement('div', { className: 'progress-bar' },
      
      React.createElement('div', {
        className: 'progress',
        style: { width: Math.min((subtotal / THRESHOLD) * 100, 100) + '%' }
      }),
      React.createElement('span', null,
        subtotal >= THRESHOLD
          ? '🎁 You unlocked a free gift!'
          : `$${subtotal} / $${THRESHOLD} to unlock gift`
      ),
      

    ),
    showGiftMsg && React.createElement('div', { className: 'gift-msg' }, '🎉 Wireless Mouse added to cart as a free gift!'),
    React.createElement('p', null, 'Cart Items'),
    React.createElement('div', { className: 'cart' },

      cart.map(item =>
        React.createElement('div', { key: item.id, className: 'cart-item' },
          React.createElement('span', null, `${item.name} - $${item.price} x ${item.quantity}`),
          item.id !== FREE_GIFT.id && React.createElement('div', { className: 'cart-controls' },
            
            React.createElement('button-remove', { onClick: () => updateCartQty(item.id, -1) }, '-'),
            React.createElement('span',null, `${item.quantity}`),
            
            React.createElement('button-add', { onClick: () => updateCartQty(item.id, 1) }, '+'),
            
            React.createElement('button-delete', { onClick: () => removeFromCart(item.id) }, 'Remove')
          ),
          
        )
      )
    )
  );
}

export default App