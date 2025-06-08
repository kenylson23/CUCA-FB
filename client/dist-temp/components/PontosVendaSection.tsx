import { useState, useMemo } from 'react';
import { MapPin, Phone, Clock, Filter } from 'lucide-react';
import { pontosVenda, provincias, tiposPonto, type PontoVenda } from '@/data/pontos-venda';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function PontosVendaSection() {
  const [provinciaFiltro, setProvinciaFiltro] = useState('Todas');
  const [tipoFiltro, setTipoFiltro] = useState('todos');

  const pontosFiltrados = useMemo(() => {
    return pontosVenda.filter(ponto => {
      const matchProvincia = provinciaFiltro === 'Todas' || ponto.provincia === provinciaFiltro;
      const matchTipo = tipoFiltro === 'todos' || ponto.tipo === tipoFiltro;
      return matchProvincia && matchTipo;
    });
  }, [provinciaFiltro, tipoFiltro]);

  const getTipoLabel = (tipo: string) => {
    switch (tipo) {
      case 'supermercado': return 'Supermercado';
      case 'bar': return 'Bar';
      case 'restaurante': return 'Restaurante';
      case 'distribuidora': return 'Distribuidora';
      default: return tipo;
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'supermercado': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'bar': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'restaurante': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'distribuidora': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Onde Encontrar CUCA
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Descubra os pontos de venda da cerveja CUCA espalhados por Angola. 
            Encontre o local mais próximo de você!
          </p>
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center items-center">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filtros:</span>
          </div>
          
          <Select value={provinciaFiltro} onValueChange={setProvinciaFiltro}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Selecionar província" />
            </SelectTrigger>
            <SelectContent>
              {provincias.map(provincia => (
                <SelectItem key={provincia} value={provincia}>
                  {provincia}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={tipoFiltro} onValueChange={setTipoFiltro}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Tipo de estabelecimento" />
            </SelectTrigger>
            <SelectContent>
              {tiposPonto.map(tipo => (
                <SelectItem key={tipo.value} value={tipo.value}>
                  {tipo.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Mapa Placeholder */}
        <div className="mb-12 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="h-96 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 flex items-center justify-center relative">
            <div className="text-center">
              <MapPin className="h-16 w-16 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-300 mb-2">
                Mapa Interativo
              </h3>
              <p className="text-blue-700 dark:text-blue-400 max-w-md">
                Visualização dos {pontosFiltrados.length} pontos de venda encontrados
              </p>
            </div>
            
            {/* Pontos no mapa (representação visual) */}
            <div className="absolute inset-0 pointer-events-none">
              {pontosFiltrados.slice(0, 8).map((ponto, index) => (
                <div
                  key={ponto.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: `${20 + (index % 4) * 20}%`,
                    top: `${25 + Math.floor(index / 4) * 30}%`
                  }}
                >
                  <div className="relative">
                    <MapPin className="h-8 w-8 text-red-500 drop-shadow-lg animate-bounce" />
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity">
                      {ponto.nome}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Lista de pontos de venda */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pontosFiltrados.map(ponto => (
            <Card key={ponto.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{ponto.nome}</CardTitle>
                  <Badge className={getTipoColor(ponto.tipo)}>
                    {getTipoLabel(ponto.tipo)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-gray-500 mt-1 flex-shrink-0" />
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    <div>{ponto.endereco}</div>
                    <div>{ponto.cidade}, {ponto.provincia}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {ponto.telefone}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {ponto.horario}
                  </span>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-4"
                  onClick={() => {
                    const url = `https://www.google.com/maps/search/?api=1&query=${ponto.coordenadas.lat},${ponto.coordenadas.lng}`;
                    window.open(url, '_blank');
                  }}
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Ver no Mapa
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {pontosFiltrados.length === 0 && (
          <div className="text-center py-12">
            <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Nenhum ponto encontrado
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Tente ajustar os filtros para ver mais resultados.
            </p>
          </div>
        )}

        <div className="text-center mt-12">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Não encontrou um ponto de venda próximo?
          </p>
          <Button variant="outline" size="lg">
            Sugerir Novo Ponto de Venda
          </Button>
        </div>
      </div>
    </section>
  );
}