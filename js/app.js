
const photosURL = 'https://picsum.photos/v2/list';  // 'js/photos.json';

window.fetch(photosURL)
   .then(res => res.json())
   .then(photos => {
      console.log(`tenemos ${photos.length} fotos!`);
   })
   .catch(error => {
      console.log('No tenemos datos de fotos!');
   });
