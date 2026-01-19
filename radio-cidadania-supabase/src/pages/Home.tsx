import { useEffect, useState } from 'react';
import { supabase, Database } from '../lib/supabase';
import { Calendar, User, Share2 } from 'lucide-react';
import { toast } from 'sonner';

type News = Database['public']['Tables']['news']['Row'];

const CATEGORIES = {
  destaque: { label: 'Destaque', color: 'bg-red-500' },
  eventos: { label: 'Eventos', color: 'bg-purple-500' },
  radio: { label: 'Rádio', color: 'bg-blue-500' },
  saude: { label: 'Saúde', color: 'bg-green-500' },
  educacao: { label: 'Educação', color: 'bg-yellow-500' },
  esportes: { label: 'Esportes', color: 'bg-orange-500' },
};

export default function Home() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    fetchNews();
  }, [selectedCategory]);

  const fetchNews = async () => {
    try {
      let query = supabase
        .from('news')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (selectedCategory) {
        query = query.eq('category', selectedCategory);
      }

      const { data, error } = await query;

      if (error) throw error;
      setNews(data || []);
    } catch (error) {
      console.error('Error fetching news:', error);
      toast.error('Erro ao carregar notícias');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const shareNews = (newsItem: News) => {
    const url = `${window.location.origin}/noticia/${newsItem.id}`;
    const text = `${newsItem.title} - Blog Cidadania FM`;
    
    if (navigator.share) {
      navigator.share({ title: newsItem.title, text, url });
    } else {
      navigator.clipboard.writeText(url);
      toast.success('Link copiado!');
    }
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-blue-700 text-white py-16">
        <div className="container text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Últimas Notícias
          </h1>
          <p className="text-xl text-white/90">
            Fique por dentro de tudo que acontece
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="bg-white shadow-sm sticky top-16 z-30">
        <div className="container py-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
                selectedCategory === null
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todas
            </button>
            {Object.entries(CATEGORIES).map(([key, { label, color }]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === key
                    ? `${color} text-white`
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* News Grid */}
      <section className="container py-12">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-64 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : news.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">
              Nenhuma notícia disponível no momento.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((item) => (
              <article
                key={item.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group"
              >
                {/* Image */}
                {item.image_url && (
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <span
                        className={`${
                          CATEGORIES[item.category as keyof typeof CATEGORIES].color
                        } text-white text-xs font-bold px-3 py-1 rounded-full`}
                      >
                        {CATEGORIES[item.category as keyof typeof CATEGORIES].label}
                      </span>
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                    {item.title}
                  </h2>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {item.content}
                  </p>

                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(item.created_at)}</span>
                      </div>
                      {item.author && (
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>{item.author}</span>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => shareNews(item)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                      aria-label="Compartilhar"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
