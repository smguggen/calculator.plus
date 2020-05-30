const server = require('express');
const app = server();
const path = require('path');
const themes = require('../src/themes.json');
const routes = Object.keys(themes);

routes.forEach(rte => {
   app.use(`/${rte}`, server.static(path.join(__dirname, '../build')));
});
app.use(server.static('./build'));

let appListener = app.listen(3500, () => console.log('App listening on port 3500')); 

appListener.on('error', (e) => {
    if (e.code !== 'EADDRINUSE') {
        appListener.close(() => {
            appListener = app.listen(3500, () => console.log('App listening on port 3500')); 
        });
        console.log(e);
    }
});