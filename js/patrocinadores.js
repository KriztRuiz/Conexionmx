const patrocinadores = [
    { src: "Galeria/patrocinador1.png", link: "https://www.facebook.com/profile.php?id=100013567775325" },
    { src: "Galeria/patrocinador2.png", link: "https://www.youtube.com/watch?v=UDB1Yfsxui4" },
    { src: "Galeria/patrocinador3.png", link: "https://www.youtube.com/watch?v=UxbQO-21Szg" },
    { src: "Galeria/patrocinador4.png", link: "https://www.youtube.com/watch?v=qQOa2PPaf9A" },
    { src: "Galeria/patrocinador5.png", link: "https://www.youtube.com/watch?v=QX268MIAsGw" },
    { src: "Galeria/patrocinador6.png", link: "https://www.facebook.com/profile.php?id=100083074103372" },
    { src: "Galeria/patrocinador7.png", link: "https://www.facebook.com/profile.php?id=100078469028505" },
    { src: "Galeria/patrocinador8.png", link: "https://www.facebook.com/TICKY68" },
  ];
  
  let currentIndex = 0;
  const imgElement = document.getElementById("patrocinador-img");
  
  // Cambia la imagen cada 3 segundos
  setInterval(() => {
    currentIndex = (currentIndex + 1) % patrocinadores.length;
    imgElement.src = patrocinadores[currentIndex].src;
  }, 3000);
  
  // Abre el enlace del patrocinador al hacer clic
  imgElement.addEventListener("click", () => {
    window.open(patrocinadores[currentIndex].link, "_blank");
  });
  