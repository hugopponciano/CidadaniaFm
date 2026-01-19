import { useEffect, useState } from 'react';
import { supabase, Database } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { useLocation } from 'wouter';

type News = Database['public']['Tables']['news']['Row'];

export default function NewsManager() {
  const { user, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'destaque' as const,
    image_url: '',
    author: '',
    published: true,
  });

  useEffect(() => {
    if (!authLoading && !user) {
      setLocation('/login');
    }
  }, [user, authLoading, setLocation]);

  useEffect(() => {
    if (user) {
      fetchNews();
    }
  }, [user]);

  const fetchNews = async () => {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNews(data || []);
    } catch (error) {
      console.error('Error fetching news:', error);
      toast.error('Erro ao carregar notícias');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      if (editingId) {
        const { error } = await supabase
          .from('news')
          .update(formData)
          .eq('id', editingId);

        if (error) throw error;
        toast.success('Notícia atualizada!');
      } else {
        const { error } = await supabase.from('news').insert([
          {
            ...formData,
            user_id: user.id,
          },
        ]);

        if (error) throw error;
        toast.success('Notícia criada!');
      }

      setShowForm(false);
      setEditingId(null);
      resetForm();
      fetchNews();
    } catch (error: any) {
      console.error('Error saving news:', error);
      toast.error(error.message || 'Erro ao salvar notícia');
    }
  };

  const handleEdit = (item: News) => {
    setFormData({
      title: item.title,
      content: item.content,
      category: item.category as any,
      image_url: item.image_url || '',
      author: item.author || '',
      published: item.published,
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir esta notícia?')) return;

    try {
      const { error } = await supabase.from('news').delete().eq('id', id);

      if (error) throw error;
      toast.success('Notícia excluída!');
      fetchNews();
    } catch (error) {
      console.error('Error deleting news:', error);
      toast.error('Erro ao excluir notícia');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      category: 'destaque',
      image_url: '',
      author: '',
      published: true,
    });
  };

  if (authLoading || !user) {
    return <div className="container py-8">Carregando...</div>;
  }

  return (
    <div className="container py-8 pb-24">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Gerenciar Notícias</h1>
        <button
          onClick={() => {
            setShowForm(!showForm);
            if (showForm) {
              setEditingId(null);
              resetForm();
            }
          }}
          className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nova Notícia
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-6">
            {editingId ? 'Editar Notícia' : 'Nova Notícia'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Título *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Conteúdo *</label>
              <textarea
                required
                rows={6}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Categoria *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="destaque">Destaque</option>
                  <option value="eventos">Eventos</option>
                  <option value="radio">Rádio</option>
                  <option value="saude">Saúde</option>
                  <option value="educacao">Educação</option>
                  <option value="esportes">Esportes</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Autor</label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">URL da Imagem</label>
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="https://..."
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="published"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                className="w-4 h-4"
              />
              <label htmlFor="published" className="text-sm font-medium">
                Publicar imediatamente
              </label>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90"
              >
                {editingId ? 'Atualizar' : 'Criar'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  resetForm();
                }}
                className="bg-gray-200 px-6 py-2 rounded-lg hover:bg-gray-300"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Título
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Categoria
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Data
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {news.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{item.title}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{item.category}</td>
                <td className="px-6 py-4">
                  {item.published ? (
                    <span className="flex items-center gap-1 text-green-600 text-sm">
                      <Eye className="w-4 h-4" /> Publicado
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-gray-500 text-sm">
                      <EyeOff className="w-4 h-4" /> Rascunho
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(item.created_at).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleEdit(item)}
                    className="text-blue-600 hover:text-blue-800 mr-3"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
