// Configuración de PDF.js
const pdfjsLib = window['pdfjsLib']; // Usamos pdfjsLib correctamente

// Configurar el worker de PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

// Ruta del PDF
const pdfUrl = 'https://conexionmx.s3.us-east-2.amazonaws.com/pdf/202501.pdf';

// Elementos del DOM
const canvas = document.getElementById('pdf-render');
const ctx = canvas.getContext('2d');
const prevButton = document.getElementById('prev-page');
const nextButton = document.getElementById('next-page');
const pageNumDisplay = document.getElementById('page-num');
const pageCountDisplay = document.getElementById('page-count');
const zoomInButton = document.getElementById('zoom-in');
const zoomOutButton = document.getElementById('zoom-out');

// Variables de control
let pdfDoc = null;
let currentPage = 1;
let isRendering = false;
let pageQueue = null;
let scale = 1.0; // Escala inicial

// Mostrar errores
const showError = (message) => {
    console.error(message);
    alert(message); // Muestra una alerta con el mensaje de error
};

// Renderizar una página
const renderPage = (num) => {
    isRendering = true;

    // Obtener la página
    pdfDoc.getPage(num).then((page) => {
        const viewport = page.getViewport({ scale });

        // Ajustar el canvas al tamaño del PDF
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const renderContext = {
            canvasContext: ctx,
            viewport: viewport,
        };

        page.render(renderContext).promise.then(() => {
            isRendering = false;

            if (pageQueue !== null) {
                renderPage(pageQueue);
                pageQueue = null;
            }
        });

        pageNumDisplay.textContent = num;
    }).catch((err) => {
        showError(`Error al renderizar la página: ${err.message}`);
    });
};

// Manejar la cola de renderizado
const queueRenderPage = (num) => {
    if (isRendering) {
        pageQueue = num;
    } else {
        renderPage(num);
    }
};

// Mostrar la página anterior
const showPrevPage = () => {
    if (currentPage <= 1) return;
    currentPage--;
    queueRenderPage(currentPage);
};

// Mostrar la siguiente página
const showNextPage = () => {
    if (currentPage >= pdfDoc.numPages) return;
    currentPage++;
    queueRenderPage(currentPage);
};

// Ajustar el zoom
const zoomIn = () => {
    scale += 0.1;
    queueRenderPage(currentPage);
};

const zoomOut = () => {
    if (scale > 0.5) {
        scale -= 0.1;
        queueRenderPage(currentPage);
    }
};

// Cargar el documento PDF
pdfjsLib.getDocument(pdfUrl).promise.then((pdf) => {
    pdfDoc = pdf;
    pageCountDisplay.textContent = pdf.numPages;
    renderPage(currentPage);
}).catch((err) => {
    showError(`Error al cargar el PDF: ${err.message}`);
});

// Eventos de los botones
prevButton.addEventListener('click', showPrevPage);
nextButton.addEventListener('click', showNextPage);
zoomInButton.addEventListener('click', zoomIn);
zoomOutButton.addEventListener('click', zoomOut);
