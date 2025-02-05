import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        if (signUpError.message === 'User already registered') {
          setError('Un compte existe déjà avec cet email. Veuillez vous connecter.');
          setTimeout(() => navigate('/login'), 2000);
          return;
        }
        if (signUpError.message.includes('Database error')) {
          setError('Une erreur technique est survenue. Veuillez réessayer dans quelques instants.');
          return;
        }
        throw signUpError;
      }

      if (data?.user) {
        navigate('/login');
      }
    } catch (err: any) {
      let errorMessage = 'Une erreur est survenue lors de l\'inscription';
      if (err.message.includes('already registered')) {
        errorMessage = 'Un compte existe déjà avec cet email. Veuillez vous connecter.';
        setTimeout(() => navigate('/login'), 2000);
      } else if (err.message.includes('Database error')) {
        errorMessage = 'Une erreur technique est survenue. Veuillez réessayer dans quelques instants.';
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-rose-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center mb-8">Inscription</h2>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              required
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mot de passe
            </label>
            <input
              type="password"
              required
              minLength={6}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            <p className="mt-1 text-sm text-gray-500">
              Le mot de passe doit contenir au moins 6 caractères
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-rose-600 text-white py-3 rounded-lg hover:bg-rose-700 transition-colors disabled:bg-rose-300"
            disabled={loading}
          >
            {loading ? 'Inscription en cours...' : 'S\'inscrire'}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600">
          Vous avez déjà un compte ?{' '}
          <button
            onClick={() => navigate('/login')}
            className="text-rose-600 hover:text-rose-700"
            disabled={loading}
          >
            Se connecter
          </button>
        </p>
      </div>
    </div>
  );
}