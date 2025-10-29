// export const Teams = () => {
//   const teams = [
//     { 
//       name: "Thunder Spikers", 
//       division: "Division B", 
//       emoji: "⚡",
//       color: "from-yellow-400 to-amber-500",
//       members: 8,
//     },
//     { 
//       name: "Net Crushers", 
//       division: "Division B+", 
//       emoji: "🔥",
//       color: "from-orange-500 to-red-500",
//       members: 7,
//     },
//     { 
//       name: "Ace Warriors", 
//       division: "Division C+", 
//       emoji: "🏹",
//       color: "from-blue-400 to-cyan-500",
//       members: 9,
//     },
//     { 
//       name: "Spike Masters", 
//       division: "Division B", 
//       emoji: "💥",
//       color: "from-purple-500 to-pink-500",
//       members: 6,
//     },
//   ];

//   return (
//     <section id="teams" className="py-20 bg-rose-50/30">
//       <div className="container mx-auto px-6">
//         <div className="text-center mb-16">
//           <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
//             Nos Équipes
//           </h2>
//           <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
//             Rencontrez les équipes passionnées qui font vibrer la ligue SherVy
//           </p>
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
//           {teams.map((team, _index) => (
//             <div
//               key={team.name}
//               className="group cursor-pointer transform hover:scale-105 transition-all duration-300"
//             >
//               <div className={`bg-linear-to-br ${team.color} rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden text-center`}>
//                 <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
//                   {team.emoji}
//                 </div>
                
//                 <div className="text-center relative z-10">
//                   <h3 className="text-lg font-semibold text-white mb-2">
//                     {team.name}
//                   </h3>
//                   <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 border border-white/30 mb-3">
//                     <span className="text-white font-medium text-sm">{team.division}</span>
//                   </div>
                  
//                   <div className="text-white/80 text-sm">
//                     {team.members} joueurs
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* CTA Section */}
//         <div className="text-center mt-16">
//           <div className="bg-linear-to-r from-rose-400 to-red-400 rounded-2xl p-8 max-w-2xl mx-auto">
//             <h3 className="text-2xl font-semibold text-white mb-4">
//               Votre Équipe Manque à l'Appel?
//             </h3>
//             <p className="text-rose-100 mb-6 max-w-md mx-auto">
//               Rejoignez la famille SherVy et écrivez votre propre histoire sur le terrain
//             </p>
//             <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
//               <button className="bg-white text-rose-600 px-6 py-2.5 rounded-lg font-medium hover:bg-rose-50 hover:shadow-lg transform hover:scale-105 transition-all duration-300">
//                 Inscrire Mon Équipe
//               </button>
//               <button className="bg-white/20 backdrop-blur-sm text-white px-6 py-2.5 rounded-lg font-medium hover:bg-white/30 hover:shadow-lg transform hover:scale-105 transition-all duration-300">
//                 Parler à un Organisateur
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };