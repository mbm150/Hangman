//install
self.addEventListener('install', evt => {
    console.log('Instalado');
});
//activate
self.addEventListener('activate', evt => {
    console.log('Activado');
});
//fetch
self.addEventListener('fetch', evt => {
    console.log('Cazado', evt);
});