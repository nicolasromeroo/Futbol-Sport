let equipo1 = [];
let equipo2 = [];
let equipoSeleccionado = [];

principal();

async function principal() {
    const response = await fetch("./data.json");
    const jugadores = await response.json();

    equipoSeleccionado = obtenerEquipoSeleccionadoLS();
    renderizarJugadoresSeleccionados();

    equipo1 = equipoSeleccionado.filter(jugador => jugador.equipo === "equipo1");
    equipo2 = equipoSeleccionado.filter(jugador => jugador.equipo === "equipo2");

    // BOTONES
    let botonBuscar = document.getElementById("search");
    botonBuscar.addEventListener("click", () => filtrarYRenderizar(jugadores));
    renderizarJugadores(jugadores);

    let equiposElegidos = document.getElementById("equipos");
    equiposElegidos.addEventListener("click", verMiEquipo);

    let botonJugar = document.getElementById("botonJugar");
    botonJugar.addEventListener("click", jugar);

    // FILTROS DE BUSQUEDA
    let botonesFiltro = document.getElementsByClassName("botonParaFiltrar");
    for (const botonFiltro of botonesFiltro) {
        botonFiltro.addEventListener("click", (e) => filtrarYRenderizarJugadoresPorPosicion(e, jugadores));
    }

    // INPUT
    let inputBusqueda = document.getElementById("inputBusqueda");
    inputBusqueda.addEventListener("keypress", (e) => filtrarYRenderizarStart(jugadores, e));
}

function verMiEquipo(e) {
    let contenedorEquipo1 = document.getElementById("contenedorEquipo1");
    let contenedorEquipo2 = document.getElementById("contenedorEquipo2");

    contenedorEquipo1.classList.toggle("oculto");
    contenedorEquipo2.classList.toggle("oculto");

    if (e.target.innerText === "VER EQUIPOS") {
        e.target.innerText = "VER JUGADORES";
    } else {
        e.target.innerText = "VER EQUIPOS";
    }
}

function obtenerEquipoSeleccionadoLS() {
    let equipoSeleccionado = [];
    let equipoSeleccionadoLS = JSON.parse(localStorage.getItem("equipoSeleccionado"));

    if (equipoSeleccionadoLS) {
        equipoSeleccionado = equipoSeleccionadoLS;
    }
    return equipoSeleccionado;
}

function jugar() {
    if (equipo1.length !== 5 || equipo2.length !== 5 || !verificarArqueros()) {
        Swal.fire({
            title: "Ambos equipos deben tener 5 jugadores incluyendo un arquero.",
            icon: "error"
        });
        return;
    }

    localStorage.removeItem("equipoSeleccionado")
    localStorage.removeItem("equipo1")
    localStorage.removeItem("equipo2")
    jugarPenales();
}

function filtrarYRenderizarJugadoresPorPosicion(e, jugadores) {
    let value = e.target.value;
    let jugadoresFilt = jugadores.filter(jugador => jugador.posicion.includes(value));
    renderizarJugadores(jugadoresFilt);
}

function filtrarYRenderizarStart(jugadores, e) {
    if (e.keyCode === 13) {
        let jugadoresFiltrados = filtrarJugadores(jugadores);
        renderizarJugadores(jugadoresFiltrados);
    }
}

function filtrarYRenderizar(jugadores) {
    let jugadoresFiltrados = filtrarJugadores(jugadores);
    renderizarJugadores(jugadoresFiltrados);
}

function filtrarJugadores(jugadores) {
    let inputBusqueda = document.getElementById("inputBusqueda");
    return jugadores.filter(jugador => jugador.apellido.includes(inputBusqueda.value) || jugador.posicion.includes(inputBusqueda.value));
}

function renderizarJugadores(jugadores) {
    let contenedorDeJugadores = document.getElementById("contenedorJugadores");
    contenedorDeJugadores.innerHTML = "";

    jugadores.forEach(jugador => {
        let tarjetaDelJugador = document.createElement("div");

        tarjetaDelJugador.className = "tarjetaDelJugador";
        tarjetaDelJugador.innerHTML = `
            <h3>${jugador.apellido}</h3>
            <img class="firstImage" src=./images/${jugador.rutaImg}>
            <img class="ghostImg" src=./images/${jugador.rutaImg2}>
            <h4>${jugador.posicion}</h4>
            <button class="botonEquipo" id="${jugador.id}">Agregar al equipo</button>
        `;
        contenedorDeJugadores.appendChild(tarjetaDelJugador);

        let botonEquipo = tarjetaDelJugador.querySelector(".botonEquipo");

        botonEquipo.addEventListener("click", (e) => botonAgregarAlEquipo(e, jugadores));
    });
}

