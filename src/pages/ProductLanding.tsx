import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Umbrella, Droplet, Leaf, Check, Star } from 'lucide-react';
import { supabase } from '../lib/supabase';
import depiwhite from '../images/depiwhite.jpg';
import stepone from '../images/1.png';
import steptwo from '../images/2.png';
import stepthree from '../images/3.png';
import befter from '../images/beforeafter.png';
import { mirage } from 'ldrs';
mirage.register();

interface Review {
  name: string;
  rating: number;
  comment: string;
  date: string;
}

interface Feature {
  icon: React.ElementType;
  title: string;
  desc: string;
}

const FeatureCard: React.FC<Feature> = ({ icon: Icon, title, desc }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <Icon className="w-12 h-12 text-rose-500 mb-4" />
    <h3 className="font-semibold text-lg mb-2">{title}</h3>
    <p className="text-gray-600">{desc}</p>
  </div>
);

export default function ProductLanding() {
  const navigate = useNavigate();
  const [price, setPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const reviews: Review[] = [
    {
      name: 'Sophie Martin',
      rating: 5,
      comment: 'Excellent produit ! Ma peau est visiblement plus lumineuse après 4 semaines d\'utilisation.',
      date: '2024-01-15'
    },
    {
      name: 'Marie Dubois',
      rating: 5,
      comment: 'La texture est légère et ne laisse pas de traces blanches. Parfait pour une utilisation quotidienne.',
      date: '2024-01-10'
    },
    {
      name: 'Claire Bernard',
      rating: 4,
      comment: 'Très efficace contre les taches brunes. Je recommande !',
      date: '2024-01-05'
    }
  ];

  const features: Feature[] = [
    { icon: Leaf, title: 'Formule légère', desc: 'S\'absorbe rapidement sans laisser de résidu gras.' },
    { icon: Droplet, title: 'Hydratation', desc: 'Contient des ingrédients hydratants qui aident à maintenir la peau douce et souple' },
    { icon: Umbrella, title: 'Résistant à l eau', desc: 'Efficace même après la baignade ou la transpiration, offrant une protection durable' },
    { icon: Check, title: 'Utilisation quotidienne', desc: 'Peut être intégré facilement dans votre routine de soins de la peau' }
  ];

  const fetchPrice = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('price')
      .single();

    if (!error && data) {
      setPrice(data.price);
    } else {
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPrice();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row items-center gap-12 mb-16">
        <div className="md:w-1/2">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            ACM Dépiwhite S Écran Solaire SPF50
          </h1>
          <p className="text-lg text-gray-600 mb-8">
          Le Depiwhite S SPF50 est votre allié idéal ! Cette crème solaire offre une protection
          maximale contre les UVA et UVB, tout en
          ciblant l'hyperpigmentation. Sa formule
          légère hydrate votre peau et s'absorbe
          rapidement, vous permettant de profiter
          du soleil en toute confiance. Ne laissez pas
          les taches brunes gâcher votre éclat !
          </p>
          <div className="bg-rose-100 p-6 rounded-lg mb-8">
            {loading ? (
              <l-mirage
              size="60"
              speed="2.5" 
              color="black" 
            ></l-mirage>
            ) : (
              <span className="text-3xl font-bold text-rose-600">{price} €</span>
            )}
          </div>
          <button
            onClick={() => navigate('/shipping')}
            className="bg-rose-600 text-white px-8 py-3 rounded-lg hover:bg-rose-700 transition-colors"
          >
            Procéder au Paiement
          </button>
        </div>
        <div className="md:w-1/2">
          <img
            src={depiwhite}
            alt="Produit solaire"
            className="md:relative top-0 right-0 w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Product Details */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-16">
        <h2 className="text-3xl font-bold mb-8">Caractéristiques du Produit</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Composition</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Filtres UVA/UVB de dernière génération</li>
              <li>Complexe dépigmentant breveté</li>
              <li>Agents hydratants</li>
              <li>Sans parabènes</li>
              <li>Hypoallergénique</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Bénéfices</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Réduit visiblement les taches brunes</li>
              <li>Prévient l'apparition de nouvelles taches</li>
              <li>Hydrate la peau pendant 24h</li>
              <li>Texture non grasse</li>
              <li>Convient à tous les types de peau</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-4 gap-8 mb-16">
        {features.map((feature, i) => (
          <FeatureCard key={i} {...feature} />
        ))}
      </div>

      {/* How to Use */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-16">
        <h2 className="text-2xl mb-8">ACM Dépiwhite, S Ecran solaire spf50 Grâce à son association de
        filtres organiques et d'écrans minéraux, il permet de :</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              step: 1,
              title: 'Protection élevée',
              desc: 'Offre une protection maximale contre les rayons UVA et UVB, réduisant ainsi le risque decoups de soleil et de dommages cutanés',
              image: stepone,
            },
            {
              step: 2,
              title: 'Anti-taches',
              desc: "Utilisez une quantité généreuse sur le visage et le cou",
              image: steptwo,
            },
            {
              step: 3,
              title: 'Convient à tous les types de peau',
              desc: "Idéal pour les peaux sensibles et sujettes à la pigmentation.",
              image: stepthree,
            }
          ].map((step) => (
            <div key={step.step} className="text-center">
              <div className="bg-rose-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-rose-600 font-bold">{step.step}</span>
              </div>
              <img
                src={step.image}
                alt={step.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="font-semibold text-xl mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
{/* Before & After */}
<div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-8">Avant & Après</h2>
        <div className="center">
          <div>
            <img
              src={befter}
              alt="Après le traitement"
              className="rounded-lg mb-4"
            />
          </div>
        </div>
      </div>

      
      {/* Reviews Section */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-16">
        <h2 className="text-3xl font-bold mb-8">Avis Clients</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <div key={index} className="border rounded-lg p-6">
              <div className="flex items-center mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">"{review.comment}"</p>
              <div className="flex justify-between text-sm text-gray-500">
                <span>{review.name}</span>
                <span>{new Date(review.date).toLocaleDateString('fr-FR')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
