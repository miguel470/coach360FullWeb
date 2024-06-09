"use client";

import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import addEvent from "../utils/addEvent";
import editEvent from "../utils/editEvent";
import deleteEvent from "../utils/deleteEvent";
import getUserId from "@/lib/getUserId";
import ExerciseSearch from "@/components/ExerciseSearch";
import Pagination from "@/components/Pagination";
import useGetEvents from "../utils/getEvents";
import useMarkCheckboxes from "../utils/useMarkCheckboxes";
import { fetchExercises } from "@/app/Entreno/utils/getExercises";
import { fetchExercisesFav } from "@/app/Entreno/utils/getExercisesFavorites";
import { handleDoubleClick } from "../utils/functionsCalendar";

const MyCalendar: React.FC = () => {
  //errores
  const [titleError, setTitleError] = useState<string>("");
  const [descriptionError, setDescriptionError] = useState<string>("");
  const [dateError, setDateError] = useState<string>("");
  const [exerciseError, setExerciseError] = useState<string>("");
  const [locationError, setLocationError] = useState<string>("");
  const [opponentError, setOpponentError] = useState<string>("");

  const [date, setDate] = useState<Date>(new Date());
  const minDate = new Date(2023, 8, 1);
  const maxDate = new Date(2024, 6, 31);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [eventType, setEventType] = useState<string>("entrenamiento");
  const [opponent, setOpponent] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [trainingExercises, setTrainingExercises] = useState<any[]>([]);
  const [exercisesData, setExercisesData] = useState<any[]>([]);
  const [exercises, setExercises] = useState<any[]>([]);
  const [trainings, setTrainings] = useState<any[]>([]);
  const [games, setGames] = useState<any[]>([]);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [signal, setSignal] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<[] | null>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [extraField, setExtraField] = useState<string>("");
  const [userId, setUserId] = useState("");
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [hasEvents, setHasEvents] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredExercises, setFilteredExercises] = useState<any[]>([]);
  const [eventDate, setEventDate] = useState<Date>(new Date());
  const [originalEventDate, setOriginalEventDate] = useState<Date | null>(null);
  const itemsPerPage = 3;
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const id = await getUserId();
        setUserId(id);
      } catch (error) {
        console.error("Error fetching userId:", error);
      }
    };

    fetchUserId();
  }, [userId]);

  const fetchData = async () => {
    const exercisesFavorites = await fetchExercisesFav();

    const exercisesData2 = await fetchExercises();
    const combinedData = [...exercisesData2.data, ...exercisesFavorites];

    if (!exercisesData2.error) {
      setExercises(combinedData);
      setFilteredExercises(combinedData);
      setExercisesData(exercisesData2);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userId]);

  useGetEvents(setTrainings, setGames, signal);

  useMarkCheckboxes(selectedEvent, exercises, setTrainingExercises);

  const handleAddEventSubmit = async () => {
    try {
      let hasError = false;
      if (!title) {
        setTitleError("El título es requerido.");
        hasError = true;
      } else {
        setTitleError("");
      }

      if (!description) {
        setDescriptionError("La descripción es requerida.");
        hasError = true;
      } else {
        setDescriptionError("");
      }

      if (!isValidDate(eventDate)) {
        setDateError("La fecha es requerida.");
        hasError = true;
      } else {
        setDateError("");
      }

      if (eventType === "entrenamiento" && trainingExercises.length === 0) {
        setExerciseError("Debe seleccionar al menos un ejercicio.");
        hasError = true;
      } else {
        setExerciseError("");
      }

      if (eventType === "partido") {
        if (!opponent) {
          setOpponentError("El oponente es requerido.");
          hasError = true;
        } else {
          setOpponentError("");
        }

        if (!location) {
          setLocationError("La ubicación es requerida.");
          hasError = true;
        } else {
          setLocationError("");
        }
      }

      if (hasError) {
        return;
      }

      const exerciseIds = trainingExercises.map((exercise) => exercise.id);

      if (selectedEvent) {
        const newDate = new Date(selectedEvent.attributes.date);

        const newDateToSend = eventDate || newDate;

        const newExercisesIdsToSend =
          exerciseIds.length > 0
            ? exerciseIds
            : selectedEvent.attributes.exercises.data.map(
                (exercise) => exercise.id
              ) || [];

        const message = await editEvent(
          selectedEvent.id,
          eventType,
          title,
          description,
          opponent,
          location,
          newExercisesIdsToSend,
          newDateToSend
        );

        setSelectedEvent(null);
      } else {
        const message = await addEvent(
          eventType,
          title,
          description,
          opponent,
          location,
          trainingExercises,
          date
        );
      }
      setShowModal(false);
      fetchData();
      setSignal((prevSignal) => !prevSignal);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCalendarClick = (value) => {
    const currentTime = new Date().getTime();
    const timeDiff = currentTime - lastClickTime;
    if (timeDiff < 300) {
      handleDoubleClick(
        value,
        trainings,
        games,
        setShowModal,
        setSelectedEvent,
        setEventType,
        setTitle,
        setDescription,
        setOpponent,
        setLocation,
        setTrainingExercises,
        setDate,
        setIsEditMode,
        selectedEvent
      );
    } else {
      setLastClickTime(currentTime);
    }
  };

  const handleExerciseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const exerciseId = parseInt(e.target.value);

    const isChecked = trainingExercises.some(
      (exercise) => exercise.id === exerciseId
    );

    if (isChecked) {
      setTrainingExercises(
        trainingExercises.filter((exercise) => exercise.id !== exerciseId)
      );
    } else {
      setTrainingExercises([...trainingExercises, { id: exerciseId }]);
    }
  };

  const onChange = (date: Date) => {
    setDate(date);
    setEventDate(date);
  };

  const handleDateChange = (e, date) => {
    const selectedDate = e.target.value;
    if (selectedDate) {
      const dateFormat = new Date(selectedDate);
      setEventDate(dateFormat);
    } else {
      setEventDate(originalEventDate);
    }
  };

  const handleDeleteEvent = async () => {
    if (selectedEvent) {
      const eventId = selectedEvent.id;
      let eventType = "trainings";

      if (selectedEvent.attributes.opponent) {
        eventType = "games";
      }

      try {
        const message = await deleteEvent(eventId, eventType);

        setSelectedEvent(null);
        setSignal((prevSignal) => !prevSignal);
        setShowModal(false);
      } catch (error) {
        console.error(error);
      }
    }
  };
  const isValidDate = (d: any) => d instanceof Date && !isNaN(d);

  const totalEvents = trainings.concat(games).filter((event) => {
    const eventDate = new Date(event.attributes.date);
    return (
      isValidDate(date) &&
      eventDate.getDate() === date.getDate() &&
      eventDate.getMonth() === date.getMonth() &&
      eventDate.getFullYear() === date.getFullYear()
    );
  }).length;

  const currentEvent = trainings.concat(games).filter((event) => {
    const eventDate = new Date(event.attributes.date);
    return (
      isValidDate(date) &&
      eventDate.getDate() === date.getDate() &&
      eventDate.getMonth() === date.getMonth() &&
      eventDate.getFullYear() === date.getFullYear()
    );
  })[currentEventIndex];

  const eventsForSelectedDate = [...trainings, ...games].filter((event) => {
    const eventDate = new Date(event.attributes.date);
    return (
      isValidDate(date) &&
      eventDate.getDate() === date.getDate() &&
      eventDate.getMonth() === date.getMonth() &&
      eventDate.getFullYear() === date.getFullYear()
    );
  });

  //Paginacion modal2.0
  const currentModalEvent = eventsForSelectedDate[currentEventIndex];

  const handleNextEvent = () => {
    if (currentEventIndex < totalEvents - 1) {
      setCurrentEventIndex(currentEventIndex + 1);
    }
  };

  // Función para manejar el evento anterior
  const handlePrevEvent = () => {
    if (currentEventIndex > 0) {
      setCurrentEventIndex(currentEventIndex - 1);
    }
  };

  useEffect(() => {
    if (currentModalEvent) {
      setTitle(currentModalEvent.attributes.title);
      setDescription(currentModalEvent.attributes.description);
      setEventType("entrenamiento");

      if (currentModalEvent.attributes.exercises) {
        setTrainingExercises(currentModalEvent.attributes.exercises.data);
      } else {
        setTrainingExercises([]);
      }

      if (currentModalEvent.attributes.opponent) {
        setOpponent(currentModalEvent.attributes.opponent);
        setLocation(currentModalEvent.attributes.location);
        setExtraField("Partido contra");
        setEventType("partido");
      } else {
        setOpponent("");
        setLocation("");
        setExtraField("Lugar");
        setEventType("entrenamiento");
      }

      setOriginalEventDate(new Date(currentModalEvent.attributes.date)); // Guardar la fecha original
    }
  }, [currentModalEvent]);

  // Añadir evento si ya hay al menos uno ese dia
  useEffect(() => {
    const eventsCount = eventsForSelectedDate.length;
    setHasEvents(eventsCount > 0);
  }, [eventsForSelectedDate]);

  // paginacion y filtrado de exercises en el modal

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = ({ searchField, searchTerm }) => {
    if (
      typeof exercisesData === "object" &&
      exercisesData.data &&
      Array.isArray(exercisesData.data)
    ) {
      let filtered;
      if (searchTerm === "") {
        // Si el término de búsqueda está vacío, mostrar todos los ejercicios
        filtered = exercisesData.data;
      } else {
        filtered = exercisesData.data.filter((exercise) => {
          const fieldValue =
            exercise.attributes[searchField] &&
            exercise.attributes[searchField].toLowerCase();
          setSearchTerm(searchTerm);
          return fieldValue && fieldValue.includes(searchTerm.toLowerCase());
        });
      }
      console.log("searchField:", searchField);
      console.log("searchTerm:", searchTerm);
      setFilteredExercises(filtered);
      setCurrentPage(1);
    } else {
      console.error(
        "exercisesData is not an object with an array of exercises"
      );
    }
  };

  // Ordenar ejercicios: primero los marcados solo cuando no se busca nada
  let sortedExercises;
  if (searchTerm === "") {
    sortedExercises = filteredExercises.slice().sort((a, b) => {
      const aChecked = trainingExercises.some(
        (exercise) => exercise.id === a.id
      );
      const bChecked = trainingExercises.some(
        (exercise) => exercise.id === b.id
      );

      if (aChecked && !bChecked) {
        return -1; // a debe ir antes que b
      } else if (!aChecked && bChecked) {
        return 1; // b debe ir antes que a
      } else {
        return 0; // no hay preferencia de orden entre a y b
      }
    });
  } else {
    sortedExercises = filteredExercises;
  }

  // Paginación
  const indexOfLastExercise = currentPage * itemsPerPage;
  const indexOfFirstExercise = indexOfLastExercise - itemsPerPage;
  const currentExercises = sortedExercises.slice(
    indexOfFirstExercise,
    indexOfLastExercise
  );

  return (
    <div className="container mx-auto mt-40 px-4 sm:px-6 md:px-8 flex justify-center items-center">
      <div className="max-w-full p-4 w-full">
        <div className="w-full">
          <Calendar
            onChange={onChange}
            value={date}
            minDate={minDate}
            maxDate={maxDate}
            locale={es}
            formatLongDate={(locale, date) =>
              format(date, "MMMM yyyy", { locale })
            }
            className="mx-auto w-full"
            onClickDay={handleCalendarClick}
            tileContent={({ date, view }) => {
              if (!isValidDate(date)) {
                date = new Date();
              }

              const events = [
                ...trainings.map((training) => ({
                  date: new Date(training.attributes.date),
                  type: "training",
                })),
                ...games.map((game) => ({
                  date: new Date(game.attributes.date),
                  type: "game",
                })),
              ];

              const event = events.find((event) => {
                const eventDate = new Date(event.date); // Convertir la fecha del evento en una instancia de Date
                return (
                  eventDate.getDate() === date.getDate() && // Comparar con la fecha seleccionada en el calendario
                  eventDate.getMonth() === date.getMonth() &&
                  eventDate.getFullYear() === date.getFullYear()
                );
              });

              if (event) {
                return (
                  <div
                    className={
                      event.type === "training"
                        ? "training-event"
                        : "game-event"
                    }
                  ></div>
                );
              } else {
                return null;
              }
            }}
          />
          <div className="flex justify-center mt-4"></div>
        </div>
      </div>
      {showModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto bg-gray-500 bg-opacity-75">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
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
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:align-middle sm:max-w-3xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <div className="flex flex-row justify-between">
                      <h3
                        className="text-lg leading-6 font-medium text-gray-900"
                        id="modal-title"
                      >
                        {selectedEvent ? "Editar evento" : "Añadir evento"}
                      </h3>

                      {/* Paginacion modalera */}
                      <div className="flex flex-row justify-between">
                        {totalEvents > 1 && (
                          <div>
                            {/* Boton ant */}
                            {currentEventIndex > 0 && (
                              <button
                                onClick={handlePrevEvent}
                                className="custom-button mr-2"
                              >
                                ←
                              </button>
                            )}

                            {/* Boton sig */}
                            {currentEventIndex < totalEvents - 1 && (
                              <button
                                onClick={handleNextEvent}
                                className="custom-button mr-2"
                              >
                                →
                              </button>
                            )}
                          </div>
                        )}
                        {/* Fin paginacion */}

                        {/* Añadir evento si ya hay uno el mismo dia y es posterior o igual al dia actual */}
                        {date >= currentDate && hasEvents && (
                          <button
                            onClick={() => {
                              setShowModal(true);
                              setSelectedEvent(null);
                              setEventType("entrenamiento");
                              setTitle("");
                              setDescription("");
                              setOpponent("");
                              setLocation("");
                              setTrainingExercises([]);
                              setDate(date);
                            }}
                            className="custom-button"
                          >
                            +
                          </button>
                        )}
                      </div>

                      {/* fin añadir evento */}
                    </div>
                    <div className="mt-2">
                      <div className="mb-4">
                        <button
                          onClick={() => {
                            setEventType("entrenamiento");
                            setIsEditMode(false);
                          }}
                          className={`${
                            eventType === "entrenamiento"
                              ? "custom-button"
                              : "bg-gray-200 text-gray-700"
                          } py-2 px-4 rounded-l-md focus:outline-none`}
                        >
                          Entrenamiento
                        </button>
                        <button
                          onClick={() => {
                            setEventType("partido");
                            setIsEditMode(false);
                          }}
                          className={`${
                            eventType === "partido"
                              ? "custom-button"
                              : "bg-gray-200 text-gray-700"
                          } py-2 px-4 rounded-r-md focus:outline-none`}
                        >
                          Partido
                        </button>
                      </div>
                      {titleError && (
                        <p className="text-red-500">{titleError}</p>
                      )}
                      {descriptionError && (
                        <p className="text-red-500">{descriptionError}</p>
                      )}
                      {dateError && <p className="text-red-500">{dateError}</p>}
                      {exerciseError && (
                        <p className="text-red-500">{exerciseError}</p>
                      )}
                      {eventType === "partido" && opponentError && (
                        <p className="text-red-500">{opponentError}</p>
                      )}
                      {eventType === "partido" && locationError && (
                        <p className="text-red-500">{locationError}</p>
                      )}

                      {eventType === "entrenamiento" ? (
                        <>
                          <>
                            <p className="text-sm text-gray-500">
                              Fecha: {format(date, "dd/MM/yyyy")}
                            </p>

                            <input
                              type="text"
                              value={title}
                              onChange={(e) => setTitle(e.target.value)}
                              placeholder="Título"
                              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                            />

                            <input
                              type="text"
                              value={description}
                              onChange={(e) => setDescription(e.target.value)}
                              placeholder="Descripción"
                              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                            />

                            <div className="max-h-80 overflow-y-auto m-4">
                              {/* filtro */}
                              <ExerciseSearch onSearch={handleSearch} />
                              {/* fin filtro */}
                              {currentExercises.map((exercise) => (
                                <div
                                  key={exercise.id}
                                  className="flex items-center"
                                >
                                  <input
                                    type="checkbox"
                                    id={exercise.id}
                                    value={exercise.id}
                                    checked={trainingExercises.some(
                                      (e) => e.id === exercise.id
                                    )}
                                    onChange={handleExerciseChange}
                                    className="mr-2"
                                  />
                                  <label
                                    htmlFor={exercise.id}
                                    className="flex items-center"
                                  >
                                    {exercise.attributes?.img?.data?.attributes
                                      ?.url || exercise.img?.url ? (
                                      <img
                                        src={
                                          process.env.NEXT_PUBLIC_API_URL +
                                          (exercise.attributes?.img?.data
                                            ?.attributes?.url ||
                                            exercise.img?.url)
                                        }
                                        className="inline-block mr-2 w-10 h-10 rounded"
                                        alt={
                                          exercise.attributes?.title ||
                                          exercise.title
                                        }
                                      />
                                    ) : null}

                                    <span className="align-middle">
                                      {exercise.attributes?.title ||
                                        exercise.title}
                                    </span>

                                    <span className="ml-10">
                                      {exercise.attributes?.type ||
                                        exercise.type}
                                    </span>
                                  </label>
                                </div>
                              ))}
                            </div>
                            {/* paginacion exercises */}
                            <div className="mb-2">
                              <Pagination
                                currentPage={currentPage}
                                totalPages={Math.ceil(
                                  filteredExercises.length / itemsPerPage
                                )}
                                onPageChange={handlePageChange}
                              />
                            </div>
                            {/* fin paginacion exercises */}

                            {selectedEvent && (
                              <input
                                type="date"
                                onChange={(e) =>
                                  handleDateChange(
                                    e,
                                    selectedEvent.attributes.date
                                  )
                                }
                                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                              />
                            )}
                          </>
                        </>
                      ) : (
                        <>
                          <>
                            <p className="text-sm text-gray-500">
                              Fecha: {format(date, "dd/MM/yyyy")}
                            </p>
                            <input
                              type="text"
                              value={opponent}
                              onChange={(e) => setOpponent(e.target.value)}
                              placeholder="Opponent"
                              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                            />
                            <input
                              type="text"
                              value={location}
                              onChange={(e) => setLocation(e.target.value)}
                              placeholder="Location"
                              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                            />
                            {selectedEvent && (
                              <input
                                type="date"
                                onChange={(e) => setDate(e.target.value)}
                                className="mt-1 p-2 border border-gray-300 rounded-md w-full required:"
                              />
                            )}
                          </>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                {date >= currentDate && (
                  <button
                    onClick={handleAddEventSubmit}
                    className="w-full inline-flex justify-center custom-button sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    {selectedEvent ? "Guardar" : "Añadir"}
                  </button>
                )}

                <button
                  onClick={() => setShowModal(false)}
                  className="mt-3 w-full inline-flex justify-center custom-button-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancelar
                </button>
                {selectedEvent && (
                  <button
                    onClick={handleDeleteEvent}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-red-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-red-700 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Borrar
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCalendar;