function botonAgregarAlEquipo(e, jugadores) {
    let equipoSeleccionado = obtenerEquipoSeleccionadoLS();
    let idDelJugador = Number(e.target.id);

    let jugadorEnEquipo = equipoSeleccionado.findIndex(jugador => jugador.id === idDelJugador);
    let jugadorBuscado = jugadores.find(jugador => jugador.id === idDelJugador);

    if (jugadorEnEquipo !== -1) {
        Swal.fire({
            title: "El jugador ya está seleccionado.",
            text: "Por favor, seleccione otro jugador.",
            icon: "error"
        });
    } else {
        // Verificar si ambos equipos ya tienen 5 jugadores
        if (equipo1.length >= 5 && equipo2.length >= 5) {
            Swal.fire({
                title: "Ambos equipos ya tienen 5 jugadores.",
                text: "No se pueden agregar más jugadores.",
                icon: "info"
            });
            return;
        }

        let equipo = equipo1.length <= equipo2.length ? "equipo1" : "equipo2";

        Toastify({
            text: "Jugador agregado al equipo",
            style: {
                background: "#000",
            },
            duration: 3000
        }).showToast();

        equipoSeleccionado.push({
            id: jugadorBuscado.id,
            nombre: jugadorBuscado.nombre,
            apellido: jugadorBuscado.apellido,
            posicion: jugadorBuscado.posicion,
            equipo: equipo
        });

        if (equipo === "equipo1") {
            equipo1.push(jugadorBuscado);
        } else {
            equipo2.push(jugadorBuscado);
        }

        localStorage.setItem("equipoSeleccionado", JSON.stringify(equipoSeleccionado));
        renderizarJugadoresSeleccionados();

        // Check if the game can start
        if (equipo1.length + equipo2.length >= 10) {
            if (!verificarArqueros()) {
                return;
            } else {
                // Llamar a la función para deshabilitar la interacción
                finalizarSeleccionDeEquipos();
            }
        }
    }
}

function finalizarSeleccionDeEquipos() {
    // Deshabilitar los botones de agregar jugadores
    let botonesEquipo = document.querySelectorAll(".botonEquipo");
    botonesEquipo.forEach(boton => boton.disabled = true);

    // Mostrar un mensaje indicando que los equipos están completos
    Swal.fire({
        title: "Equipos completos",
        text: "Ambos equipos ya tienen 5 jugadores y están listos para jugar.",
        icon: "success"
    });
}

function renderizarJugadoresSeleccionados() {
    let equipoSeleccionado = obtenerEquipoSeleccionadoLS();

    let contenedorDelEquipo1 = document.getElementById("contenedorEquipo1");
    let contenedorDelEquipo2 = document.getElementById("contenedorEquipo2");
    contenedorDelEquipo1.innerHTML = "";
    contenedorDelEquipo2.innerHTML = "";

    let totalPtsEquipo1 = 0;
    let totalPtsEquipo2 = 0;

    equipoSeleccionado.forEach(jugador => {
        let tarjetaJugadorEquipo = document.createElement("div");

        tarjetaJugadorEquipo.className = "tarjetaJugadorEquipo";
        tarjetaJugadorEquipo.id = `tarjetaJugadorEquipo${jugador.id}`;

        tarjetaJugadorEquipo.innerHTML = `
            <p>${jugador.nombre}</p>
            <p>${jugador.apellido}</p>
            <p class=posicionJugador>${jugador.posicion}</p>
        `;

        if (jugador.equipo === "equipo1") {
            contenedorDelEquipo1.appendChild(tarjetaJugadorEquipo);
            totalPtsEquipo1 += jugador.pts || 0;
        } else {
            contenedorDelEquipo2.appendChild(tarjetaJugadorEquipo);
            totalPtsEquipo2 += jugador.pts || 0;
        }
    });

    contenedorDelEquipo1.innerHTML += `<p>Total de puntos: ${totalPtsEquipo1}</p>`;
    contenedorDelEquipo2.innerHTML += `<p>Total de puntos: ${totalPtsEquipo2}</p>`;
}

function verificarArqueros() {
    console.log('Equipo 1:', equipo1);
    console.log('Equipo 2:', equipo2);

    const arqueroEquipo1 = equipo1.find(jugador => jugador.posicion === 'arquero');
    const arqueroEquipo2 = equipo2.find(jugador => jugador.posicion === 'arquero');

    if (!arqueroEquipo1 || !arqueroEquipo2) {
        Swal.fire({
            title: "Falta un arquero en algún equipo.",
            text: "Agrega un arquero antes de jugar la tanda de penales.",
            icon: "error"
        });
        return false;
    }

    return true;
}

// Añadir esta función para jugar la tanda de penales
function jugarPenales() {
    let golesEquipo1 = 0;
    let golesEquipo2 = 0;

    do {
        let penalesEquipo1 = equipo1.map(jugador => ({
            jugador,
            acierto: Math.random() < jugador.probabilidad / 100
        }));

        let penalesEquipo2 = equipo2.map(jugador => ({
            jugador,
            acierto: Math.random() < jugador.probabilidad / 100
        }));

        golesEquipo1 += penalesEquipo1.reduce((total, penal) => total + (penal.acierto ? 1 : 0), 0);
        golesEquipo2 += penalesEquipo2.reduce((total, penal) => total + (penal.acierto ? 1 : 0), 0);

    } while (golesEquipo1 === golesEquipo2);

    Swal.fire({
        title: "Resultado",
        html: `
            <p>${equipo1.length > 1 ? 'Equipo 1' : equipo1[0].nombre + ' (Arquero)'}</p>
            <p>${golesEquipo1} ${golesEquipo1 === 1 ? 'gol' : 'goles'}</p>
            <hr>
            <p>${equipo2.length > 1 ? 'Equipo 2' : equipo2[0].nombre + ' (Arquero)'}</p>
            <p>${golesEquipo2} ${golesEquipo2 === 1 ? 'gol' : 'goles'}</p>
        `,
        icon: "info"
    });
}
