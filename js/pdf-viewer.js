// Configuración de PDF.js
const pdfjsLib = window['pdfjsLib']; // Referencia a PDF.js

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

// Spinner y barra de progreso
const spinner = document.getElementById('spinner');
const progressContainer = document.getElementById('progress-container');
const progressBar = document.getElementById('progress-bar');

// Variables de control
let pdfDoc = null;
let currentPage = 1;
let isRendering = false;
let pageQueue = null;
let scale = 1.0; // Escala inicial

// Función para mostrar un mensaje de error
const showError = (message) => {
  console.error(message);
  alert(message);
};

// Mostrar/Ocultar spinner
function showSpinner() {
  spinner.style.display = 'block';
}

function hideSpinner() {
  spinner.style.display = 'none';
}

// Mostrar/Ocultar barra de progreso
function showProgressBar() {
  progressContainer.style.display = 'block';
  progressBar.style.width = '0%'; // Reinicia el progreso
}

function hideProgressBar() {
  progressContainer.style.display = 'none';
}

// Actualizar la barra de progreso con un valor entre 0 y 100
function updateProgressBar(percentage) {
  progressBar.style.width = `${percentage}%`;
}

// Renderizar una página
const renderPage = (num) => {
  isRendering = true;
  showSpinner(); // Mostrar el spinner mientras se renderiza

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

    // Renderizar
    return page.render(renderContext).promise;
  })
  .then(() => {
    // Se terminó de renderizar la página
    hideSpinner();
    isRendering = false;

    // Si hay alguna página en la cola, renderizarla
    if (pageQueue !== null) {
      renderPage(pageQueue);
      pageQueue = null;
    }
  })
  .catch((err) => {
    showError(`Error al renderizar la página: ${err.message}`);
    hideSpinner();
  });

  // Mostrar el número de página actual en el DOM
  pageNumDisplay.textContent = num;
};

// Manejar la cola de renderizado
const queueRenderPage = (num) => {
  if (isRendering) {
    pageQueue = num;
  } else {
    renderPage(num);
  }
};

// Mostrar página anterior
const showPrevPage = () => {
  if (currentPage <= 1) return;
  currentPage--;
  queueRenderPage(currentPage);
};

// Mostrar página siguiente
const showNextPage = () => {
  if (currentPage >= pdfDoc.numPages) return;
  currentPage++;
  queueRenderPage(currentPage);
};

// Cargar el documento PDF con configuración de streaming
function loadPdf() {
  // Muestra la barra de progreso de descarga
  showProgressBar();

  // Configurar carga progresiva (streaming / range requests)
  const loadingTask = pdfjsLib.getDocument({
    url: pdfUrl,
    // Habilita peticiones Range para descarga progresiva
    rangeChunkSize: 65536 // 64 KB (puedes ajustar el tamaño)
  });

  // Control del evento de progreso
  loadingTask.onProgress = (progressData) => {
    if (progressData.total) {
      const percentage = (progressData.loaded / progressData.total) * 100;
      updateProgressBar(percentage.toFixed(2));
    } else {
      // Cuando no se conoce el total, igual podemos mostrar la parte cargada
      updateProgressBar(50); // valor estimado, por ejemplo
    }
  };

  // Cuando se completa la carga del documento
  loadingTask.promise.then((pdf) => {
    pdfDoc = pdf;
    pageCountDisplay.textContent = pdf.numPages;
    hideProgressBar(); // Ocultamos la barra de progreso
    renderPage(currentPage); // Renderizar la primera página
  })
  .catch((err) => {
    showError(`Error al cargar el PDF: ${err.message}`);
    hideProgressBar();
  });
}

// Eventos de los botones
prevButton.addEventListener('click', showPrevPage);
nextButton.addEventListener('click', showNextPage);

// Iniciar la carga
loadPdf();
