document.addEventListener('DOMContentLoaded', () => {
    // Seleccionas todos los botones de about
    const aboutTabs = document.querySelectorAll('.about-tab');
    // Seleccionas todos los contenedores correspondientes
    const aboutItems = document.querySelectorAll('.about-item');
  
    aboutTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        // 1) Quitas la clase "hidden" a todos, y luego se la pones
        // o 2) De manera más simple, primero ocultas todo:
        aboutItems.forEach(item => {
          item.classList.add('hidden');
        });
        // 3) Luego, muestras el item que coincida con data-target
        const target = tab.getAttribute('data-target'); // "origin", "vision", ...
        const itemToShow = document.getElementById(target);
        if (itemToShow) {
          itemToShow.classList.remove('hidden');
        }
      });
    });
  
    // Algo similar para los info-tabs:
    const infoTabs = document.querySelectorAll('.info-tab');
    const infoSections = document.querySelectorAll('.info-section');
  
    infoTabs.forEach(infoBtn => {
      infoBtn.addEventListener('click', () => {
        // Oculta todas las info-sections
        infoSections.forEach(section => {
          section.classList.add('hidden');
        });
        // Muestra la que coincida con data-target
        const target = infoBtn.getAttribute('data-target'); // "1", "2", "3"
        // Como en tu HTML tienes tres .info-section, puedes controlar el orden:
        //   index 0 => data-target = "1"
        //   index 1 => data-target = "2"
        //   index 2 => data-target = "3"
        // O usar IDs, depende de cómo prefieras.
        const index = parseInt(target, 10) - 1; // Convertir "1" en 0, "2" en 1, etc.
        if (infoSections[index]) {
          infoSections[index].classList.remove('hidden');
        }
      });
    });
  });
  