import { format } from "date-fns";

const handleDoubleClick = (
  value: Date,
  trainings: any[],
  games: any[],
  setShowModal: (value: boolean) => void,
  setSelectedEvent: (event: any | null) => void,
  setEventType: (type: string) => void,
  setTitle: (title: string) => void,
  setDescription: (description: string) => void,
  setOpponent: (opponent: string) => void,
  setLocation: (location: string) => void,
  setTrainingExercises: (exercises: any[]) => void,
  setDate: (date: Date) => void,
  setIsEditMode: (value: boolean) => void,
  selectedEvent: any | null
) => {
  const clickedDate = new Date(value);
  const formattedDate = format(
    clickedDate,
    "EEE MMM dd yyyy HH:mm:ss 'GMT'xxx '('zzz')'"
  );

  const comparatorDate = format(value, "yyyy-MM-dd");

  const clickedTraining = trainings.find(
    (event) => event.attributes.date === comparatorDate
  );
  const clickedGame = games.find(
    (event) => event.attributes.date === comparatorDate
  );

  if (!clickedTraining && !clickedGame) {
    setShowModal(true);
    setSelectedEvent(null);
    setEventType("entrenamiento");
    setTitle("");
    setDescription("");
    setOpponent("");
    setLocation("");
    setTrainingExercises([]);
    setDate(value);
  } else if (clickedTraining) {
    setSelectedEvent(clickedTraining);
    setEventType("entrenamiento");
    setTitle(clickedTraining.attributes.title);
    setDescription(clickedTraining.attributes.description);
    setOpponent("");
    setLocation("");
    setDate(value);
    setShowModal(true);
    setIsEditMode(true);

    if (selectedEvent && Array.isArray(selectedEvent.attributes.exercises)) {
      const selectedTrainingExercises = selectedEvent.attributes.exercises.map(
        (exercise: any) => ({
          id: exercise.id,
        })
      );
      setTrainingExercises(selectedTrainingExercises);
    } else {
      setTrainingExercises([]);
    }
  } else if (clickedGame) {
    setSelectedEvent(clickedGame);
    setEventType("partido");
    setTitle(clickedGame.attributes.title);
    setOpponent(clickedGame.attributes.opponent || "");
    setLocation(clickedGame.attributes.location || "");
    setDescription("");
    setDate(new Date(clickedGame.attributes.date));
    setShowModal(true);
    setIsEditMode(true);
  }
};

export { handleDoubleClick };

import addEvent from "./addEvent";
import editEvent from "./editEvent";

const handleAddEventSubmit = async (
  eventType: string,
  title: string,
  description: string,
  opponent: string,
  location: string,
  trainingExercises: any[],
  date: Date,
  currentModalEvent: any | null,
  setSelectedEvent: (event: any | null) => void,
  setSignal: (value: boolean) => void,
  setShowModal: (value: boolean) => void
) => {
  try {
    if (currentModalEvent) {
      const exerciseIds = trainingExercises.map((exercise) => exercise.id);
      const newDate = date || new Date(currentModalEvent.attributes.date);
      const newExercisesIdsToSend =
        exerciseIds.length > 0
          ? exerciseIds
          : currentModalEvent.attributes.exercises.data.map(
              (exercise) => exercise.id
            ) || [];

      await editEvent(
        currentModalEvent.id,
        eventType,
        title,
        description,
        opponent,
        location,
        newExercisesIdsToSend,
        newDate
      );
    } else {
      await addEvent(
        eventType,
        title,
        description,
        opponent,
        location,
        trainingExercises,
        date
      );
    }

    setSelectedEvent(null);
    setShowModal(false);
    setSignal((prevSignal) => !prevSignal);
  } catch (error) {
    console.error(error);
  }
};

export { handleAddEventSubmit };
