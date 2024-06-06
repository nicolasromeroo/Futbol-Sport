
let equipo1 = []
let equipo2 = []
let equipoSeleccionado = []

principal()

async function principal() {
    const response = await fetch("./data.json")
    const jugadores = await response.json()

    equipoSeleccionado = obtenerEquipoSeleccionadoLS()
    renderizarJugadoresSeleccionados()

    equipo1 = equipoSeleccionado.filter(jugador => jugador.equipo === "equipo1")
    equipo2 = equipoSeleccionado.filter(jugador => jugador.equipo === "equipo2")

    // BOTONES
    let botonBuscar = document.getElementById("search")
    botonBuscar.addEventListener("click", () => filtrarYRenderizar(jugadores))
    renderizarJugadores(jugadores)

    let equiposElegidos = document.getElementById("equipos")
    equiposElegidos.addEventListener("click", verMiEquipo)

    let botonJugar = document.getElementById("botonJugar")
    botonJugar.addEventListener("click", () => filtrarYRenderizar(jugadores))
    renderizarJugadores(jugadores)
    botonJugar.addEventListener("click", jugar)

    // FILTROS DE BUSQUEDA
    let botonesFiltro = document.getElementsByClassName("botonParaFiltrar")
    for (const botonFiltro of botonesFiltro) {
        botonFiltro.addEventListener("click", (e) => filtrarYRenderizarJugadoresPorPosicion(e, jugadores))
    }

    // INPUT
    let inputBusqueda = document.getElementById("inputBusqueda")
    inputBusqueda.addEventListener("keypress", (e) => filtrarYRenderizarStart(jugadores, e))
}


// RESTO DE FUNCIONES (filtrar y buscar jugadores, ver jugadores en el equipo, etc)

function verMiEquipo(e) {
    let contenedorEquipo1 = document.getElementById("contenedorEquipo1")
    let contenedorEquipo2 = document.getElementById("contenedorEquipo2")

    contenedorEquipo1.classList.toggle("oculto")
    contenedorEquipo2.classList.toggle("oculto")

    if (e.target.innerText === "VER EQUIPOS") {
        e.target.innerText = "VER JUGADORES"
    } else {
        e.target.innerText = "VER EQUIPOS"
    }
}

// LOCAL STORAGE y JSON
function obtenerEquipoSeleccionadoLS() {
    let equipoSeleccionado = []
    let equipoSeleccionadoLS = JSON.parse(localStorage.getItem("equipoSeleccionado"))

    if (equipoSeleccionadoLS) {
        equipoSeleccionado = equipoSeleccionadoLS
    }
    return equipoSeleccionado
}

function jugar() {
    localStorage.removeItem("equipoSeleccionado")
    localStorage.removeItem("equipo1")
    localStorage.removeItem("equipo2")
    let botonPJugar = document.getElementById("botonJugar")
    botonPJugar.addEventListener("click", compararEquipos)
}

function filtrarYRenderizarJugadoresPorPosicion(e, jugadores) {
    let value = e.target.value
    let jugadoresFilt = jugadores.filter(jugador => jugador.posicion.includes(value))
    renderizarJugadores(jugadoresFilt)
}

function filtrarYRenderizarStart(jugadores, e) {
    if (e.keyCode === 13) {
        let jugadoresFiltrados = filtrarJugadores(jugadores)
        renderizarJugadores(jugadoresFiltrados)
    }
}

function filtrarYRenderizar(jugadores) {
    let jugadoresFiltrados = filtrarJugadores(jugadores)
    renderizarJugadores(jugadoresFiltrados)
}

function filtrarJugadores(jugadores) {
    let inputBusqueda = document.getElementById("inputBusqueda")
    return jugadores.filter(jugador => jugador.apellido.includes(inputBusqueda.value) || jugador.posicion.includes(inputBusqueda.value))
}

function renderizarJugadores(jugadores) {
    let contenedorDeJugadores = document.getElementById("contenedorJugadores")
    contenedorDeJugadores.innerHTML = ""

    jugadores.forEach(jugador => {
        let tarjetaDelJugador = document.createElement("div")

        tarjetaDelJugador.className = "tarjetaDelJugador"
        tarjetaDelJugador.innerHTML = `
            <h3>${jugador.apellido}</h3>
            <img class="firstImage" src=./images/${jugador.rutaImg}>
            <img class="ghostImg" src=./images/${jugador.rutaImg2}>
            <h4>${jugador.posicion}</h4>
            <button class="botonEquipo" id="${jugador.id}">Agregar al equipo</button>
        `
        contenedorDeJugadores.appendChild(tarjetaDelJugador)

        let botonEquipo = document.getElementById(jugador.id)

        botonEquipo.addEventListener("click", (e) => botonAgregarAlEquipo(e, jugadores, equipoSeleccionado))
    })
}

