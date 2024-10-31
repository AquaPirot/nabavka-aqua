import '../styles/globals.css';
import React, { useState } from 'react'; 

export default function Home() {
 const [orders, setOrders] = useState({});
 const [variants, setVariants] = useState({});
 const [notes, setNotes] = useState('');
 
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

 const updateOrder = (item, value) => {
   if (value > 0) {
     setOrders({...orders, [item.name]: value});
   } else {
     const newOrders = {...orders};
     delete newOrders[item.name];
     setVariants(prev => {
       const newVariants = {...prev};
       delete newVariants[item.name];
       return newVariants;
     });
     setOrders(newOrders);
   }
 };

 const updateVariant = (itemName, variant) => {
   setVariants({...variants, [itemName]: variant});
 };

 const generateOrder = () => {
   let message = `📋 NARUDŽBA ${new Date().toLocaleDateString('sr-RS')}\n\n`;
   
   Object.entries(categories).forEach(([category, items]) => {
     const categoryOrders = items.filter(item => orders[item.name]);
     if (categoryOrders.length > 0) {
       message += `${category}\n`;
       categoryOrders.forEach(item => {
         let orderLine = `${orders[item.name]} × ${item.name}`;
         if (variants[item.name]) {
           orderLine += ` (${variants[item.name]})`;
         }
         message += `${orderLine}\n`;
       });
       message += '\n';
     }
   });

   if (notes.trim()) {
     message += `\nNAPOMENE:\n${notes}\n`;
   }

   return message;
 };

return (
 <div className="min-h-screen bg-gray-50 p-4">
   <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-xl">
     <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white p-6 rounded-t-lg shadow-lg">
       <h1 className="text-2xl font-bold text-center">Narudžba pića</h1>
     </div>

     <div className="p-6 space-y-6">
       {Object.entries(categories).map(([category, items]) => (
         <div key={category} className="border-2 border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
           <h2 className="font-bold mb-4 text-lg text-blue-900">{category}</h2>
           <div className="space-y-3">
             {items.map(item => (
               <div key={item.name} 
                    className="flex items-center gap-2 p-3 hover:bg-gray-50 rounded-lg border border-gray-100">
                 <div className="flex-1 space-y-1">
                   <div className="font-medium">{item.name}</div>
                   {!item.noVariant && variants[item.name] && (
                     <div className="text-sm text-gray-600">
                       Varijanta: {variants[item.name]}
                     </div>
                   )}
                 </div>
                 <div className="flex items-center gap-3">
                   {orders[item.name] > 0 && (
                     <button
                       onClick={() => updateOrder(item, (orders[item.name] || 0) - 1)}
                       className="h-10 w-10 flex items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors shadow-sm"
                     >
                       <Minus className="h-5 w-5" />
                     </button>
                   )}
                   <input
                     type="number"
                     value={orders[item.name] || ''}
                     onChange={(e) => updateOrder(item, parseInt(e.target.value) || 0)}
                     className="w-16 text-center rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 p-2"
                     placeholder="0"
                   />
                   <button
                     onClick={() => updateOrder(item, (orders[item.name] || 0) + 1)}
                     className="h-10 w-10 flex items-center justify-center rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors shadow-sm"
                   >
                     <Plus className="h-5 w-5" />
                   </button>
                 </div>
               </div>
             ))}
           </div>
         </div>
       ))}

       {/* Napomene */}
       <div className="border-2 border-gray-200 rounded-lg p-4 shadow-sm">
         <h2 className="font-bold mb-3 text-lg text-blue-900">Napomene</h2>
         <textarea
           value={notes}
           onChange={(e) => setNotes(e.target.value)}
           className="w-full h-24 p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
           placeholder="Dodatne napomene za narudžbu..."
         />
       </div>

       {/* Dugmad za akcije */}
       <div className="flex gap-4 pt-4">
         <button
           onClick={() => {
             navigator.clipboard.writeText(generateOrder());
             alert('Narudžba kopirana!');
           }}
           className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg px-6 py-3 hover:from-blue-700 hover:to-blue-800 transition-all shadow-md flex items-center justify-center gap-2"
           disabled={Object.keys(orders).length === 0}
         >
           <Copy className="h-5 w-5" />
           Kopiraj
         </button>
         <button
           onClick={() => {
             const order = generateOrder();
             window.open(`https://wa.me/?text=${encodeURIComponent(order)}`);
           }}
           className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg px-6 py-3 hover:from-green-700 hover:to-green-800 transition-all shadow-md flex items-center justify-center gap-2"
           disabled={Object.keys(orders).length === 0}
         >
           <Send className="h-5 w-5" />
           WhatsApp
         </button>
       </div>
     </div>
   </div>
 </div>
);
}
