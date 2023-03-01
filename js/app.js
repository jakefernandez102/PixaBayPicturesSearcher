const PixaBayAPIKey = '33997753-036f874d7a1f64a41f0d0f24f';

const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');
const paginacionDiv = document.querySelector('#paginacion');
const registrosPorPagina = 40;
let totalPaginas;
let iterador;
let paginaActual = 1;

window.onload = function () {
    formulario.addEventListener('submit', validarFormulario);
};

function validarFormulario(e) {
    e.preventDefault();

    const terminoBusqueda = document.querySelector('#termino').value;

    if (terminoBusqueda === '') {
        mostrarAlerta('Agrega un termino de busqueda', 'error')
        return;
    }
    buscarImagenes();
}

function buscarImagenes() {

    const termino = document.querySelector('#termino').value;

    const key = PixaBayAPIKey;
    const url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=${registrosPorPagina}&page=${paginaActual}`;

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(datos => {
            totalPaginas = calcularPaginas(datos.totalHits);
            mostrarImagenes(datos.hits);
        });
}

//Generador que va a registrar la cantidad de elementos de acuerdo a las paginas
function *crearPaginador(total){
    for (let i = 1; i <= total; i++) {
        yield i;
    }
}

function calcularPaginas(total){

    return parseInt(Math.ceil( total / registrosPorPagina ));
}

function mostrarImagenes(imagenes) {

    //Limpia HTML
    limpiarHTML(resultado);

    //iterar sobre el arreglo de imagenes
    imagenes.forEach(imagen => {
        const { previewURL, likes, views, largeImageURL } = imagen;

        resultado.innerHTML += `
            <div class="w-1/2  md:w-1/3 lg:w-1/4 p-3 mb-4 ">
                <div class="bg-white h-48">
                    <img class="w-full h-full" src="${previewURL}">
                </div>
                <div class="bg-white  p-4 inline-flex flex-wrap content-between">
                    <div class="flex-col mr-5">
                        <p class="font-bold">${likes} <span ><i class="fas fa-heart" style="color: lightblue;"></i> </span> </p>
                    </div>
                    <div class="flex-col">
                        <p class="font-bold">${views} <span ><i <i class="fas fa-eye" style="color: lightblue;"></i></span> </p>
                    </div>

                    <a class="block w-full bg-blue-200 hover:bg-blue-500 text-white font-bold uppercase text-center rounded mt-5 p-1" href="${largeImageURL}" target="_blank" rel="noopener noreferrer">
                    Ver Imagen
                    <a/>
                </div>
            </div>
        `;
    });
    //Limpiar el paginador previo 
    limpiarHTML(paginacionDiv);
    
    //Generamos el nuevo HTML
    imprimirIterador();

}

function imprimirIterador(){
    iterador = crearPaginador(totalPaginas);

    while(true){
        const {value, done} = iterador.next();
        if(done){
            return;
        }
        //caso contrario genera un boton por cada elemento en el generador
        const boton = document.createElement('A');
        boton.href ='#';
        boton.dataset.pagina = value;
        boton.textContent = value;
        boton.classList.add('siguiente', 'bg-yellow-400','px-4','py-1','mr-2','mb-5','font-bold','rounded');

        boton.onclick = ()=>{
            paginaActual = value;
            buscarImagenes();
        }

        paginacionDiv.appendChild(boton);
    }
}

function limpiarHTML(selector) {
    while (selector.firstChild) {
        selector.removeChild(selector.firstChild);
    }
}

//mostrar alerta si no se llena el criterio de busqueda
function mostrarAlerta(mensaje) {

    const existeAlerta = document.querySelector('.bg-red-100');
    if (!existeAlerta) {
        const alerta = document.createElement('P');
        alerta.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 'rounded', 'max-w-lg', 'mx-auto', 'mt-6', 'text-center');
        alerta.innerHTML = `
            <strong class="font-bold">Error!</strong>
            <span class="block sm:inline">${mensaje}</span>
        `;

        formulario.appendChild(alerta);

        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }
}
