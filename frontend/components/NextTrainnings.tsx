import React, { useEffect, useState } from "react";
import Pagination from "./Pagination";
import GeneratePDFTrainning from "./GeneratePDFTrainning";
import getNextTrainnings from "@/lib/getNextTrainnings";

const NextTrainings = () => {
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTraining, setSelectedTraining] = useState(null);
  const itemsPerPage = 3;

  useEffect(() => {
    const fetchDataAndSetState = async () => {
      try {
        const filteredTrainings = await getNextTrainnings();
        setTrainings(filteredTrainings);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching trainings:", error);
      }
    };

    fetchDataAndSetState();
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleTrainingDoubleClick = (training) => {
    setSelectedTraining(training);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = trainings.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="max-w-md w-full next-events bg-index-logged shadow-md rounded-md p-6">
      <h2 className="text-2xl font-semibold mb-4">Próximos entrenamientos</h2>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div>
          {currentItems.length > 0 ? (
            currentItems.map((training) => (
              <div
                key={training.id}
                className="mb-6 hover:bg-blue-400 rounded-xl p-2"
                onDoubleClick={() => handleTrainingDoubleClick(training)}
                style={{ cursor: "pointer" }}
              >
                <h3 className="text-lg font-semibold">
                  {training.attributes.title}
                </h3>
                <p>{training.attributes.description}</p>
                <p>{training.attributes.date}</p>
              </div>
            ))
          ) : (
            <p>No hay proximos entrenamientos.</p>
          )}

          {currentItems.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(trainings.length / itemsPerPage)}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      )}
      {selectedTraining && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-2xl leading-6 text-black font-bold">
                      {selectedTraining.attributes.title}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-black">
                        {selectedTraining.attributes.description}
                      </p>

                      <hr className="border-black border-2 w-full mt-10 mb-10" />

                      {selectedTraining &&
                        selectedTraining.attributes.exercises &&
                        Array.isArray(
                          selectedTraining.attributes.exercises.data
                        ) && (
                          <div>
                            <h4 className="mt-4 text-xl font-bold text-black">
                              Ejercicios:
                            </h4>
                            
                            {selectedTraining.attributes.exercises.data.map(
                              (exercise, index) => (
                                <div key={index} className="mt-4">
                                  <div>
                                    <img
                                      src={
                                        process.env.NEXT_PUBLIC_API_URL +
                                        exercise.attributes.img.data.attributes
                                          .url
                                      }
                                      alt=""
                                      className="h-96 w-96 mt-2 rounded-md"
                                    />
                                    <p className="text-lg text-black mt-2 mb-2">
                                      <span className="text-xl font-bold">
                                        Titulo:
                                      </span>{" "}
                                      {exercise.attributes.title}
                                    </p>
                                    <p className="text-lg text-black mt-2 mb-2">
                                      <span className="text-xl font-bold">
                                        Descripción:
                                      </span>{" "}
                                      {exercise.attributes.description}
                                    </p>
                                    <p className="text-lg text-black mt-2 mb-2">
                                      <span className="text-xl font-bold">
                                        Tipo:
                                      </span>{" "}
                                      {exercise.attributes.type}
                                    </p>
                                    <hr className="border-black border-2 w-full mt-10 mb-10" />
                                  </div>
                                  {/* ))} */}
                                </div>
                              )
                            )}
                          </div>
                        )}

                      <p className="text-2xl mt-4 text-black font-bold">
                        {selectedTraining.attributes.date}
                      </p>
                      <div className="flex flex-col items-center">
                        <GeneratePDFTrainning
                          selectedTraining={selectedTraining}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={() => setSelectedTraining(null)}
                  type="button"
                  className="w-full inline-flex justify-center custom-button-2 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NextTrainings;
