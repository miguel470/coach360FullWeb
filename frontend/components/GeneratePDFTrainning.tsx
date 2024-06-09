import React from "react";
import jsPDF from "jspdf";

const GeneratePDFButton = ({ selectedTraining }) => {
  const generatePDF = async () => {
    const doc = new jsPDF();
    const margin = 10;
    const pageHeight = doc.internal.pageSize.height;
    let yOffset = margin;

    // Añadir título
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text(selectedTraining.attributes.title, margin, yOffset);
    yOffset += 10;

    // Añadir descripción
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(selectedTraining.attributes.description, margin, yOffset);
    yOffset += 10;

    // Añadir ejercicios
    if (
      selectedTraining.attributes.exercises &&
      Array.isArray(selectedTraining.attributes.exercises.data)
    ) {
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("Ejercicios:", margin, yOffset);
      yOffset += 10;

      for (
        let index = 0;
        index < selectedTraining.attributes.exercises.data.length;
        index++
      ) {
        const exercise = selectedTraining.attributes.exercises.data[index];
        const imgUrl = `${process.env.NEXT_PUBLIC_API_URL}${exercise.attributes.img.data.attributes.url}`;
        const img = await fetch(imgUrl).then((res) => res.blob());
        const imgData = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(img);
        });

        const imageHeight = 50; // Cambia según el tamaño de la imagen
        if (yOffset + imageHeight > pageHeight - margin) {
          doc.addPage();
          yOffset = margin;
        }

        // Encabezado del ejercicio
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text(`Ejercicio ${index + 1}`, margin, yOffset);
        yOffset += 10;

        // Imagen del ejercicio
        doc.addImage(imgData, "JPEG", margin, yOffset, 50, 50);
        yOffset += 60;

        // Detalles del ejercicio
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Titulo:", margin, yOffset);
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text(exercise.attributes.title, margin + 30, yOffset); // Ajusta 30 para espaciar después de "Titulo:"
        yOffset += 10;

        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Descripción:", margin, yOffset);
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text(exercise.attributes.description, margin + 40, yOffset); // Ajusta 40 para espaciar después de "Descripción:"
        yOffset += 10;

        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Tipo:", margin, yOffset);
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text(exercise.attributes.type, margin + 20, yOffset); // Ajusta 20 para espaciar después de "Tipo:"
        yOffset += 10;

        // Raya delimitadora
        if (yOffset + 10 > pageHeight - margin) {
          doc.addPage();
          yOffset = margin;
        } else {
          yOffset += 5;
        }
        doc.setDrawColor(0, 0, 0);
        doc.line(
          margin,
          yOffset,
          doc.internal.pageSize.width - margin,
          yOffset
        );
        yOffset += 10;
      }
    }

    // Añadir fecha
    yOffset += 10;
    if (yOffset > pageHeight - margin) {
      doc.addPage();
      yOffset = margin;
    }
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Fecha:", margin, yOffset);
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text(selectedTraining.attributes.date, margin + 30, yOffset);

    // Descargar el PDF
    doc.save(`${selectedTraining.attributes.title}.pdf`);
  };

  return (
    <button onClick={generatePDF}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="50"
        height="50"
        viewBox="0 0 256 256"
      >
        <path
          fill="currentColor"
          d="M224 144v64a8 8 0 0 1-8 8H40a8 8 0 0 1-8-8v-64a8 8 0 0 1 16 0v56h160v-56a8 8 0 0 1 16 0m-101.66 5.66a8 8 0 0 0 11.32 0l40-40A8 8 0 0 0 168 96h-32V32a8 8 0 0 0-16 0v64H88a8 8 0 0 0-5.66 13.66Z"
        />
      </svg>
    </button>
  );
};

export default GeneratePDFButton;
