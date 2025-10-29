import { useState } from "react";

export const TournamentCTA = () => {
  const [loading, setLoading] = useState(false);

  const handleExternalClick = () => {
    setLoading(true);
     
    setTimeout(() => {
      window.open(
        "https://www.myteam.click/leaguelist/68f9515456d0a2b52b78a677/68f9515456d0a2b52b78a678",
        "_blank",
        "noopener,noreferrer"
      );
      setLoading(false);
    }, 700);  
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <button
        onClick={handleExternalClick}
        disabled={loading}
        className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
          loading
            ? "bg-white/70 text-rose-500 cursor-wait"
            : "bg-white text-rose-600 hover:bg-rose-50"
        }`}
      >
        {loading ? "Redirection..." : "Réserver notre place"}
      </button>

      <button
        onClick={() =>
          document
            .getElementById("contact")
            ?.scrollIntoView({ behavior: "smooth" })
        }
        className="border border-white text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/10 transition-colors"
      >
        Nous écrire
      </button>
    </div>
  );
};
