document.addEventListener("DOMContentLoaded", () => {
    const tarjetaContainer = document.querySelector(".tarjetas");
    const imageFolder = "Galeria"; // Ruta donde están almacenadas las imágenes

    // Generar el array dinámico de nombres de imágenes
    const generateImageFiles = (start, end) => {
        const startYear = parseInt(start.slice(0, 4));
        const startMonth = parseInt(start.slice(4, 6));
        const endYear = parseInt(end.slice(0, 4));
        const endMonth = parseInt(end.slice(4, 6));

        const imageFiles = [];

        for (let year = startYear; year <= endYear; year++) {
            const monthStart = year === startYear ? startMonth : 1;
            const monthEnd = year === endYear ? endMonth : 12;

            for (let month = monthStart; month <= monthEnd; month++) {
                const formattedMonth = month.toString().padStart(2, '0'); // Asegura que los meses tengan dos dígitos
                imageFiles.push(`${year}${formattedMonth}.jpg`);
            }
        }

        return imageFiles;
    };

    // Generar y ordenar las imágenes de más reciente a más antigua
    const imageFiles = generateImageFiles("202202", "202501").reverse();

    // Mostrar las tarjetas en bloques de 12
    const tarjetasPorPagina = 12;
    let paginaActual = 0;

    const mostrarTarjetas = () => {
        const inicio = paginaActual * tarjetasPorPagina;
        const fin = inicio + tarjetasPorPagina;

        imageFiles.slice(inicio, fin).forEach(file => {
            // Extraer el año y mes del nombre de la imagen
            const year = file.substring(0, 4);
            const month = file.substring(4, 6);

            // Convertir el número del mes a su nombre en español
            const monthNames = [
                "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
                "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
            ];
            const monthName = monthNames[parseInt(month, 10) - 1];

            // Crear el enlace y la tarjeta
            const tarjeta = document.createElement("div");
            tarjeta.classList.add("tarjeta");

            const enlace = document.createElement("a");
            enlace.href = `Revistas/${year}${month}.html`; // Ruta de la página correspondiente
            enlace.target = "_blank";

            const imagen = document.createElement("img");
            imagen.src = `${imageFolder}/${file}`;
            imagen.alt = `${monthName} ${year}`;

            const nombreEdicion = document.createElement("p");
            nombreEdicion.textContent = `${monthName} ${year}`;

            // Añadir elementos a la tarjeta
            enlace.appendChild(imagen);
            enlace.appendChild(nombreEdicion);
            tarjeta.appendChild(enlace);

            // Añadir la tarjeta al contenedor
            tarjetaContainer.appendChild(tarjeta);
        });

        paginaActual++;

        // Ocultar el botón si no hay más tarjetas
        if (paginaActual * tarjetasPorPagina >= imageFiles.length) {
            botonMostrarMas.style.display = "none";
        }
    };

    // Crear el botón "Mostrar más"
    const botonMostrarMas = document.createElement("button");
    botonMostrarMas.textContent = "Mostrar más";
    botonMostrarMas.classList.add("mostrar-mas");
    botonMostrarMas.addEventListener("click", mostrarTarjetas);

    // Estilo del botón
    botonMostrarMas.style.display = "block";
    botonMostrarMas.style.margin = "20px auto";
    botonMostrarMas.style.padding = "10px 20px";
    botonMostrarMas.style.fontSize = "16px";
    botonMostrarMas.style.borderRadius = "8px";
    botonMostrarMas.style.backgroundColor = "#8C796B";
    botonMostrarMas.style.color = "#fff";
    botonMostrarMas.style.border = "none";
    botonMostrarMas.style.cursor = "pointer";

    botonMostrarMas.addEventListener("mouseover", () => {
        botonMostrarMas.style.backgroundColor = "#755C4D";
    });

    botonMostrarMas.addEventListener("mouseout", () => {
        botonMostrarMas.style.backgroundColor = "#8C796B";
    });

    // Añadir el botón al contenedor
    tarjetaContainer.insertAdjacentElement("afterend", botonMostrarMas);

    // Mostrar las primeras tarjetas
    mostrarTarjetas();
});
