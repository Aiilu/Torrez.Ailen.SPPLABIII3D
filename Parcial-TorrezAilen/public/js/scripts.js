import Anuncio_Mascota from "./anuncioMascota.js";

let listaAnuncios = [];
let listaModificada = [];
let idAutoIncremental;
let idRef;

window.addEventListener("DOMContentLoaded", () => {
  getAnuncioAjax();

  document.addEventListener("submit", manejaSubmit);

  document.addEventListener("click", manejaClick);
});

function getAnuncioAjax() {
  agregarSpinner();

  const xhr = new XMLHttpRequest();

  xhr.onreadystatechange = () => {
    if (xhr.readyState == 4) {
      if (xhr.status >= 200 && xhr.status < 299) {
        listaAnuncios = JSON.parse(xhr.responseText);
        filtrarCampos();
        eliminarSpinner();
      } else {
        const statusText = xhr.statusText || "Ocurrio un error";

        console.error(`Error: ${xhr.status} : ${statusText}`);
      }
    }
  };

  xhr.open("GET", "http://localhost:3000/anuncios");

  xhr.send();
}

function manejaSubmit(e) {
  e.preventDefault();

  const frm = e.target;

  if (listaAnuncios.length > 0) {
    idAutoIncremental = listaAnuncios[listaAnuncios.length - 1].id + 1;
  } else {
    idAutoIncremental = 1;
  }

  const nuevoAnuncio = new Anuncio_Mascota(
    idAutoIncremental,
    frm.tituloF.value,
    frm.transH.value,
    frm.descripcionF.value,
    frm.precioF.value,
    frm.tipoF.value,
    frm.razaF.value,
    frm.fechaF.value,
    frm.vacunaA.value
  );

  postAnuncioAjax(nuevoAnuncio);

  limpiarFormulario(document.forms[0]);
}

function postAnuncioAjax(nuevoAnuncio)
{
  agregarSpinner();

  const xhr = new XMLHttpRequest();

  xhr.onreadystatechange = () => {
    if (xhr.readyState == 4) {
      if (xhr.status >= 200 && xhr.status < 299) {
        listaAnuncios.push(JSON.parse(xhr.responseText));
        filtrarCampos();
        eliminarSpinner();
      } else {
        const statusText = xhr.statusText || "Ocurrio un error";
        console.error(`Error: ${xhr.status} : ${statusText}`);
      }
    }
  };

  xhr.open("POST", "http://localhost:3000/anuncios");

  xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");

  xhr.send(JSON.stringify(nuevoAnuncio));
};

function guardarAnuncio() {
  const frm = document.forms[0];
  const index = listaAnuncios.findIndex((el) => el.id === parseInt(idRef));

  listaAnuncios[index].titulo = frm.tituloF.value;
  listaAnuncios[index].transaccion = frm.transH.value;
  listaAnuncios[index].descripcion = frm.descripcionF.value;
  listaAnuncios[index].precio = frm.precioF.value;
  listaAnuncios[index].tipo = frm.tipoF.value;
  listaAnuncios[index].raza = frm.razaF.value;
  listaAnuncios[index].fecha = frm.fechaF.value;
  listaAnuncios[index].vacuna = frm.vacunaA.value;

  putAnuncioAjax(listaAnuncios[index]);
}

function putAnuncioAjax(anuncio)
{
  agregarSpinner();

  const xhr = new XMLHttpRequest();

  xhr.onreadystatechange = () => {
    if (xhr.readyState == 4) {
      if (xhr.status >= 200 && xhr.status < 299) {
        filtrarCampos();
        eliminarSpinner();
      } else {
        const statusText = xhr.statusText || "Ocurrio un error";

        console.error(`Error: ${xhr.status} : ${statusText}`);
      }
    }
  };

  xhr.open("PUT", `http://localhost:3000/anuncios/${idRef}`);

  xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");

  xhr.send(JSON.stringify(anuncio));
};

function limpiarFormulario(frm) {
  frm.reset();
  document.getElementById("btnGuardar").classList.add("oculto");
  document.getElementById("btnEliminar").classList.add("oculto");
  document.getElementById("btnCancelar").classList.add("oculto");
}

function agregarSpinner() {
  document.getElementById("tablaF").classList.add("oculto2");

  let spinner = document.createElement("img");
  spinner.setAttribute("src", "./assets/spinner.gif");
  spinner.setAttribute("alt", "imagen spinner");

  document.getElementById("spinnerF").appendChild(spinner);
}

function eliminarSpinner() {
  const spinner2 = document.getElementById("spinnerF");

  while (spinner2.hasChildNodes()) {
    spinner2.removeChild(spinner2.firstChild);
  }

  document.getElementById("tablaF").classList.remove("oculto2");
}

