import { useEffect } from "react";

const useMarkCheckboxes = (selectedEvent, exercises, setTrainingExercises) => {
  useEffect(() => {
    const markCheckboxes = () => {
      if (selectedEvent) {
        const selectedExerciseIds =
          selectedEvent.attributes.exercises?.data.map(
            (exercise) => exercise.id
          ) || [];
        const selectedExercises = exercises.filter((exercise) =>
          selectedExerciseIds.includes(exercise.id)
        );
        setTrainingExercises(selectedExercises);
      } else {
        setTrainingExercises([]);
      }
    };

    markCheckboxes();
  }, [selectedEvent, exercises, setTrainingExercises]);
};

export default useMarkCheckboxes;
