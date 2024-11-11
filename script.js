
// Espera que el contenido de la pagina se refresque o cargue para continuar su ejecucion
document.addEventListener("DOMContentLoaded", () => {

    // Obtiene la referencia al formulario y los botones en el DOM
    const form = document.getElementById("personaForm");
    const updateBtn = document.getElementById("updateBtn");
    const tableBody = document.querySelector("#personaTable tbody");

    let isEditing = false;      // Variable para Saber cuando se actualiza un registro

    fetchPersonas();
    // manejo de los eventos del formulario
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        // Obtenemos los datos del formulario y guardamos en variables
        const cedula = form.cedula.value;
        const nombre = form.nombre.value;
        const edad = form.edad.value;
        const profesion = form.profesion.value;

        //Datos de la persona a registrar en la Tabla Persona
        const personaData = { cedula, nombre, edad, profesion };

        createPersona(personaData);

    });

    // Obtener la lista de registros de la tabla persona
    function fetchPersonas() {
        fetch("/api/obtener")
            .then((response) => response.json())
            .then((data) => renderPersonas(data.data))
            .catch((error) => console.log("Error en el fetching de personas", error));
    }

    // Renderizar la tabla de visualizacion de registros
    function renderPersonas(personas) {
        tableBody.innerHTML = ""; // Limpio la tabla antes de agregar datos
        personas.forEach(persona => {
            // crear demanera dinamica las filas de la tabla
            const row = document.createElement("tr");
            row.innerHTML = `
            <td> ${persona.cedula}</td>
            <td> ${persona.nombre}</td>
            <td> ${persona.edad}</td>
            <td> ${persona.profesion}</td>
            <td> <button onclick="deletePersona('${persona.cedula}')"> Borrar </button>
             <button onclick="editPersona('${persona.cedula}')"> Editar </button>
            <td>
            `;
            // Agregar a la tabla la nueva fila dinamica con sus columnas
            tableBody.appendChild(row);
        });
    }
});