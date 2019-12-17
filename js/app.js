
const photosURL = 'https://picsum.photos/v2/list';  // 'js/photos.json';
const main = document.getElementById('main');

/**
 * La clase Photo guarda la fracción del DOM y los datos que representan a cada foto que nos descargamos
 *
 * Schema -> {
 *  "id": "0",
 *  "author": "Alejandro Escamilla",
 *  "width": 5616,
 *  "height": 3744,
 *  "download_url": "https://picsum.photos/id/0/5616/3744"
 */
class Photo {
   // Crea el DOM para representar la foto
   constructor() {
      this.div = document.createElement('div');
      this.img = document.createElement('img');
      this.span = document.createElement('span');

      this.div.appendChild(this.img);
      this.div.appendChild(this.span);
   }

   // Guarda y rellena los datos en la foto, añadiéndola al DOM
   append(data) {
      this.data = data;
      this.div.id = 'photo-' + data.id;
      this.span.innerHTML = `${data.author}`;
      this.img.src = 'img/loading.gif';
      main.appendChild(this.div);
   }

   // Cargamos explícitamente la foto para saber cuándo está disponible
   load(url) {
      return window.fetch(url)
         .then(response => response.blob())
         .then(imageData => {
            this.img.src = window.URL.createObjectURL(imageData);
            console.log(`Foto '${this.data.id}' cargada!`)
         })
         .catch(err => {
            this.img.src = 'img/no-network.png';
            console.log(`Foto '${this.data.id}' NO cargada!`);
            return Promise.resolve();
         });
   }
}

// Obtenemos los datos de las fotos y las convertimos a JSON
window.fetch(photosURL)
   .then(res => res.json())

   // Creamos los objetos Photo y los añadimos al DOM
   .then(photos => {
      // Creamos el array que contendrá todas las promesas
      const promises = [];

      // Rellenamos el array con las promesas de carga de todas las fotos
      photos.map(photoData => {
         const photo = new Photo();
         photo.append(photoData);
         promises.push(
            photo.load(photoData.download_url),
         );
      });

      // Retornamos una promesa que se cumplirá cuando todas las fotos se hallan cargado
      return Promise.all(promises);
   })

   // Si se produce algún error de ejecución cargamos un placeholder de error
   // Estos errores pueden ser: la descarga del fetch, el parseado del json o un error JS en alguna función
   .catch(error => {
      const photo = new Photo();
      photo.append({
         'author': 'No hay datos por no haber conexión de red!'
      });
      photo.load('img/no-network.png');
      console.log('No tenemos datos de fotos!');
   })

   // Final de la cadena de promesas. Añadidmos al DOM un footer que nos avisa visualmente del final, vaya mal o bien
   .finally(() => {
      const h3 = document.createElement('h3');
      h3.innerHTML = `¡Cargadas todas las fotos disponibles!`;
      main.appendChild(h3);
      console.log('Fin del proceso de carga!');
   });
