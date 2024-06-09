// Prueba para hacer fetch en next.js

interface PruebaData {
  title: string;
}

const fetchPrueba = async (): Promise<PruebaData> => {
  try {
    const response = await fetch("http://localhost:1337/api/articles");
    const data: PruebaData = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export default fetchPrueba;
