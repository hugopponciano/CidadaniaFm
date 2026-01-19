import { useEffect, useState } from 'react';
import { supabase, Database } from '../lib/supabase';
import { Clock, User as UserIcon } from 'lucide-react';
import { toast } from 'sonner';

type Program = Database['public']['Tables']['programs']['Row'];

const DAYS_MAP = {
  segunda: 'Segunda-feira',
  terca: 'Terça-feira',
  quarta: 'Quarta-feira',
  quinta: 'Quinta-feira',
  sexta: 'Sexta-feira',
  sabado: 'Sábado',
  domingo: 'Domingo',
};

const DAYS_ORDER = ['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado', 'domingo'];

export default function Programacao() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<string>('segunda');

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const { data, error } = await supabase
        .from('programs')
        .select('*')
        .eq('active', true)
        .order('start_time', { ascending: true });

      if (error) throw error;
      setPrograms(data || []);
    } catch (error) {
      console.error('Error fetching programs:', error);
      toast.error('Erro ao carregar programação');
    } finally {
      setLoading(false);
    }
  };

  const getProgramsByDay = (day: string) => {
    return programs.filter((p) => p.day_of_week === day);
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-blue-700 text-white py-16">
        <div className="container text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Programação
          </h1>
          <p className="text-xl text-white/90">
            Confira nossa grade de programas
          </p>
        </div>
      </section>

      {/* Day Selector */}
      <section className="bg-white shadow-sm sticky top-16 z-30">
        <div className="container py-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {DAYS_ORDER.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-all ${
                  selectedDay === day
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {DAYS_MAP[day as keyof typeof DAYS_MAP]}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Programs List */}
      <section className="container py-12">
        {loading ? (
          <div className="space-y-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-xl p-6 shadow-lg">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {getProgramsByDay(selectedDay).length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl shadow-lg">
                <p className="text-gray-500 text-lg">
                  Nenhum programa agendado para este dia.
                </p>
              </div>
            ) : (
              getProgramsByDay(selectedDay).map((program) => (
                <div
                  key={program.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="md:flex">
                    {/* Host Photo */}
                    {program.host_photo && (
                      <div className="md:w-64 h-64 md:h-auto">
                        <img
                          src={program.host_photo}
                          alt={program.host}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Program Info */}
                    <div className="flex-1 p-8">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            {program.title}
                          </h2>
                          <div className="flex items-center gap-4 text-gray-600">
                            <div className="flex items-center gap-2">
                              <Clock className="w-5 h-5 text-primary" />
                              <span className="font-medium">
                                {program.start_time} - {program.end_time}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <UserIcon className="w-5 h-5 text-primary" />
                              <span className="font-medium">{program.host}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {program.description && (
                        <p className="text-gray-700 leading-relaxed">
                          {program.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </section>
    </div>
  );
}
