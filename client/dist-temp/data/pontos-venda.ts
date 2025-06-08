export interface PontoVenda {
  id: string;
  nome: string;
  endereco: string;
  cidade: string;
  provincia: string;
  telefone: string;
  horario: string;
  tipo: 'supermercado' | 'bar' | 'restaurante' | 'distribuidora';
  coordenadas: {
    lat: number;
    lng: number;
  };
}

export const pontosVenda: PontoVenda[] = [
  // Luanda
  {
    id: '1',
    nome: 'Supermercado Kero',
    endereco: 'Rua Amílcar Cabral, Maianga',
    cidade: 'Luanda',
    provincia: 'Luanda',
    telefone: '+244 222 334 567',
    horario: '08:00 - 20:00',
    tipo: 'supermercado',
    coordenadas: { lat: -8.8370, lng: 13.2444 }
  },
  {
    id: '2',
    nome: 'Bar do Porto',
    endereco: 'Marginal de Luanda, Ilha do Cabo',
    cidade: 'Luanda',
    provincia: 'Luanda',
    telefone: '+244 923 456 789',
    horario: '16:00 - 02:00',
    tipo: 'bar',
    coordenadas: { lat: -8.8167, lng: 13.2333 }
  },
  {
    id: '3',
    nome: 'Restaurante Fortaleza',
    endereco: 'Fortaleza de São Miguel, Cidade Alta',
    cidade: 'Luanda',
    provincia: 'Luanda',
    telefone: '+244 222 123 456',
    horario: '12:00 - 23:00',
    tipo: 'restaurante',
    coordenadas: { lat: -8.8125, lng: 13.2361 }
  },
  {
    id: '4',
    nome: 'Distribuidora Central CUCA',
    endereco: 'Zona Industrial, Viana',
    cidade: 'Viana',
    provincia: 'Luanda',
    telefone: '+244 222 987 654',
    horario: '07:00 - 17:00',
    tipo: 'distribuidora',
    coordenadas: { lat: -8.9167, lng: 13.3667 }
  },
  
  // Benguela
  {
    id: '5',
    nome: 'Supermercado Atlântico',
    endereco: 'Rua Álvaro Ferreira, Centro',
    cidade: 'Benguela',
    provincia: 'Benguela',
    telefone: '+244 272 234 567',
    horario: '08:00 - 19:00',
    tipo: 'supermercado',
    coordenadas: { lat: -12.5756, lng: 13.4014 }
  },
  {
    id: '6',
    nome: 'Bar da Praia',
    endereco: 'Restinga, Praia Morena',
    cidade: 'Benguela',
    provincia: 'Benguela',
    telefone: '+244 923 111 222',
    horario: '10:00 - 24:00',
    tipo: 'bar',
    coordenadas: { lat: -12.5889, lng: 13.4042 }
  },

  // Huambo
  {
    id: '7',
    nome: 'Mercado do Huambo',
    endereco: 'Praça da Independência',
    cidade: 'Huambo',
    provincia: 'Huambo',
    telefone: '+244 241 234 567',
    horario: '07:00 - 18:00',
    tipo: 'supermercado',
    coordenadas: { lat: -12.7764, lng: 15.7394 }
  },
  {
    id: '8',
    nome: 'Restaurante Planalto',
    endereco: 'Rua José Martí, Centro',
    cidade: 'Huambo',
    provincia: 'Huambo',
    telefone: '+244 241 345 678',
    horario: '11:00 - 22:00',
    tipo: 'restaurante',
    coordenadas: { lat: -12.7756, lng: 15.7342 }
  },

  // Lubango
  {
    id: '9',
    nome: 'Bar Tundavala',
    endereco: 'Rua Dr. António Agostinho Neto',
    cidade: 'Lubango',
    provincia: 'Huíla',
    telefone: '+244 261 123 456',
    horario: '15:00 - 01:00',
    tipo: 'bar',
    coordenadas: { lat: -14.9177, lng: 13.4925 }
  },
  {
    id: '10',
    nome: 'Supermercado Serra da Leba',
    endereco: 'Bairro Comercial',
    cidade: 'Lubango',
    provincia: 'Huíla',
    telefone: '+244 261 234 567',
    horario: '08:00 - 20:00',
    tipo: 'supermercado',
    coordenadas: { lat: -14.9144, lng: 13.4897 }
  }
];

export const provincias = [
  'Todas',
  'Luanda',
  'Benguela',
  'Huambo',
  'Huíla',
  'Bié',
  'Cabinda',
  'Cunene',
  'Kuando Kubango',
  'Kwanza Norte',
  'Kwanza Sul',
  'Malanje',
  'Moxico',
  'Namibe',
  'Uíge',
  'Zaire'
];

export const tiposPonto = [
  { value: 'todos', label: 'Todos os tipos' },
  { value: 'supermercado', label: 'Supermercados' },
  { value: 'bar', label: 'Bares' },
  { value: 'restaurante', label: 'Restaurantes' },
  { value: 'distribuidora', label: 'Distribuidoras' }
];