function renderizarLista(lista1, contenedor) {
  while (contenedor.hasChildNodes()) {
    contenedor.removeChild(contenedor.firstChild);
  }

  if (lista1) {
    contenedor.appendChild(lista1);
  }

  document.getElementById("tablaF").classList.remove("oculto2");
}

function crearTabla(items) {
  const tabla = document.createElement("table");

  tabla.appendChild(crearThead(items[0]));
  tabla.appendChild(crearTbody(items));

  tabla.classList.add("table");
  tabla.classList.add("table-bordered");
  tabla.classList.add("table-hover");

  return tabla;
}

function crearThead(item) {
  const thead = document.createElement("thead");
  const tr = document.createElement("tr");

  for (const key in item) {
    const th = document.createElement("th");
    th.textContent = key;
    tr.appendChild(th);
    tr.classList.add("text-uppercase");
    tr.classList.add("table-dark");
  }

  thead.appendChild(tr);
  return thead;
}

function crearTbody(items) {
  const tbody = document.createElement("tbody");

  items.forEach((item) => {
    const tr = document.createElement("tr");

    for (const key in item) {
      const td = document.createElement("td");
      td.textContent = item[key];
      tr.appendChild(td);
    }

    tbody.appendChild(tr);
  });

  return tbody;
}

function manejaClick(e) {
  const ref = e.target;

  if (ref.matches("td")) {
    idRef = e.target.parentNode.firstElementChild.textContent;

    cargarFormulario();
  } else if (ref.matches("#btnCancelar")) {
    limpiarFormulario(document.forms[0]);
  } else if (ref.matches("#btnEliminar")) {
    if (confirm("Confirmar Baja?")) {
      deleteAnuncioAjax();
    }

    limpiarFormulario(document.forms[0]);
  } else if (ref.matches("#btnGuardar")) {
    if (confirm("Confirmar Modificacion?")) {
      guardarAnuncio();
    }

    limpiarFormulario(document.forms[0]);
  } else if (ref.matches("#btnAplicar")) {
    filtrarCampos();
  }
}

function deleteAnuncioAjax()
{
  agregarSpinner();

  const xhr = new XMLHttpRequest();

  xhr.onreadystatechange = () => {
    if (xhr.readyState == 4) {
      if (xhr.status >= 200 && xhr.status < 299) {
        const index = listaAnuncios.findIndex((el) => el.id === parseInt(idRef));
        listaAnuncios.splice(index, 1);
        filtrarCampos(); 
        eliminarSpinner();
      } else {
        const statusText = xhr.statusText || "Ocurrio un error";
        console.error(`Error: ${xhr.status} : ${statusText}`);
      }
    }
  };

  xhr.open("DELETE", `http://localhost:3000/anuncios/${idRef}`);

  xhr.send();
};

function cargarFormulario() {
  const {
    titulo,
    transaccion,
    descripcion,
    precio,
    tipo,
    raza,
    fecha,
    vacuna,
  } = listaAnuncios.filter((el) => el.id === parseInt(idRef))[0];

  const frm = document.forms[0];

  frm.tituloF.value = titulo;
  frm.transH.value = transaccion;
  frm.descripcionF.value = descripcion;
  frm.precioF.value = precio;
  frm.tipoF.value = tipo;
  frm.razaF.value = raza;
  frm.fechaF.value = fecha;
  frm.vacunaA.value = vacuna;

  document.getElementById("btnGuardar").classList.remove("oculto");
  document.getElementById("btnEliminar").classList.remove("oculto");
  document.getElementById("btnCancelar").classList.remove("oculto");
}

// SEGUNDO PARCIAL - CODIGO
function filtrarCampos() {
  const ref = document.getElementById("filtrarFF").value;

  if (ref === "G") {
    listaModificada = listaAnuncios.filter((c) => c.tipo === "Gato");
  } else if (ref === "P") {
    listaModificada = listaAnuncios.filter((c) => c.tipo === "Perro");
  } else {
    listaModificada = listaAnuncios;
  }

  mapear();
  promedio();
}

function mapear() {
  let listaMapeada = listaModificada.map((row) => {
    let fila = {};
    for (const key in row) {
      if (document.getElementById("cbox" + key).checked) {
        fila[key] = row[key];
      }
    }
    return fila;
  });

  renderizarLista(crearTabla(listaMapeada), document.getElementById("tablaF"));
}

function promedio() {
  const ref = document.getElementById("promedio");
  if (listaModificada.length > 0) {
    const listaModificada2 = listaModificada.map((e) => parseInt(e.precio));

    let prom = listaModificada2.reduce((p, a) => p + a, 0);

    prom = prom / listaModificada.length;

    ref.value = prom;
  } else {
    ref.value = 0;
  }
}