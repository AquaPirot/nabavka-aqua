import React, { useState, useMemo } from 'react';
import { Minus, Plus, Copy, Send, Coffee, Wine, Beer, GlassWater, Search, SlidersHorizontal } from 'lucide-react';

export default function Home() {
  const [orders, setOrders] = useState({});
  const [variants, setVariants] = useState({});
  const [notes, setNotes] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategories, setActiveCategories] = useState(new Set());
  const [sortOption, setSortOption] = useState('default');
  
  const categories = {
    'TOPLI NAPICI': [
      { name: 'ESPRESSO', unit: 'gr', noVariant: true },
      { name: 'NES KAFA', unit: 'gr', noVariant: true },
      { name: 'ČAJ', unit: 'kom', variants: [
        'Nana',
        'Kamilica', 
        'Zeleni',
        'Crni',
        'Voćni',
        'Jabuka & Cimet',
        'Ostalo'
      ]},
      { name: 'TOPLA ČOKOLADA', unit: 'kom', variants: [
        'Bela',
        'Crna'
      ]},
      { name: 'MLEKO BARISTA', unit: 'lit', noVariant: true }
    ],
    'BEZALKOHOLNA PIĆA': [
      { name: 'ROSA 0.33', unit: 'kom', noVariant: true },
      { name: 'ROSA 0.7', unit: 'kom', noVariant: true },
      { name: 'ROSA GAZ 0.33', unit: 'kom', noVariant: true },
      { name: 'ROSA GAZ 0.7', unit: 'kom', noVariant: true },
      { name: 'ROMERQUELLE', unit: 'kom', noVariant: true },
      { name: 'KOKA KOLA', unit: 'kom', noVariant: true },
      { name: 'KOKA KOLA zero', unit: 'kom', noVariant: true },
      { name: 'FANTA', unit: 'kom', noVariant: true },
      { name: 'SPRITE', unit: 'kom', noVariant: true },
      { name: 'BITTER', unit: 'kom', noVariant: true },
      { name: 'TONIK', unit: 'kom', noVariant: true }
    ],
    'CEDEVITA I ENERGETSKA PIĆA': [
      { name: 'CEDEVITA NARANDŽA', unit: 'kom', noVariant: true },
      { name: 'CEDEVITA 9 VITAMINA', unit: 'kom', noVariant: true },
      { name: 'CEDEVITA LIMUN', unit: 'kom', noVariant: true },
      { name: 'CEDEVITA LIMETA', unit: 'kom', noVariant: true },
      { name: 'KOKTA', unit: 'kom', noVariant: true },
      { name: 'ULTRA ENERGY', unit: 'kom', noVariant: true },
      { name: 'RED BULL', unit: 'kom', noVariant: true },
      { name: 'GUARANA', unit: 'kom', noVariant: true }
    ],
    'NEXT SOKOVI': [
      { name: 'NEXT JABUKA', unit: 'kom', noVariant: true },
      { name: 'NEXT NARANDŽA', unit: 'kom', noVariant: true },
      { name: 'NEXT JAGODA', unit: 'kom', noVariant: true },
      { name: 'NEXT ŠUMSKO VOĆE', unit: 'kom', noVariant: true },
      { name: 'NEXT BRESKVA', unit: 'kom', noVariant: true },
      { name: 'NEXT LIMUNADA JAGODA', unit: 'kom', noVariant: true },
      { name: 'NEXT LIMUNADA ANANAS', unit: 'kom', noVariant: true }
    ],
    'PIVA': [
      { name: 'TUBORG 0.3', unit: 'kom', noVariant: true },
      { name: 'LAV PREMIUM 0.3', unit: 'kom', noVariant: true },
      { name: 'CARLSBERG 0.25', unit: 'kom', noVariant: true },
      { name: 'ERDINGER', unit: 'kom', noVariant: true },
      { name: 'BLANC - KRONENBURG', unit: 'kom', noVariant: true },
      { name: 'TUBORG ICE', unit: 'kom', noVariant: true },
      { name: 'BUDWEISER TAMNO', unit: 'kom', noVariant: true },
      { name: 'BUDWEISER SVETLO', unit: 'kom', noVariant: true }
    ],
    'SOMERSBY': [
      { name: 'SOMERSBY MANGO', unit: 'kom', noVariant: true },
      { name: 'SOMERSBY JABUKA', unit: 'kom', noVariant: true },
      { name: 'SOMERSBY BOROVNICA', unit: 'kom', noVariant: true },
      { name: 'SOMERSBY MALINA', unit: 'kom', noVariant: true },
      { name: 'SOMERSBY JAGODA', unit: 'kom', noVariant: true }
    ],
    'ŽESTOKA PIĆA': [
      { name: 'VOTKA', unit: 'ml', noVariant: true },
      { name: 'SMIRNOFF', unit: 'ml', noVariant: true },
      { name: 'DŽIN', unit: 'ml', noVariant: true },
      { name: 'DŽIN BEEFEATER', unit: 'ml', noVariant: true },
      { name: 'DŽIN BEEFEATER PINK', unit: 'ml', noVariant: true },
      { name: 'TEQUILA', unit: 'ml', noVariant: true },
      { name: 'VINJAK', unit: 'ml', noVariant: true },
      { name: 'GORKI LIST', unit: 'ml', noVariant: true },
      { name: 'VERMUT', unit: 'ml', noVariant: true }
    ],
    'VISKIJI': [
      { name: 'JOHNNIE WALKER RED', unit: 'ml', noVariant: true },
      { name: 'JOHNNIE WALKER BLACK', unit: 'ml', noVariant: true },
      { name: 'JAMESON', unit: 'ml', noVariant: true },
      { name: 'CHIVAS', unit: 'ml', noVariant: true },
      { name: 'TULLAMORE DEW', unit: 'ml', noVariant: true },
      { name: 'JACK DANIELS', unit: 'ml', noVariant: true },
      { name: 'BALLANTINES', unit: 'ml', noVariant: true }
    ],
    'BRENDIJI I KONJACI': [
      { name: 'COURVOISIER', unit: 'ml', noVariant: true },
      { name: 'HENNESSY', unit: 'ml', noVariant: true }
    ],
    'LIKERI': [
      { name: 'JEGER', unit: 'ml', noVariant: true },
      { name: 'BAILEYS', unit: 'ml', noVariant: true },
      { name: 'APEROL', unit: 'ml', noVariant: true },
      { name: 'CAMPARI', unit: 'ml', noVariant: true },
      { name: 'MARTINI', unit: 'ml', noVariant: true },
      { name: 'RAMAZZOTTI', unit: 'ml', noVariant: true },
      { name: 'OUZO', unit: 'ml', noVariant: true }
    ],
    'DOMAĆA ALKOHOLNA PIĆA': [
      { name: 'HAVANA RUM', unit: 'ml', noVariant: true },
      { name: 'MEGDAN DUNJA', unit: 'ml', noVariant: true },
      { name: 'MEGDAN ŠLJIVA', unit: 'ml', noVariant: true },
      { name: 'MEGDAN VILJAMOVKA', unit: 'ml', noVariant: true },
      { name: 'MEGDAN KAJSIJA', unit: 'ml', noVariant: true },
      { name: 'MEGDAN GROŽĐE', unit: 'ml', noVariant: true },
      { name: 'STOMAKLIJA', unit: 'ml', noVariant: true }
    ],
    'BELA VINA': [
      { name: 'FILIGRAN CHARDONNAY', unit: 'kom', noVariant: true },
      { name: 'KOVAČEVIĆ CHARDONNAY', unit: 'kom', noVariant: true },
      { name: 'RADOVANOVIĆ CHARDONNAY', unit: 'kom', noVariant: true },
      { name: 'MATALJ SOUVIGNON', unit: 'kom', noVariant: true },
      { name: 'MATALJ CHARDONNAY', unit: 'kom', noVariant: true },
      { name: 'ALEKSANDROVIĆ TEMA', unit: 'kom', noVariant: true },
      { name: 'CILIĆ ONYX BELI', unit: 'kom', noVariant: true },
      { name: 'ĐEURIĆ AKSIOM BELI', unit: 'kom', noVariant: true },
      { name: 'SPASIĆ LEKCIJA TAMJANIKA', unit: 'kom', noVariant: true },
      { name: 'RUBIN SAUV BLANC', unit: 'kom', noVariant: true },
      { name: 'RUBIN CHARDONAY', unit: 'kom', noVariant: true },
      { name: 'RUBIN MUSCAT', unit: 'kom', noVariant: true },
      { name: 'LA SASTRERIA BELO', unit: 'kom', noVariant: true },
      { name: 'SAVIĆ RIZLING', unit: 'kom', noVariant: true },
      { name: 'JOVIĆ CHARDONNAY', unit: 'kom', noVariant: true }
    ],
    'CRVENA VINA': [
      { name: 'RUBIN MERLOT', unit: 'kom', noVariant: true },
      { name: 'FILIGRAN CABERNET', unit: 'kom', noVariant: true },
      { name: 'IZBA JOVAN MERLOT', unit: 'kom', noVariant: true },
      { name: 'RADOVANOVIĆ CABERNET', unit: 'kom', noVariant: true },
      { name: 'RADOVANOVIĆ SUVIGNON', unit: 'kom', noVariant: true },
      { name: 'CILIĆ ONYX CRVENO', unit: 'kom', noVariant: true },
      { name: 'ĐEURIĆ AKSIOM CRVENI', unit: 'kom', noVariant: true },
      { name: 'SPASIĆ DESPOT', unit: 'kom', noVariant: true },
      { name: 'MATALJ KREMEN', unit: 'kom', noVariant: true },
      { name: 'ALEKSANDROVIĆ PROKUPAC', unit: 'kom', noVariant: true },
      { name: 'RUBIN CABERNET', unit: 'kom', noVariant: true },
      { name: 'RUBIN DOB.BAR. SUV', unit: 'kom', noVariant: true },
      { name: 'RUBIN DOB.BAR. CAB', unit: 'kom', noVariant: true },
      { name: 'RUBIN AMANTE CARMEN', unit: 'kom', noVariant: true },
      { name: 'DESPOTIKA NEMIR', unit: 'kom', noVariant: true },
      { name: 'JOVIĆ CABERNET', unit: 'kom', noVariant: true },
      { name: 'JOVIĆ VRANAC', unit: 'kom', noVariant: true },
      { name: 'LA SASTRERIA CRVENO', unit: 'kom', noVariant: true },
      { name: 'CILIĆ MORAVA', unit: 'kom', noVariant: true },
      { name: 'CILIĆ cabernet & merlot', unit: 'kom', noVariant: true },
      { name: 'VINUM FRANCOVKA', unit: 'kom', noVariant: true },
      { name: 'TEMET BURGUNDAC', unit: 'kom', noVariant: true },
      { name: 'IVANOVIĆ PROKUPAC', unit: 'kom', noVariant: true },
      { name: 'CRNA OVCA', unit: 'kom', noVariant: true }
    ],
    'ROZE VINA': [
      { name: 'RUBIN ROSE 0,7', unit: 'kom', noVariant: true },
      { name: 'MATALJ DUSICA', unit: 'kom', noVariant: true },
      { name: 'RUBIN VRONSKY 0,7', unit: 'kom', noVariant: true }
    ],
    'VINA 0,187L': [
      { name: 'RUBIN CHARDONNAY 0,187', unit: 'kom', noVariant: true },
      { name: 'RUBIN VRANAC 0,187', unit: 'kom', noVariant: true },
      { name: 'RUBIN ROSE 0,187', unit: 'kom', noVariant: true }
    ]
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'TOPLI NAPICI': return <Coffee className="w-6 h-6 text-amber-600" />;
      case 'BEZALKOHOLNA PIĆA':
      case 'CEDEVITA I ENERGETSKA PIĆA':
      case 'NEXT SOKOVI': return <GlassWater className="w-6 h-6 text-blue-600" />;
      case 'PIVA':
      case 'SOMERSBY': return <Beer className="w-6 h-6 text-yellow-600" />;
      case 'BELA VINA':
      case 'CRVENA VINA':
      case 'ROZE VINA':
      case 'VINA 0,187L': return <Wine className="w-6 h-6 text-rose-600" />;
      case 'ŽESTOKA PIĆA':
      case 'VISKIJI':
      case 'BRENDIJI I KONJACI':
      case 'LIKERI':
      case 'DOMAĆA ALKOHOLNA PIĆA': return <GlassWater className="w-6 h-6 text-purple-600" />;
      default: return null;
    }
  };

  const filteredAndSortedData = useM
