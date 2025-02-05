import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export default function Shipping() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [price, setPrice] = useState(49.99);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    country: '',
    postalCode: '',
  });

  useEffect(() => {
    fetchPrice();
  }, []);

  const fetchPrice = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('price')
      .single();

    if (!error && data) {
      setPrice(data.price);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const order = {
      user_id: user?.id || null,
      total_amount: price,
      status: 'unpaid',
      shipping_address: formData,
      payment_status: 'pending',
      fulfillment_status: 'unfulfilled'
    };

    const { data: newOrder, error } = await supabase
      .from('orders')
      .insert(order)
      .select()
      .single();

    if (!error && newOrder) {
      navigate('/thank-you', { state: { order: newOrder } });
    } else {
      alert('Une erreur est survenue. Veuillez réessayer.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Informations de Livraison</h1>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom Complet
            </label>
            <input
              type="text"
              required
              className="w-full border rounded-lg px-4 py-2"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              required
              className="w-full border rounded-lg px-4 py-2"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Adresse
            </label>
            <input
              type="text"
              required
              className="w-full border rounded-lg px-4 py-2"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ville
            </label>
            <input
              type="text"
              required
              className="w-full border rounded-lg px-4 py-2"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Code Postal
            </label>
            <input
              type="text"
              required
              className="w-full border rounded-lg px-4 py-2"
              value={formData.postalCode}
              onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pays
            </label>
            <input
              type="text"
              required
              className="w-full border rounded-lg px-4 py-2"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            />
          </div>
        </div>

        {!user && (
          <div className="mt-6 p-4 bg-rose-50 rounded-lg">
            <p className="text-sm text-gray-600">
              Conseil : <Link to="/register" className="text-rose-600 hover:text-rose-700">Créez un compte</Link> pour suivre vos commandes et accéder à votre historique d'achats.
            </p>
          </div>
        )}

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Résumé de la Commande</h2>
          <div className="border-t border-b py-4">
            <div className="flex justify-between mb-2">
              <span>ACM Dépiwhite S Écran Solaire SPF50</span>
              <span>{price} €</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>{price} €</span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-rose-600 text-white py-3 rounded-lg mt-8 hover:bg-rose-700 transition-colors"
        >
          Passer la Commande
        </button>
      </form>
    </div>
  );
}