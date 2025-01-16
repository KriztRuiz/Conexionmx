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

// Variables de control
let pdfDoc = null;
let currentPage = 1;
let isRendering = false;
let pageQueue = null;

// Renderizar una página
const renderPage = (num) => {
  isRendering = true;

  // Obtener la página
  pdfDoc.getPage(num).then((page) => {
    const viewport = page.getViewport({ scale: 1.5 });
    canvas.height = viewport.height;
    canvas.width = viewport.width;

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

// Cargar el documento PDF
pdfjsLib.getDocument(pdfUrl).promise.then((pdf) => {
  pdfDoc = pdf;
  pageCountDisplay.textContent = pdf.numPages;
  renderPage(currentPage);
}).catch((err) => {
  console.error(`Error al cargar el PDF: ${err.message}`);
});

// Eventos de los botones
prevButton.addEventListener('click', showPrevPage);
nextButton.addEventListener('click', showNextPage);
