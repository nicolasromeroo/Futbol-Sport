
// Primera Pre-entrega JAVASCRIPT 


// tabla de promedios de un torneo de futbol

let opcionPrincipal
do {
    opcionPrincipal = Number(prompt("Chacarita, Dep. Maipu, y Quilmes están en zona de descenso...\n\n1_ Calcular promedios\n2_ Cantidad goles ultimos 2 partidos\n3_ Jugadores de baja para la próxima fecha\n\nPresione 0 para salir."))

    let equipo

    if (opcionPrincipal === 1) {
        function menuPromedios() {
            
            let total = 0 
            do {
                equipo = prompt("Escribí el nombre del equipo para averiguar promedio.\n\nChacarita\nDeportivo Maipu\nQuilmes\n\nPresiona 0 para salir.").toUpperCase()
                if (equipo !== "CHACARITA" && equipo !== "DEPORTIVO MAIPU" && equipo !== "QUILMES" ) {
                    alert("Equipo INEXISTENTE")
                } else if (equipo === "CHACARITA") {
                    total = promedios(3, 94, total)
                } else if (equipo === "DEPORTIVO MAIPU") {
                    total = promedios(2, 55, total)
                } else if (equipo === "QUILMES") {
                    total = promedios(8, 203, total)
                }
            } while (equipo !== "0")
        
            alert("El promedio de " + equipo + " es de: " + total)
        }
        
        function promedios(temporadasEn1ra, goles, total) {
            let subtotalPromedios = goles / temporadasEn1ra
            total += subtotalPromedios

            alert("El promedio de " + equipo + " es de " + subtotalPromedios)
        
            return total
        }
        
        menuPromedios ()
    } else if (opcionPrincipal === 2) {
        let equipo
        function menuGoles() {
            
            let total = 0 
            do {
                equipo = prompt("¿Cuántos goles tiene tu equipo favorito en los últimos dos partidos?\n\nChacarita\nDeportivo Maipu\nQuilmes\n\nEscriba 0 para volver al menú.").toUpperCase()
                if (equipo === "0") {
                    break
                } else if (equipo !== "CHACARITA" && equipo !== "DEPORTIVO MAIPU" && equipo !== "QUILMES") {
                    alert("Equipo INEXISTENTE")
                } else if (equipo === "CHACARITA") {
                    total = goles(1, 3, total)
                } else if (equipo === "DEPORTIVO MAIPU") {
                    total = goles(2, 1, total)
                } else if (equipo === "QUILMES") {
                    total = goles(0, 1, total)
                }
            } while (equipo !== 0)
            

            //alert(equipo + " tiene un total de " + total + " goles en los últimos 2 partidos.")
        }
    
        function goles(golesPenultimoPartido, golesUltimoPartido, total) {
            let subtotalGoles = golesPenultimoPartido + golesUltimoPartido
            total += subtotalGoles
            alert(equipo + " tiene un total de " + subtotalGoles + " goles en los últimos 2 partidos.")
        
            return total
        }
        
        menuGoles()
    } else if (opcionPrincipal === 3) {

        function menuExpulsados() {
            let total = 0
            do {
                equipo = prompt("¿Querés saber con cuántas bajas llega tu equipo al siguiente partido?\n\nChacarita\nDeportivo Maipu\nQuilmes\n\nEscriba 0 para volver al menú.").toUpperCase()
                if (equipo === "0") {
                    break
                } else if (equipo !== "CHACARITA" && equipo !== "DEPORTIVO MAIPU" && equipo !== "QUILMES") {
                    alert("Equipo INEXISTENTE")
                } else if (equipo === "CHACARITA") {
                    total = expulsados(1, 2, total)
                } else if (equipo === "DEPORTIVO MAIPU") {
                    total = expulsados(2, 0, total)
                } else if (equipo === "QUILMES") {
                    total = expulsados(0, 1, total)
                }
            } while (equipo !== 0)
        }

        function expulsados(amonestados, tarjetasRojas, total) {
            let subtotalExpulsados = amonestados + tarjetasRojas
            total += subtotalExpulsados
            alert("El equipo " + equipo + " tiene un total de " + subtotalExpulsados + " jugadores expulsados.")
        }

        menuExpulsados() 
    } 
} while (opcionPrincipal !== 0)







 