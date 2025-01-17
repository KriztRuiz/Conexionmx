// Configuración de PDF.js
const pdfjsLib = window['pdfjsLib']; // Usamos pdfjsLib correctamente

// Configurar el worker de PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

pdfjsLib.GlobalWorkerOptions.enableTextLayer = true;

// Generar la ruta del PDF dinámicamente
const currentPath = window.location.pathname; // Ruta completa de la página
const currentPageName = currentPath.split('/').pop().split('.').shift(); // Extraer el nombre del archivo sin extensión
const pdfUrl = `https://conexionmx.s3.us-east-2.amazonaws.com/pdf/${currentPageName}.pdf`; // Ruta dinámica del PDF

// Elementos del DOM
const canvas = document.getElementById('pdf-render');
const ctx = canvas.getContext('2d');
const prevButton = document.getElementById('prev-page');
const nextButton = document.getElementById('next-page');
const pageNumDisplay = document.getElementById('page-num');
const pageCountDisplay = document.getElementById('page-count');
const zoomControl = document.getElementById('zoom-control');
const errorDisplay = document.getElementById('error-message'); // Mostrar errores al usuario

// Variables de control
let pdfDoc = null;
let currentPage = 1;
let isRendering = false;
let pageQueue = null;
let scale = 2; // Escala inicial
const minScale = 0.5;
const maxScale = 3;

// Renderizar una página
const renderPage = (num) => {
  isRendering = true;

  // Obtener la página
  pdfDoc.getPage(num).then((page) => {
    const viewport = page.getViewport({ scale });
    canvas.width = window.innerWidth * 0.8; // Canvas responsivo
    canvas.height = (canvas.width / viewport.width) * viewport.height;

    const scaledViewport = page.getViewport({ scale: canvas.width / viewport.width });

    const renderContext = {
      canvasContext: ctx,
      viewport: scaledViewport,
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

  // Pre-renderizar la siguiente página si existe
  if (num < pdfDoc.numPages) {
    pdfDoc.getPage(num + 1).then((nextPage) => {
      const nextViewport = nextPage.getViewport({ scale });
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = nextViewport.width;
      tempCanvas.height = nextViewport.height;
      const tempCtx = tempCanvas.getContext('2d');

      nextPage.render({
        canvasContext: tempCtx,
        viewport: nextViewport,
      });
    });
  }
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

// Manejar el cambio de zoom
const handleZoomChange = () => {
  const newScale = parseFloat(zoomControl.value);
  if (newScale < minScale || newScale > maxScale) {
    showError(`El nivel de zoom debe estar entre ${minScale} y ${maxScale}`);
    return;
  }
  scale = newScale;
  queueRenderPage(currentPage);
};

// Mostrar mensajes de error al usuario
const showError = (message) => {
  errorDisplay.textContent = message;
  errorDisplay.style.display = 'block';
};

// Ocultar mensajes de error
const clearError = () => {
  errorDisplay.style.display = 'none';
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
zoomControl.addEventListener('input', handleZoomChange);