function botonAgregarAlEquipo(e, jugadores) {
    let equipoSeleccionado = obtenerEquipoSeleccionadoLS()
    let idDelJugador = Number(e.target.id)

    let jugadorEnEquipo = equipoSeleccionado.findIndex(jugador => jugador.id === idDelJugador)
    let jugadorBuscado = jugadores.find(jugador => jugador.id === idDelJugador)

    if (jugadorEnEquipo !== -1) {
        Swal.fire({
            title: "El jugador ya está seleccionado.",
            text: "Por favor, seleccione otro jugador.",
            icon: "error"
        })
    } else {
        let equipo = equipo1.length <= equipo2.length ? "equipo1" : "equipo2"

        // libreria toastify
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
        })
        // localStorage.setItem("equipoSeleccionado", JSON.stringify(equipoSeleccionado))
        let pts = jugadores.find(jugador => jugador.id === idDelJugador).pts

        if (equipo1.length < 5 && equipo2.length < 5) {

            if (equipo1.length <= equipo2.length) {
                equipo1.push({
                    id: jugadorBuscado.id,
                    nombre: jugadorBuscado.nombre,
                    apellido: jugadorBuscado.apellido,
                    posicion: jugadorBuscado.posicion,
                    pts: pts
                })
            } else {
                equipo2.push({
                    id: jugadorBuscado.id,
                    nombre: jugadorBuscado.nombre,
                    apellido: jugadorBuscado.apellido,
                    posicion: jugadorBuscado.posicion,
                    pts: pts
                })
            }
        } else {
            // libreria sweet alert
            Swal.fire({
                icon: "success",
                title: "¡Equipos completos! Presione JUGAR.",
                showConfirmButton: false,
                timer: 1500,
            })

        }
        localStorage.setItem("equipoSeleccionado", JSON.stringify(equipoSeleccionado))
        renderizarJugadoresSeleccionados(equipoSeleccionado)
    }
}

function compararEquipos() {
    let totalPtsEquipo1 = equipo1.reduce((total, jugador) => total + jugador.pts, 0)
    let totalPtsEquipo2 = equipo2.reduce((total, jugador) => total + jugador.pts, 0)

    if (totalPtsEquipo1 > totalPtsEquipo2) {
        // libreria sweet alert
        // Swal.fire({
        //     title: "¡Equipo 1 ha ganado!",
        //     text: "El Equipo 1 pasa a la siguiente instancia.",
        //     icon: "info"
        // })

        Swal.fire({
            title: "¡Equipo 1 ha ganado!",
            width: 600,
            padding: "3em",
            color: "#fff",
            position: "bottom",
            background: "transparent",
            backdrop: `
              rgba(0,0,0.4)
              url("/images/messiCopa.gif")
              400px
              center
              no-repeat
            `
        })
    } else if (totalPtsEquipo2 > totalPtsEquipo1) {
        // Swal.fire({
        //     title: "¡Equipo 2 ha ganado!",
        //     text: "El Equipo 2 pasa a la siguiente instancia.",
        //     icon: "info"
        //   })

        Swal.fire({
            title: "¡Equipo 2 ha ganado!",
            width: 600,
            padding: "3em",
            color: "#fff",
            position: "bottom",
            background: "transparent",
            backdrop: `
              rgba(0,0,0.4)
              url("/images/messiCopa.gif")
              400px
              center
              no-repeat
            `
        })


    } else {
        Swal.fire({
            title: "¡Empate!",
            icon: "info"
        })
    }
}

function renderizarJugadoresSeleccionados() {
    // obtenerEquipoSeleccionadoLS (del LocalStorage) para que se rendericen en el equipo seleccionado
    let equipoSeleccionado = obtenerEquipoSeleccionadoLS()

    let contenedorDelEquipo1 = document.getElementById("contenedorEquipo1");
    let contenedorDelEquipo2 = document.getElementById("contenedorEquipo2");
    contenedorDelEquipo1.innerHTML = ""
    contenedorDelEquipo2.innerHTML = ""

    // total de puntos de cada equipo
    let totalPtsEquipo1 = equipo1.reduce((total, jugador) => total + jugador.pts, 0)
    let totalPtsEquipo2 = equipo2.reduce((total, jugador) => total + jugador.pts, 0)

    equipoSeleccionado.forEach(jugador => {
        let tarjetaJugadorEquipo = document.createElement("div")

        tarjetaJugadorEquipo.className = "tarjetaJugadorEquipo"
        tarjetaJugadorEquipo.id = `tarjetaJugadorEquipo${jugador.id}`

        tarjetaJugadorEquipo.innerHTML = `
            <p>${jugador.nombre}</p>
            <p>${jugador.apellido}</p>
            <p class=posicionJugador>${jugador.posicion}</p>
            `
            // <button id=eliminar${jugador.id}>Bajar del equipo</button>

        if (jugador.equipo === "equipo1") {
            contenedorDelEquipo1.appendChild(tarjetaJugadorEquipo)
            totalPtsEquipo1 += jugador.pts || 0
        } else {
            contenedorDelEquipo2.appendChild(tarjetaJugadorEquipo)
            totalPtsEquipo2 += jugador.pts || 0
        }

        // let botonEliminar = document.getElementById(`eliminar${jugador.id}`)
        // botonEliminar.addEventListener("click", (e) => eliminar(equipoSeleccionado, e))
    })
    
    contenedorDelEquipo1.innerHTML += `<p>Total de puntos: ${totalPtsEquipo1}</p>`
    contenedorDelEquipo2.innerHTML += `<p>Total de puntos: ${totalPtsEquipo2}</p>`
}

// function eliminar(equipoSeleccionado, e) {

//     let id = e.target.id.substring(8)
//     let filaAEliminar = document .getElementById(`tarjetaJugadorEquipo${id}`)
//     filaAEliminar.remove()
//     console.log(equipoSeleccionado())
// }


