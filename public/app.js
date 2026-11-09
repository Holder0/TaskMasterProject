const urlApi = "http://localhost:3000/tasks";
const formularioTarea = document.getElementById("formularioTarea");
const tituloTarea = document.getElementById("tituloTarea");
const listaTareas = document.getElementById("listaTareas");
const cajaMensaje = document.getElementById("cajaMensaje");
const botonTemaOscuro = document.getElementById("botonTemaOscuro");

function mostrarMensaje(mensaje = "") {
  // Muestra mensajes simples.
  cajaMensaje.textContent = mensaje;
}

function crearElementoTarea(tarea) {
  const elementoTarea = document.createElement("li");
  const completada = Number(tarea.completed) === 1;
  elementoTarea.className = completada ? "elementoTarea completada" : "elementoTarea";

  const entradaCompletada = document.createElement("input");
  entradaCompletada.type = "checkbox";
  entradaCompletada.checked = completada;
  entradaCompletada.setAttribute("aria-label", `Completar: ${tarea.title}`);
  entradaCompletada.addEventListener("change", () => actualizarTarea(tarea, entradaCompletada.checked));

  const textoTarea = document.createElement("span");
  textoTarea.className = "textoTarea";
  textoTarea.textContent = tarea.title;

  const botonEliminar = document.createElement("button");
  botonEliminar.className = "botonEliminar";
  botonEliminar.type = "button";
  botonEliminar.textContent = "Eliminar";
  botonEliminar.addEventListener("click", () => eliminarTarea(tarea.id));

  elementoTarea.append(entradaCompletada, textoTarea, botonEliminar);
  return elementoTarea;
}

function mostrarTareas(tareas) {
  listaTareas.replaceChildren();

  if (tareas.length === 0) {
    const mensajeVacio = document.createElement("li");
    mensajeVacio.className = "mensajeVacio";
    mensajeVacio.textContent = "No hay tareas pendientes.";
    listaTareas.append(mensajeVacio);
    return;
  }

  tareas.forEach((tarea) => listaTareas.append(crearElementoTarea(tarea)));
}

async function cargarTareas() {
  // Carga las tareas del servidor.
  try {
    mostrarMensaje();
    const respuesta = await fetch(urlApi);

    if (!respuesta.ok) {
      throw new Error("No se pudieron cargar las tareas.");
    }

    mostrarTareas(await respuesta.json());
  } catch (error) {
    mostrarMensaje(error.message);
  }
}

async function agregarTarea(evento) {
  // Evita recargar el formulario.
  evento.preventDefault();
  const titulo = tituloTarea.value.trim();

  if (!titulo) {
    mostrarMensaje("Escribe una tarea antes de agregarla.");
    return;
  }

  try {
    const respuesta = await fetch(urlApi, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: titulo })
    });

    if (!respuesta.ok) {
      throw new Error("No se pudo agregar la tarea.");
    }

    formularioTarea.reset();
    await cargarTareas();
    tituloTarea.focus();
  } catch (error) {
    mostrarMensaje(error.message);
  }
}

async function actualizarTarea(tarea, estaCompletada) {
  try {
    const respuesta = await fetch(`${urlApi}/${tarea.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: tarea.title, completed: estaCompletada ? 1 : 0 })
    });

    if (!respuesta.ok) {
      throw new Error("No se pudo actualizar la tarea.");
    }

    await cargarTareas();
  } catch (error) {
    mostrarMensaje(error.message);
    await cargarTareas();
  }
}

async function eliminarTarea(idTarea) {
  try {
    const respuesta = await fetch(`${urlApi}/${idTarea}`, { method: "DELETE" });

    if (!respuesta.ok) {
      throw new Error("No se pudo eliminar la tarea.");
    }

    await cargarTareas();
  } catch (error) {
    mostrarMensaje(error.message);
  }
}

function cambiarTemaOscuro() {
  const estaModoOscuro = document.body.classList.toggle("modoOscuro");
  botonTemaOscuro.setAttribute("aria-pressed", String(estaModoOscuro));
  botonTemaOscuro.textContent = estaModoOscuro ? "Tema claro" : "Tema oscuro";
}

formularioTarea.addEventListener("submit", agregarTarea);
botonTemaOscuro.addEventListener("click", cambiarTemaOscuro);
cargarTareas();
