// Referencia al elemento HTML donde se renderizarán las cartas
const listaElementos = document.getElementById("listaElementos");

// Variables del juego
let cartas = []; // Almacena la lista de imágenes (pares de cartas) ya mezcladas
let seleccionadas = []; // Almacena las cartas seleccionadas actualmente
let bloqueado = false; // Controla si el tablero está bloqueado (p. ej., durante una animación)
const cultivosPorElemento = new Map(); // Relaciona cada carta HTML con su imagen correspondiente

/**
 * Genera las cartas del tablero y reinicia el estado del juego.
 * - Duplica y mezcla una lista de imágenes.
 * - Crea dinámicamente elementos HTML para las cartas.
 * - Limpia cualquier estado previo del juego.
 */
function generarCartas() {
    // Lista de imágenes que representan los cultivos
    const cultivos = [
        "img/Blueberry.png",
        "img/Cauliflower.png",
        "img/Cranberries.png",
        "img/Grape.png",
        "img/Melon.png",
        "img/Pumpkin.png",
        "img/Starfruit.png",
        "img/Strawberry.png"
    ];

    // Crear un array con los pares de cartas mezclados
    cartas = mezclarArray(cultivos.concat(cultivos));

    // Reiniciar estado del juego
    seleccionadas = [];
    bloqueado = false;
    cultivosPorElemento.clear(); // Vacía las asociaciones previas entre elementos y símbolos
    listaElementos.innerHTML = ""; // Limpia el tablero de cartas anteriores

    // Crear un elemento <li> para cada carta
    cartas.forEach((cultivo, index) => {
        const li = document.createElement("li");
        li.classList.add("elemento"); // Clase base para cada carta

        // Asociar la imagen de cultivo con este elemento en el mapa
        cultivosPorElemento.set(li, cultivo);

        // Crear la estructura HTML de la carta
        const carta = document.createElement("div");
        carta.classList.add("carta");

        // Crear la cara frontal de la carta
        const frontal = document.createElement("div");
        frontal.classList.add("lado", "frontal");

        // Imagen dentro de la cara frontal
        const img = document.createElement("img");
        img.src = cultivo; // Ruta de la imagen
        img.alt = "Imagen de memoria"; // Texto alternativo para accesibilidad
        img.classList.add("imagen"); // Clase CSS para personalización
        frontal.appendChild(img);

        // Crear la cara trasera de la carta
        const trasera = document.createElement("div");
        trasera.classList.add("lado", "trasera");
        trasera.textContent = "?"; // Indicador visual para la parte trasera

        // Montar la carta y agregarla al tablero
        carta.appendChild(frontal);
        carta.appendChild(trasera);
        li.appendChild(carta);
        listaElementos.appendChild(li);
    });
}

// Inicialización: generar el tablero al cargar la página
generarCartas();

/**
 * Delegación de eventos para manejar clics en las cartas.
 * - Identifica la carta seleccionada.
 * - Verifica condiciones (no bloqueado, no ya emparejada).
 * - Realiza lógica de volteo y comparación.
 */
listaElementos.addEventListener("click", (event) => {
    // Buscar el elemento <li> clicado
    const li = event.target.closest(".elemento");

    // Verificar que la carta es válida para interactuar
    if (li && !bloqueado && !li.classList.contains("pareja")) {
        const carta = li.querySelector(".carta");

        // Si la carta aún no está volteada, voltearla
        if (!carta.classList.contains("volteado")) {
            carta.classList.add("volteado");
            seleccionadas.push(li); // Agregar carta a las seleccionadas

            // Si hay dos cartas seleccionadas, comprobar coincidencia
            if (seleccionadas.length === 2) {
                verificarCoincidencia();
            }
        }
    }
});

/**
 * Verifica si las dos cartas seleccionadas coinciden.
 * - Si coinciden, las marca como emparejadas.
 * - Si no coinciden, las voltea de nuevo después de un retraso.
 * - Desbloquea el tablero una vez completado el proceso.
 */
function verificarCoincidencia(){
    bloqueado = true; // Bloquear interacción mientras se verifica
    const [carta1, carta2] = seleccionadas;

    // Obtener imágenes asociadas desde el mapa
    const cultivo1 = cultivosPorElemento.get(carta1);
    const cultivo2 = cultivosPorElemento.get(carta2);

    if (cultivo1 === cultivo2) {
        // Si las cartas coinciden, marcarlas como emparejadas
        carta1.classList.add("pareja");
        carta2.classList.add("pareja");
        seleccionadas = []; // Reiniciar las seleccionadas
        bloqueado = false; // Desbloquear interacción
    } else {
        // Si no coinciden, voltear las cartas nuevamente después de 1 segundo
        setTimeout(() => {
            carta1.querySelector(".carta").classList.remove("volteado");
            carta2.querySelector(".carta").classList.remove("volteado");
            seleccionadas = []; // Reiniciar las seleccionadas
            bloqueado = false; // Desbloquear interacción
        }, 1000);
    }
};

/**
 * Reinicia el juego al detectar la tecla "R".
 * - Limpia el tablero y genera nuevas cartas.
 */
document.addEventListener("keydown", (event) => {
    if (event.key === "r") {
        generarCartas(); // Generar nuevas cartas
    }
});

/**
 * Mezcla los elementos de un array usando el algoritmo de Fisher-Yates.
 * @param {Array} array - El array a mezclar.
 * @returns {Array} - Un nuevo array con los elementos mezclados.
 */
function mezclarArray(array) {
    let newArray = array.slice(); // Copia del array original
    const size = newArray.length;
    for (let i = size - 1; i > 0; i--) {
        // Seleccionar un índice aleatorio dentro del rango actual
        const j = Math.floor(Math.random() * (i + 1));
        // Intercambiar los elementos
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray; // Devolver el array mezclado
}