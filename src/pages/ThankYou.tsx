import { useLocation, Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

export default function ThankYou() {
  const location = useLocation();
  const order = location.state?.order;

  return (
    <div className="min-h-screen bg-rose-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold mb-4">Merci pour votre commande !</h1>
        <p className="text-gray-600 mb-6">
          Votre commande a été enregistrée avec succès. Nous vous enverrons un email de confirmation dès que votre commande sera validée.
        </p>
        
        {order && (
          <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
            <h2 className="font-semibold mb-4">Détails de la commande :</h2>
            <p className="text-sm text-gray-600">
              Numéro de commande : {order.id.slice(0, 8)}
            </p>
            <p className="text-sm text-gray-600">
              Montant total : {order.total_amount} €
            </p>
            <p className="text-sm text-gray-600">
              Statut : En attente de validation
            </p>
          </div>
        )}

        <Link
          to="/"
          className="inline-block bg-rose-600 text-white px-6 py-3 rounded-lg hover:bg-rose-700 transition-colors"
        >
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}