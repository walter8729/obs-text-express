import config from "../config";
import fs from "fs";
import { v4 } from "uuid";

//leer json con los zocalos desde archivo
const json_zocalos = fs.readFileSync("src/zocalos.json", "utf-8");

let zocalos = JSON.parse(json_zocalos);

const json_zocalosAux = fs.readFileSync("src/zocalosaux.json", "utf-8");

let zocalosAux = JSON.parse(json_zocalosAux);



// leer txt zocalo invividual, desde archivo, t0 auxiliar, t1 y t2 zocalo

let t0 = fs.readFileSync("src/t0.txt", "utf-8");

let t1 = fs.readFileSync("src/t1.txt", "utf-8");

let t2 = fs.readFileSync("src/t2.txt", "utf-8");




export const renderIndexPage = (req, res) => res.render("index", { zocalos, zocalosAux });

export const renderAboutPage = (req, res) => res.render("about", config);

export const renderNewEntryPage = (req, res) => res.render("new-entry");



export const updateAux = (req, res) => {
  const { id, titulo } = req.body;

  console.log("reques id " + id);
  console.log("reques titulo" + titulo);
  for (let index = 0; index < zocalosAux.length; index++) {
    if (zocalosAux[index].id == id) {
      console.log("Actualizando TEXTO AUXILIAR");
      zocalosAux[index].titulo = titulo.toUpperCase();
      // saving data
      console.log("Escribiendo el JSON");
      const json_zocalosAux = JSON.stringify(zocalosAux);
      fs.writeFileSync("src/zocalosaux.json", json_zocalosAux);
      
      console.log("Escribiendo el txt");
      fs.writeFileSync("src/t0.txt", zocalosAux[index].titulo, "utf-8");
    }
  }
  console.log({ zocalosAux });


  res.redirect("/");
};



export const createNewEntry = (req, res) => {
  const { titulo, subtitulo } = req.body;
  if (!titulo || !subtitulo) {
    res.status(400).send("Falta completar los campos");
    return;
  }

  let newZocalo = {
    id: v4(),
    titulo: titulo.toUpperCase(),
    subtitulo: subtitulo.toUpperCase(),
    toUse: false
  };

  // agregar una entrada al array
  zocalos.push(newZocalo);

  // grabar arrego en un fichero json
  const json_zocalos = JSON.stringify(zocalos);
  fs.writeFileSync("src/zocalos.json", json_zocalos, "utf-8");

  res.redirect("/");
};

export const deleteEntry = (req, res) => {
  console.log({ zocalos });
  zocalos = zocalos.filter((zocalo) => zocalo.id != req.params.id);
  // saving data
  const json_zocalos = JSON.stringify(zocalos);
  fs.writeFileSync("src/zocalos.json", json_zocalos);
  res.redirect("/");
};

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export const updateEntry = (req, res) => {
  const { id, titulo, subtitulo } = req.body;
  if (!titulo || !subtitulo) {
    res.status(400).send("Tienes que rellenar todos los campos para actualizar");
    return;
  }

  for (let index = 0; index < zocalos.length; index++) {
    if (zocalos[index].id == id) {
      console.log("Actualizando una entrada");
      zocalos[index].titulo = titulo.toUpperCase();
      zocalos[index].subtitulo = subtitulo.toUpperCase();
      if (zocalos[index].toUse == true) {
        console.log("Esta entrada estaba en uso asi que se actualiza tambien la salida");
        fs.writeFileSync("src/t1.txt", zocalos[index].titulo, "utf-8");
        fs.writeFileSync("src/t2.txt", zocalos[index].subtitulo, "utf-8");
      }
    }
  }
  console.log({ zocalos });
  // saving data
  const json_zocalos = JSON.stringify(zocalos);
  fs.writeFileSync("src/zocalos.json", json_zocalos);

  res.redirect("/");
};


// mark to use
export const toUseEntry = (req, res) => {

  for (let index = 0; index < zocalos.length; index++) {
    if (zocalos[index].id == req.params.id) {
      console.log("Cambiando entrada en uso USO");
      zocalos[index].toUse = true;
      console.log(zocalos[index]);
      fs.writeFileSync("src/t1.txt", zocalos[index].titulo, "utf-8");
      fs.writeFileSync("src/t2.txt", zocalos[index].subtitulo, "utf-8");
    } else {
      zocalos[index].toUse = false;
    }
  }
  // saving data
  const json_zocalos = JSON.stringify(zocalos);
  fs.writeFileSync("src/zocalos.json", json_zocalos);
  res.redirect("/");
};
