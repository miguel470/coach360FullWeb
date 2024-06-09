import React, { useEffect, useState } from "react";
import Pagination from "./Pagination";
import getNextGames from "@/lib/getNextGames";

const NextGames = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  useEffect(() => {
    const fetchDataAndSetState = async () => {
      try {
        const filteredGames = await getNextGames();
        setGames(filteredGames);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching games:", error);
      }
    };

    fetchDataAndSetState();
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = games.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="max-w-md w-full next-events sm:ml-4 bg-white shadow-md rounded-md p-6 bg-index-logged">
      <h2 className="text-2xl font-semibold mb-4">Próximos partidos</h2>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div>
          {currentItems.length > 0 ? (
            currentItems.map((game) => (
              <div
                key={game.id}
                className="mb-6 hover:bg-blue-400 rounded-xl p-2"
                style={{ cursor: "pointer" }}
              >
                <h3 className="text-lg font-semibold">
                  {game.attributes.opponent}
                </h3>
                <p>{game.attributes.location}</p>
                <p>{game.attributes.date}</p>
              </div>
            ))
          ) : (
            <p>No hay próximos partidos.</p>
          )}

          {currentItems.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(games.length / itemsPerPage)}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default NextGames;
