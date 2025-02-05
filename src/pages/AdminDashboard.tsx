import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { CreditCard, Truck } from 'lucide-react';

export default function AdminDashboard() {
  const { isAdmin, checkAdminStatus } = useAuth();
  const navigate = useNavigate();
  interface Order {
    id: string;
    shipping_address: {
      name: string;
      email: string;
      address: string;
      city: string;
      postalCode: string;
      country: string;
    };
    total_amount: number;
    payment_status: string;
    fulfillment_status: string;
    created_at: string;
  }

  const [orders, setOrders] = useState<Order[]>([]);
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const verifyAdminAccess = async () => {
      const isStillAdmin = await checkAdminStatus();
      if (!isStillAdmin) {
        navigate('/');
        return;
      }
      fetchOrders();
      fetchProduct();
    };

    verifyAdminAccess();
  }, [checkAdminStatus, navigate]);

  // Security check for all database operations
  const checkAdminBeforeOperation = async () => {
    const isStillAdmin = await checkAdminStatus();
    if (!isStillAdmin) {
      navigate('/');
      return false;
    }
    return true;
  };

  const fetchOrders = async () => {
    if (!await checkAdminBeforeOperation()) return;

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) {
      setOrders(data);
    }
    setLoading(false);
  };

  const fetchProduct = async () => {
    if (!await checkAdminBeforeOperation()) return;

    const { data, error } = await supabase
      .from('products')
      .select('price')
      .single();

    if (!error && data) {
      setPrice(data.price);
    }
    setLoading(false);
  };

  const updatePrice = async () => {
    if (!await checkAdminBeforeOperation()) return;

    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice) || numericPrice <= 0) {
      alert('Veuillez entrer un prix valide');
      return;
    }

    const { error } = await supabase
      .from('products')
      .update({ price: numericPrice })
      .eq('name', 'ACM Dépiwhite S Écran Solaire SPF50');

    if (!error) {
      alert('Prix mis à jour avec succès !');
    } else {
      alert('Erreur lors de la mise à jour du prix');
    }
  };

  const updateOrderStatus = async (orderId: string, field: 'payment_status' | 'fulfillment_status', value: string) => {
    if (!await checkAdminBeforeOperation()) return;

    const allowedPaymentStatuses = ['pending', 'paid', 'unpaid'];
    const allowedFulfillmentStatuses = ['fulfilled', 'unfulfilled'];

    if (field === 'payment_status' && !allowedPaymentStatuses.includes(value)) {
      console.error('Invalid payment status');
      return;
    }

    if (field === 'fulfillment_status' && !allowedFulfillmentStatuses.includes(value)) {
      console.error('Invalid fulfillment status');
      return;
    }

    const { error } = await supabase
      .from('orders')
      .update({ [field]: value })
      .eq('id', orderId);

    if (!error) {
      fetchOrders();
    } else {
      alert('Erreur lors de la mise à jour du statut');
    }
  };

  const getStatusBadgeColor = (status: 'paid' | 'unpaid' | 'pending' | 'fulfilled' | 'unfulfilled') => {
    const colors = {
      paid: 'bg-green-100 text-green-800',
      unpaid: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800',
      fulfilled: 'bg-blue-100 text-blue-800',
      unfulfilled: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return <div className='flex justify-center items-center h-screen'><l-mirage
    size="60"
    speed="2.5" 
    color="black" 
  ></l-mirage></div>;
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Tableau de Bord Admin</h1>

      {/* Price Management */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Mettre à jour le Prix</h2>
        <div className="flex gap-4">
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="border rounded px-3 py-2"
            step="0.01"
            min="0"
          />
          <button
            onClick={updatePrice}
            className="bg-rose-600 text-white px-4 py-2 rounded hover:bg-rose-700"
          >
            Mettre à jour
          </button>
        </div>
      </div>

      {/* Order Management */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Commandes</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-rose-50">
                <th className="p-3 text-left">ID Commande</th>
                <th className="p-3 text-left">Client</th>
                <th className="p-3 text-left">Montant</th>
                <th className="p-3 text-left">Paiement</th>
                <th className="p-3 text-left">Livraison</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order: any) => (
                <tr key={order.id} className="border-t">
                  <td className="p-3">{order.id.slice(0, 8)}</td>
                  <td className="p-3">{order.shipping_address.name}</td>
                  <td className="p-3">{order.total_amount} €</td>
                  <td className="p-3">
                    <select
                      value={order.payment_status}
                      onChange={(e) => updateOrderStatus(order.id, 'payment_status', e.target.value)}
                      className={`px-2 py-1 rounded ${getStatusBadgeColor(order.payment_status)}`}
                    >
                      <option value="pending">En attente</option>
                      <option value="paid">Payé</option>
                      <option value="unpaid">Non payé</option>
                    </select>
                  </td>
                  <td className="p-3">
                    <select
                      value={order.fulfillment_status}
                      onChange={(e) => updateOrderStatus(order.id, 'fulfillment_status', e.target.value)}
                      className={`px-2 py-1 rounded ${getStatusBadgeColor(order.fulfillment_status)}`}
                    >
                      <option value="unfulfilled">Non traité</option>
                      <option value="fulfilled">Traité</option>
                    </select>
                  </td>
                  <td className="p-3">
                    {new Date(order.created_at).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-rose-600 hover:text-rose-700"
                    >
                      Voir détails
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Détails de la Commande</h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Information Client</h4>
                <p>Nom: {selectedOrder.shipping_address.name}</p>
                <p>Email: {selectedOrder.shipping_address.email}</p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Adresse de Livraison</h4>
                <p>{selectedOrder.shipping_address.address}</p>
                <p>{selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.postalCode}</p>
                <p>{selectedOrder.shipping_address.country}</p>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold mb-2">Statut de la Commande</h4>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  <span className={`px-2 py-1 rounded ${getStatusBadgeColor(selectedOrder.payment_status as 'paid' | 'unpaid' | 'pending')}`}>
                    {selectedOrder.payment_status === 'paid' ? 'Payé' : 
                     selectedOrder.payment_status === 'unpaid' ? 'Non payé' : 'En attente'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  <span className={`px-2 py-1 rounded ${getStatusBadgeColor(selectedOrder.fulfillment_status as 'fulfilled' | 'unfulfilled')}`}>
                    {selectedOrder.fulfillment_status === 'fulfilled' ? 'Traité' : 'Non traité'}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold mb-2">Détails du Produit</h4>
              <div className="border rounded p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">ACM Dépiwhite S Écran Solaire SPF50</p>
                    <p className="text-sm text-gray-500">Quantité: 1</p>
                  </div>
                  <p className="font-medium">{selectedOrder.total_amount} €</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}