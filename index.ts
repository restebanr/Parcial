import express from "express"
import cors from "cors"
import axios from "axios"

const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());

type LD = {
id: number
filmName: string
rotationType: "CAV" | "CLV",
region: string,
lengthMinutes: number,
videoFormat: "NTSC" | "PAL"
}

let ld: LD[] = [
    { id: 1, filmName: "Entergalactic", rotationType: "CAV", region: "España", lengthMinutes: 200, videoFormat: "NTSC"},
    { id: 2, filmName: "Seven", rotationType: "CAV", region: "EEUU", lengthMinutes: 180, videoFormat: "PAL"}
]

app.listen(3000, () => console.log("Servidor en http://localhost:3000"));

app.get("/", (req,res) => {
    res.send("Te has conectado correctamente");
});

// Mostrar todos los discos
app.get("/ld/", (req, res) => {
    res.json(ld);
})

// Mostrar un disco por su ID
app.get("/ld/:id", (req,res) => {
    const idDisco = req.params.id
    const intId = Number(idDisco)

    const buscarId = ld.find((n) => n.id === intId)
    buscarId ? res.json(buscarId) : res.status(404).json ({
        message: "Disco no encontrado"
    })
})

// Guardar un nuevo disco
app.post("/ld/", (req, res) => {
    const newId = Date.now()
    const newfilmName = req.body.filmName;
    const newrotationType = req.body.rotationType;
    const newRegion = req.body.region;
    const newlengthMinutes = req.body.lengthMinutes;
    const newvideoFormat = req.body.videoFormat;

    if(typeof(newfilmName) == "string" && typeof(newRegion) == "string" && typeof(newlengthMinutes) == "number"){
        
        const newld: LD = {
            id: newId,
            filmName: newfilmName,
            rotationType: newrotationType,
            region: newRegion,
            lengthMinutes: newlengthMinutes,
            videoFormat: newvideoFormat

        }
        ld.push(newld);
        res.status(201).json(newld);
    } else {
        res.status(404).send("Mal body para creación de discos")
    }

})

// Eliminar un disco
app.delete("/ld/:id", (req,res) => {
    
    const eliminado = ld.find((elem) => elem.id === Number(req.params.id))
    if(eliminado) {
        ld = ld.filter((n) => n.id !== Number(req.params.id))
        res.status(201).json(eliminado)

    } else {
        res.status(404).send("No existe disco con ese ID")
    }
})


// EJERCICIO 2


const testApi = async() => {

    // Obtener todos los discos (GET /ld).
    // Muestra la lista inicial en consola.
    console.log("Lista inicial: ")
    const PromesaGet = (await(axios.get<LD[]>(`http://localhost:3000/ld/`))).data
    console.log(PromesaGet)

    // Crear un nuevo disco (POST /ld).
    // Volver a obtener todos los discos (GET /ld).
    const miDisco: LD = {
        id: 5,
        filmName: "The life of Chuck",
        rotationType: "CAV",
        region: "NY",
        lengthMinutes: 110,
        videoFormat: "NTSC"
    }

    axios.post(`http://localhost:3000/ld/`, miDisco)

    // Comprueba que aparece el nuevo disco.

    console.log("Lista con el nuevo disco: ")
    const PromesaGet2 = (await(axios.get<LD[]>(`http://localhost:3000/ld/`))).data
    console.log(PromesaGet2)

    // Eliminar ese equipo (DELETE /ld/:id).
    const eliminar = PromesaGet2.find((elem) => {
        if(miDisco.filmName === elem.filmName){
            return elem;
        }
    })

    const PromesaGet3 = (await(axios.delete<LD>(`http://localhost:3000/ld/${eliminar?.id}`))).data

    // Mostrar la lista final

    console.log("Lista con final con el nuevo disco eliminado: ")
    const PromesaGet4= (await(axios.get<LD[]>(`http://localhost:3000/ld/`))).data
    console.log(PromesaGet4)
}

    setTimeout((testApi),1000)