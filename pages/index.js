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
   <div className="min-h-screen bg-gray-100 p-4">
     <div className="max-w-2xl mx-auto bg-white rounded-lg shadow">
       <div className="bg-blue-600 text-white p-4 rounded-t-lg">
         <h1 className="text-xl font-bold text-center">Narudžba pića</h1>
       </div>

       <div className="p-4 space-y-6">
         {Object.entries(categories).map(([category, items]) => (
           <div key={category} className="border rounded-lg p-4">
             <h2 className="font-bold mb-3 text-lg">{category}</h2>
             <div className="space-y-3">
               {items.map(item => (
                 <div key={item.name} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                   <div className="flex-1 space-y-1">
                     <div>{item.name}</div>
                     {!item.noVariant && variants[item.name] && (
                       <div className="text-sm text-gray-600">
                         Varijanta: {variants[item.name]}
                       </div>
                     )}
                   </div>
                   <div className="flex items-center gap-2">
                     {orders[item.name] > 0 && (
                       <button
                         onClick={() => updateOrder(item, (orders[item.name] || 0) - 1)}
                         className="h-8 w-8 flex items-center justify-center rounded bg-red-500 text-white hover:bg-red-600"
                       >
                         -
                       </button>
                     )}
                     <input
                       type="number"
                       value={orders[item.name] || ''}
                       onChange={(e) => updateOrder(item, parseInt(e.target.value) || 0)}
                       className="w-16 text-center rounded border p-1"
                       placeholder="0"
                     />
                     <button
                       onClick={() => updateOrder(item, (orders[item.name] || 0) + 1)}
                       className="h-8 w-8 flex items-center justify-center rounded bg-green-500 text-white hover:bg-green-600"
                     >
                       +
                     </button>
                   </div>
                 </div>
               ))}
             </div>
           </div>
         ))}

         {/* Napomene */}
         <div className="border rounded-lg p-4">
           <h2 className="font-bold mb-3">Napomene</h2>
           <textarea
             value={notes}
             onChange={(e) => setNotes(e.target.value)}
             className="w-full h-24 p-2 border rounded"
             placeholder="Dodatne napomene za narudžbu..."
           />
         </div>

         {/* Dugmad za akcije */}
         <div className="flex gap-4">
           <button
             onClick={() => {
               navigator.clipboard.writeText(generateOrder());
               alert('Narudžba kopirana!');
             }}
             className="flex-1 bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600"
             disabled={Object.keys(orders).length === 0}
           >
             Kopiraj
           </button>
           <button
             onClick={() => {
               const order = generateOrder();
               window.open(`https://wa.me/?text=${encodeURIComponent(order)}`);
             }}
             className="flex-1 bg-green-500 text-white rounded-lg px-4 py-2 hover:bg-green-600"
             disabled={Object.keys(orders).length === 0}
           >
             WhatsApp
           </button>
         </div>
       </div>
     </div>
   </div>
 );
}