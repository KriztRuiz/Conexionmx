document.addEventListener("DOMContentLoaded", () => {
    const menuButton = document.getElementById("menu-button");
    const navMenu = document.querySelector("#nav ul");

    // Función para manejar la visibilidad según el ancho de la pantalla
    const updateMenuDisplay = () => {
        if (window.innerWidth >= 600) {
            // Menú visible y horizontal en pantallas grandes
            menuButton.style.display = "none";
            navMenu.classList.add("visible");
            navMenu.classList.remove("hidden");
            navMenu.style.display = "inline-flex";
        } else {
            // Menú oculto en pantallas pequeñas
            menuButton.style.display = "block";
            navMenu.classList.add("hidden");
            navMenu.classList.remove("visible");
            navMenu.style.display = "none";
        }
    };

    // Verificar el ancho de la pantalla al cargar la página
    updateMenuDisplay();

    // Alternar visibilidad del menú en pantallas pequeñas
    menuButton.addEventListener("click", () => {
        if (navMenu.classList.contains("hidden")) {
            navMenu.classList.remove("hidden");
            navMenu.classList.add("visible");
            navMenu.style.display = "block";
        } else {
            navMenu.classList.remove("visible");
            navMenu.classList.add("hidden");
            navMenu.style.display = "none";
        }
    });

    // Ajustar el menú al redimensionar la pantalla
    window.addEventListener("resize", updateMenuDisplay);
});
