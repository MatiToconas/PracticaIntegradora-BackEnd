const express = require('express');
const app = express();
const cors = require('cors');
const port = 5000;

const tipos = ['Programacion', 'Matematica', 'Clase Grabada'];

const tutoriales = [ 
    {
        idTutorial: 1, 
        nombreTutorial: 'Programacion en Node', 
        tipoTutorial: 'Clase Grabada',
        url: 'http://tutorial.unpaz.com/tuto',
        activo: true
    }
];

app.use(express.json());
app.use(cors());

app.get('/tutoriales', (req, res) => {
    res.status(200).json( tutoriales  );
} );

app.get('/tutoriales/:idTutorial', (req, res) => {
    const idTutorial = req.params.idTutorial;
    const tutorialEncontrado = tutoriales.find( t => t.idTutorial == idTutorial);
    if (undefined != tutorialEncontrado)
        res.status(200).json(tutorialEncontrado);
    else
        res.status(404).json( {"Mensaje": `El tutorial con id ${idTutorial} no fue encontrado`} );
});

app.post('/tutoriales', (req, res) => {
    const {nombreTutorial, tipoTutorial, url, activo} = req.body;
    const ids = tutoriales.map(t => t.idTutorial);
    const max = ids.length > 0 ? Math.max( ...ids) + 1 : 1;
    const tutorialNuevo = {
        idTutorial: max, 
        nombreTutorial, 
        tipoTutorial, 
        url, 
        activo
    };
    if(
        tutorialNuevo.nombreTutorial.length < 30 &&
        tutorialNuevo.url.length < 255 &&
        tipos.find(t => t.toLowerCase() === tipoTutorial.toLowerCase())
     ){
        tutoriales.push (tutorialNuevo);
        res.status(201).json(tutorialNuevo);
        }else
            res.status(404).json( {"Mensaje": `No se pudo crear el tutorial, verifique los datos`} );
    
} );

app.delete('/tutoriales/:idTutorial', (req, res) => {
    const idTutorial = req.params.idTutorial;
    const tutorial = tutoriales.find( t => t.idTutorial == idTutorial);
    if (undefined != tutorial) {
       const idx = tutoriales.indexOf(tutorial);
       tutoriales.splice(idx, 1);
       res.status(202).json( {"Mensaje": `El tutorial ${idTutorial} fue eliminado`, "tutorial": tutorial} );
    }
    else
        res.status(404).json( {"Mensaje": `El tutorial ${idTutorial} no fue encontrado`} );
});

app.put('/tutoriales/:idTutorial/activar', (req, res) => {
    const idTutorial = req.params.idTutorial;
    const tutorial = tutoriales.find( t => t.idTutorial == idTutorial);
    if (undefined != tutorial) {
        const idx = tutoriales.indexOf(tutorial);
        tutorial.activo = !tutorial.activo;
        tutoriales.splice(idx, 1, tutorial);
        res.status(202).json( {"Mensaje": `El tutorial ${idTutorial} fue modificado`, "tutorial": tutorial} );
    }
    else
        res.status(404).json( {"Mensaje": `El tutorial ${idTutorial} no fue encontrado`} );
});

app.put('/tutoriales/:idTutorial/cambiarTipo', (req, res) => {
    const tipoTutorial = req.body.tipoTutorial;
    const idTutorial = req.params.idTutorial;
    const tutorial = tutoriales.find( t => t.idTutorial == idTutorial);
    if (undefined != tutorial) {
        const idx = tutoriales.indexOf(tutorial);
        tutorial.tipoTutorial = tipoTutorial;
        tutoriales.splice(idx, 1, tutorial);
        res.status(202).json( {"Mensaje": `El tutorial ${idTutorial} fue modificado`, "tutorial": tutorial} );
    }
    else
        res.status(404).json( {"Mensaje": `El tutorial ${idTutorial} no fue encontrado`} );
});


app.listen(port, () => {
    console.log(`Aplicacion iniciada en el puerto local: ${port}`)
});
