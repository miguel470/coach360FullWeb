"use client";
import React, { useState, useEffect } from "react";
import { getPlayers } from "../utils/getPlayers";
import { addPlayer } from "../utils/addPlayer";
import { editPlayer } from "../utils/editPlayer";
import { deletePlayer } from "../utils/deletePlayer";

function MyPlayers() {
  const [players, setPlayers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [newPlayerData, setNewPlayerData] = useState({
    name: "",
    position: "",
    state: "",
    birth: "",
    img: null,
  });
  const [editedPlayerData, setEditedPlayerData] = useState({
    name: "",
    position: "",
    state: "",
    birth: "",
    img: null,
  });

  const fetchPlayers = async () => {
    try {
      const data = await getPlayers();
      console.log(data);
      setPlayers(data.data);
    } catch (error) {
      console.error("Error fetching players:", error);
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  const handleAddPlayerClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedPlayer(null);
    setNewPlayerData({
      name: "",
      position: "",
      state: "",
      birth: "",
      img: null,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (selectedPlayer) {
      setEditedPlayerData({
        ...editedPlayerData,
        [name]: value,
      });
    } else {
      setNewPlayerData({
        ...newPlayerData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedPlayer) {
      try {
        await editPlayer(selectedPlayer.id, editedPlayerData);
        await fetchPlayers();
        console.log("Jugador editado con éxito:", editedPlayerData);
        setIsModalOpen(false);
      } catch (error) {
        console.error("Error al editar jugador:", error);
      }
    } else {
      try {
        await addPlayer(newPlayerData);
        await fetchPlayers();
        console.log("Nuevo jugador añadido:", newPlayerData);
        setIsModalOpen(false);
      } catch (error) {
        console.error("Error al añadir jugador:", error);
      }
    }
  };

  const handleDeletePlayer = async (playerId) => {
    try {
      await deletePlayer(playerId);

      await fetchPlayers();
      console.log("Jugador eliminado con éxito");
    } catch (error) {
      console.error("Error al eliminar jugador:", error);
    }
  };

  const handleEditPlayerClick = (player) => {
    setSelectedPlayer(player);
    setEditedPlayerData({
      name: player.attributes.name,
      position: player.attributes.position,
      state: player.attributes.state,
      birth: player.attributes.birth,
    });
    setIsModalOpen(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (selectedPlayer) {
      setEditedPlayerData({
        ...editedPlayerData,
        img: file,
      });
    } else {
      setNewPlayerData({
        ...newPlayerData,
        img: file,
      });
    }
  };

  return (
    <div>
      <button onClick={handleAddPlayerClick} className="custom-button mt-6">
        Añadir jugador
      </button>
      {isModalOpen && (
        <div className="modal fixed top-0 left-0 w-full h-full flex items-center justify-center">
          <div className="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"></div>
          <div className="modal-container bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto">
            <div className="modal-close absolute top-0 right-0 cursor-pointer flex flex-col items-center mt-4 mr-4 text-white text-sm z-50">
              <svg
                className="fill-current text-white"
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 18 18"
              >
                <path
                  className="heroicon-ui"
                  d="M6.364 6.364a.5.5 0 0 0-.708-.708L4 7.293 2.343 5.636a.5.5 0 0 0-.708.708L3.293 8l-1.657 1.657a.5.5 0 0 0 .708.708L4 8.707l1.657 1.657a.5.5 0 0 0 .708-.708L4.707 8l1.657-1.657a.5.5 0 0 0 0-.708zM9 2C4.029 2 0 6.029 0 11s4.029 9 9 9 9-4.029 9-9-4.029-9-9-9zm0 16c-4.96 0-9-4.04-9-9s4.04-9 9-9 9 4.04 9 9-4.04 9-9 9z"
                ></path>
              </svg>
            </div>

            <div className="modal-content py-4 text-left px-6">
              <h2 className="text-2xl font-semibold mb-4">
                {selectedPlayer ? "Editar jugador" : "Agregar jugador"}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="name"
                  >
                    Nombre:
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="name"
                    type="text"
                    name="name"
                    value={
                      selectedPlayer
                        ? editedPlayerData.name
                        : newPlayerData.name
                    }
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="position"
                  >
                    Posición:
                  </label>
                  <select
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="position"
                    name="position"
                    value={
                      selectedPlayer
                        ? editedPlayerData.position
                        : newPlayerData.position
                    }
                    onChange={handleInputChange}
                  >
                    <option value="">Seleccionar posición</option>
                    <option value="Portero">Portero</option>
                    <option value="Lateral Izquierdo">Lateral Izquierdo</option>
                    <option value="Defensa Central">Defensa Central</option>
                    <option value="Lateral Derecho">Lateral Derecho</option>
                    <option value="Mediocentro Defensivo">
                      Mediocentro Defensivo
                    </option>
                    <option value="Mediocentro">Mediocentro</option>
                    <option value="Mediocentro Ofensivo">
                      Mediocentro Ofensivo
                    </option>
                    <option value="Extremo Izquierdo">Extremo Izquierdo</option>
                    <option value="Delantero Centro">Delantero Centro</option>
                    <option value="Extremo Derecho">Extremo Derecho</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="state"
                  >
                    Estado:
                  </label>
                  <select
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="state"
                    name="state"
                    value={
                      selectedPlayer
                        ? editedPlayerData.state
                        : newPlayerData.state
                    }
                    onChange={handleInputChange}
                  >
                    <option value="">Seleccionar estado</option>
                    <option value="Sancionado">Sancionado</option>
                    <option value="Lesionado">Lesionado</option>
                    <option value="Baja forma">Baja forma</option>
                    <option value="Buena forma">Buena forma</option>
                    <option value="En racha">En racha</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="birth"
                  >
                    Fecha de nacimiento:
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="birth"
                    type="date"
                    name="birth"
                    value={
                      selectedPlayer
                        ? editedPlayerData.birth
                        : newPlayerData.birth
                    }
                    onChange={handleInputChange}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Imagen
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    name="image"
                    className="block w-full p-2 border border-gray-300 rounded"
                    onChange={handleImageChange}
                  />
                </div>
                <div className="flex flex-row-reverse">
                  <button type="submit" className="custom-button ml-3">
                    {selectedPlayer ? "Guardar" : "Añadir"}
                  </button>
                  <button
                    type="button"
                    className="custom-button-2"
                    onClick={handleModalClose}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      <div className="space-y-4 mt-6">
        {players.map((player) => (
          <div
            key={player.id}
            className="flex items-center justify-between bg-gradient-light border-2 mt-2 rounded-lg shadow-md p-4 flex-col sm:flex-row"
          >
            <img
              src={
                player.attributes?.img?.data?.attributes?.url
                  ? process.env.NEXT_PUBLIC_API_URL +
                    player.attributes.img.data.attributes.url
                  : ""
              }
              alt={player.attributes?.title || ""}
              className="w-44 h-44 object-cover rounded-lg"
            />

            <span className="text-lg font-semibold mt-2 mb-2">
              {player.attributes.name}
            </span>
            <span className="text-lg mt-2 mb-2">
              {player.attributes.position}
            </span>
            <span className="text-lg font-semibold mt-2 mb-2">
              {player.attributes.state}
            </span>
            <span className="text-lg mt-2 mb-2">{player.attributes.birth}</span>

            <div className="flex space-x-2">
              <button
                className="text-gray-700 rounded-full p-2 focus:outline-none hover:bg-green-500 transition duration-300"
                onClick={() => handleEditPlayerClick(player)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M5 19h1.098L16.796 8.302l-1.098-1.098L5 17.902zm-1 1v-2.52L17.18 4.288q.155-.137.34-.212T17.907 4t.39.064q.19.063.35.228l1.067 1.074q.165.159.226.35q.06.19.06.38q0 .204-.068.39q-.069.185-.218.339L6.519 20zM19.02 6.092l-1.112-1.111zm-2.782 1.67l-.54-.558l1.098 1.098z"
                  />
                </svg>
              </button>

              <button
                className="text-gray-700 rounded-full p-2 focus:outline-none hover:bg-red-400 transition duration-300"
                onClick={() => handleDeletePlayer(player.id)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M7 21q-.825 0-1.412-.587T5 19V6q-.425 0-.712-.288T4 5t.288-.712T5 4h4q0-.425.288-.712T10 3h4q.425 0 .713.288T15 4h4q.425 0 .713.288T20 5t-.288.713T19 6v13q0 .825-.587 1.413T17 21zM17 6H7v13h10zm-7 11q.425 0 .713-.288T11 16V9q0-.425-.288-.712T10 8t-.712.288T9 9v7q0 .425.288.713T10 17m4 0q.425 0 .713-.288T15 16V9q0-.425-.288-.712T14 8t-.712.288T13 9v7q0 .425.288.713T14 17M7 6v13z"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyPlayers;
