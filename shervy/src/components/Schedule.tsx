import { motion } from "framer-motion";

export const Schedule = () => {
  const matches: any[] = []; // empty for now

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "Tournoi d'Ouverture": return "from-rose-400 to-pink-400";
      case "Poule A": return "from-blue-400 to-cyan-400";
      case "Poule B": return "from-green-400 to-emerald-400";
      default: return "from-gray-400 to-gray-500";
    }
  };

  return (
    <section id="schedule" className="py-24 bg-linear-to-b from-white via-rose-50 to-white">
      <div className="container mx-auto px-6">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
            Calendrier des Matchs
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Ne manquez aucun moment fort des tournois SherVy !
          </p>
        </motion.div>

        {/* MATCHES OR "À VENIR" */}
        {matches.length > 0 ? (
          <div className="max-w-4xl mx-auto space-y-4">
            {matches.map((match, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 border border-rose-100 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Match Info */}
                  <div className="flex items-center space-x-4 flex-1">
                    {/* Date Badge */}
                    <div className="flex flex-col items-center">
                      <div className={`bg-linear-to-br ${getStageColor(match.stage)} rounded-xl px-4 py-3 text-center min-w-20`}>
                        <div className="text-white font-semibold">{match.date}</div>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {match.teams}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`bg-linear-to-r ${getStageColor(match.stage)} text-white px-3 py-1 rounded-full text-xs font-medium`}>
                          {match.stage}
                        </span>
                        <span className="flex items-center space-x-1 text-gray-600 text-sm">
                          <span>📍</span>
                          <span>{match.location}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Time & CTA */}
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className="text-gray-500 text-xs mb-1">HEURE</div>
                      <div className="text-xl font-semibold text-rose-600">{match.time}</div>
                    </div>
                    <button className="bg-rose-400 text-white px-4 py-2 rounded-lg font-medium hover:bg-rose-500 hover:shadow-lg transform hover:scale-105 transition-all duration-300">
                      Rappel
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center py-24"
          >
            <div className="inline-block bg-linear-to-r from-rose-500 to-pink-500 text-white text-sm font-semibold px-5 py-2 rounded-full mb-6 shadow-md">
              À VENIR
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-3">
              Le calendrier arrive bientôt !
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Les horaires et confrontations sont en préparation.  
              Revenez bientôt pour découvrir les prochains matchs 🔥
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
};
