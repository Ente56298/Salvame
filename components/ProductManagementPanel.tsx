import React, { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { geminiService } from '../services/geminiService';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
}

interface Order {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  customerName: string;
  status: 'Pendiente' | 'En Proceso' | 'Completado';
  date: string;
  total: number;
}

const ProductManagementPanel = () => {
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    stock: 0
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);

  useEffect(() => {
    loadProducts();
    loadOrders();
  }, []);

  const loadProducts = async () => {
    const businessProducts = await authService.getProductsByBusinessId('current-business');
    setProducts(businessProducts);
  };

  const loadOrders = () => {
    const mockOrders: Order[] = [
      {
        id: '1',
        productId: 'p1',
        productName: 'Cambio de Aceite',
        quantity: 1,
        customerName: 'Juan Pérez',
        status: 'Pendiente',
        date: new Date().toLocaleDateString(),
        total: 350
      },
      {
        id: '2',
        productId: 'p2',
        productName: 'Revisión de Frenos',
        quantity: 1,
        customerName: 'María García',
        status: 'En Proceso',
        date: new Date().toLocaleDateString(),
        total: 800
      }
    ];
    setOrders(mockOrders);
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.name.trim()) newErrors.name = 'El nombre es obligatorio';
    if (!formData.description.trim()) newErrors.description = 'La descripción es obligatoria';
    if (formData.price < 0) newErrors.price = 'El precio debe ser mayor o igual a 0';
    if (formData.stock < 0) newErrors.stock = 'El stock debe ser mayor o igual a 0';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    if (editingProduct) {
      const updatedProduct = { ...editingProduct, ...formData };
      await authService.updateProduct(updatedProduct);
      setProducts(products.map(p => p.id === editingProduct.id ? updatedProduct : p));
      setEditingProduct(null);
    } else {
      const newProduct: Product = {
        id: Date.now().toString(),
        ...formData
      };
      await authService.addProduct(newProduct);
      setProducts([...products, newProduct]);
    }
    
    setFormData({ name: '', description: '', price: 0, stock: 0 });
    setErrors({});
  };

  const generateDescription = async () => {
    if (!formData.name.trim()) {
      setErrors({...errors, name: 'Ingresa el nombre del producto primero'});
      return;
    }
    
    setIsGeneratingDescription(true);
    try {
      const prompt = `Genera una descripción atractiva y vendedora para: "${formData.name}". Enfócate en beneficios, calidad y experiencia. Máximo 100 palabras.`;
      const description = await geminiService.generateContent(prompt);
      setFormData({...formData, description});
      setErrors({...errors, description: ''});
    } catch (error) {
      console.error('Error generando descripción:', error);
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock
    });
    setErrors({});
  };

  const handleDelete = async (id: string) => {
    await authService.deleteProduct(id);
    setProducts(products.filter(p => p.id !== id));
  };

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'Pendiente': return '#f59e0b';
      case 'En Proceso': return '#3b82f6';
      case 'Completado': return '#10b981';
      default: return '#6b7280';
    }
  };

  return (
    <div className="product-management-panel">
      <div className="panel-header">
        <h2>Gestión de Negocio</h2>
        <div className="tab-buttons">
          <button 
            className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            Productos
          </button>
          <button 
            className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            Pedidos ({orders.filter(o => o.status !== 'Completado').length})
          </button>
        </div>
      </div>

      {activeTab === 'products' && (
        <div className="products-section">
          <form onSubmit={handleSubmit} className="product-form">
            <div className="form-field">
              <input
                type="text"
                placeholder="Nombre del producto/servicio"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className={errors.name ? 'error' : ''}
                required
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>
            
            <div className="form-field">
              <div className="description-field">
                <textarea
                  placeholder="Descripción"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className={errors.description ? 'error' : ''}
                  required
                />
                <button 
                  type="button" 
                  onClick={generateDescription}
                  disabled={isGeneratingDescription || !formData.name.trim()}
                  className="ai-button"
                >
                  {isGeneratingDescription ? '⏳' : '🤖'} Generar con IA
                </button>
              </div>
              {errors.description && <span className="error-message">{errors.description}</span>}
            </div>
            
            <div className="form-field">
              <input
                type="number"
                placeholder="Precio"
                value={formData.price || ''}
                onChange={(e) => setFormData({...formData, price: +e.target.value || 0})}
                className={errors.price ? 'error' : ''}
                min="0"
                step="0.01"
                required
              />
              {errors.price && <span className="error-message">{errors.price}</span>}
            </div>
            
            <div className="form-field">
              <input
                type="number"
                placeholder="Stock disponible"
                value={formData.stock || ''}
                onChange={(e) => setFormData({...formData, stock: +e.target.value || 0})}
                className={errors.stock ? 'error' : ''}
                min="0"
                required
              />
              {errors.stock && <span className="error-message">{errors.stock}</span>}
            </div>
            <button type="submit">
              {editingProduct ? 'Actualizar' : 'Agregar'} Producto
            </button>
            {editingProduct && (
              <button type="button" onClick={() => {
                setEditingProduct(null);
                setFormData({ name: '', description: '', price: 0, stock: 0 });
                setErrors({});
              }}>
                Cancelar
              </button>
            )}
          </form>

          <div className="products-list">
            {products.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <div className="product-details">
                    <span className="price">${product.price}</span>
                    <span className="stock">Stock: {product.stock}</span>
                  </div>
                </div>
                <div className="product-actions">
                  <button onClick={() => handleEdit(product)}>Editar</button>
                  <button onClick={() => handleDelete(product.id)}>Eliminar</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="orders-section">
          <div className="orders-list">
            {orders.map(order => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <h3>{order.productName}</h3>
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(order.status) }}
                  >
                    {order.status}
                  </span>
                </div>
                <div className="order-details">
                  <p>Cliente: {order.customerName}</p>
                  <p>Cantidad: {order.quantity}</p>
                  <p>Total: ${order.total}</p>
                  <p>Fecha: {order.date}</p>
                </div>
                <div className="order-actions">
                  {order.status === 'Pendiente' && (
                    <button onClick={() => updateOrderStatus(order.id, 'En Proceso')}>
                      Procesar
                    </button>
                  )}
                  {order.status === 'En Proceso' && (
                    <button onClick={() => updateOrderStatus(order.id, 'Completado')}>
                      Completar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        .product-management-panel {
          padding: 20px;
          max-width: 800px;
        }
        .panel-header {
          margin-bottom: 20px;
        }
        .tab-buttons {
          display: flex;
          gap: 10px;
          margin-top: 10px;
        }
        .tab-btn {
          padding: 8px 16px;
          border: 1px solid #d1d5db;
          background: white;
          border-radius: 6px;
          cursor: pointer;
        }
        .tab-btn.active {
          background: #3b82f6;
          color: white;
        }
        .product-form {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 20px;
          padding: 20px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
        }
        .form-field {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .product-form input, .product-form textarea {
          padding: 8px;
          border: 1px solid #d1d5db;
          border-radius: 4px;
        }
        .product-form input.error, .product-form textarea.error {
          border-color: #ef4444;
        }
        .error-message {
          color: #ef4444;
          font-size: 12px;
          margin-top: 2px;
        }
        .description-field {
          display: flex;
          gap: 8px;
          align-items: flex-start;
        }
        .description-field textarea {
          flex: 1;
        }
        .ai-button {
          padding: 8px 12px;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
          white-space: nowrap;
        }
        .ai-button:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }
        .product-card {
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .order-card {
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 10px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }
        .product-details {
          display: flex;
          gap: 20px;
          margin-top: 8px;
        }
        .price {
          font-weight: bold;
          color: #059669;
        }
        .stock {
          color: #6b7280;
        }
        .product-actions, .order-actions {
          display: flex;
          gap: 8px;
        }
        .order-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }
        .status-badge {
          padding: 4px 8px;
          border-radius: 12px;
          color: white;
          font-size: 12px;
          font-weight: bold;
        }
        .order-details p {
          margin: 4px 0;
          font-size: 14px;
        }
        .order-card {
          flex-direction: column;
          align-items: flex-start;
        }
      `}</style>
    </div>
  );
};

export default ProductManagementPanel;