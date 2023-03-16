import config from "../config";
import fs from "fs";
import { v4 } from "uuid";
import { obs, sendCommand } from '../obs';
import { compareVersions } from 'compare-versions'


//variables para control obs
const OBS_WEBSOCKET_LATEST_VERSION = '5.0.2'
// State
let connected
let heartbeat = {}
let heartbeatInterval
let isFullScreen
let isStudioMode = false
let isSceneOnTop
let isVirtualCamActive
//let isIconMode = window.localStorage.getItem('isIconMode') || false;
let isReplaying;
let editable = false;
let address;
let password;
let scenes = [];
let replayError = '';
let errorMessage = '';
let imageFormat = 'jpg';
let programScene = ''
let previewScene = ''

//////////////////



async function connect() {
  address = address || 'ws://localhost:4455'
  if (address.indexOf('://') === -1) {
    const secure = location.protocol === 'https:' || address.endsWith(':443')
    address = secure ? 'wss://' : 'ws://' + address
  }
  console.log('Connecting to:', address, '- using password:', password)
  await disconnect()
  try {
    const { obsWebSocketVersion, negotiatedRpcVersion } = await obs.connect(
      address,
      password
    )
    console.log(
      `Connected to obs-websocket version ${obsWebSocketVersion} (using RPC ${negotiatedRpcVersion})`
    )
  } catch (e) {
    console.log(e)
    errorMessage = e.message
  }
};

async function disconnect() {
  await obs.disconnect()
  clearInterval(heartbeatInterval)
  connected = false
  errorMessage = 'Disconnected'
};

// OBS events
obs.on('ConnectionClosed', () => {
  connected = false
  // window.history.pushState(
  //   '',
  //   document.title,
  //   window.location.pathname + window.location.search
  // ) // Remove the hash
  console.log('Connection closed')
})

obs.on('Identified', async () => {
  console.log('Connected')
  connected = true
  const data = await sendCommand('GetVersion')
  const version = data.obsWebSocketVersion || ''
  console.log('OBS-websocket version:', version)
  if (compareVersions(version, OBS_WEBSOCKET_LATEST_VERSION) < 0) {
    alert(
      'You are running an outdated OBS-websocket (version ' +
      version +
      '), please upgrade to the latest version for full compatibility.'
    )
  }
  if (
    data.supportedImageFormats.includes('webp') &&
    document
      .createElement('canvas')
      .toDataURL('image/webp')
      .indexOf('data:image/webp') === 0
  ) {
    imageFormat = 'webp'
  }
  heartbeatInterval = setInterval(async () => {
    const stats = await sendCommand('GetStats')
    const streaming = await sendCommand('GetStreamStatus')
    const recording = await sendCommand('GetRecordStatus')
    heartbeat = { stats, streaming, recording }
    //console.log(heartbeat);
  }, 1000) // Heartbeat
  isStudioMode =
    (await sendCommand('GetStudioModeEnabled')).studioModeEnabled || false
  isVirtualCamActive =
    (await sendCommand('GetVirtualCamStatus')).outputActive || false
})

obs.on('ConnectionError', async () => {
  errorMessage = 'Please enter your password:'
  document.getElementById('password').focus()
  if (!password) {
    connected = false
  } else {
    await connect()
  }
})





/**
 * 
 * @param {string} sceneName Nombre de la escena 
 * @param {string} sourceName Nombre del source en la escena 
 * @param {boolean} enable true para activar y false para desactiva
 */
 async function switchSceneItem(sceneName, sourceName, enable) {
  let sceneItemIdObj = await sendCommand('GetSceneItemId', {
     sceneName,
     sourceName,
   })
   console.log(sceneItemIdObj);
   
   let sceneItemId = await sceneItemIdObj.sceneItemId;

   console.log(`El id de la escena es=`+sceneItemId)
 
   await sendCommand(`SetSceneItemEnabled`, {
     sceneName,
     sceneItemId,
     sceneItemEnabled: enable
   })
 }






password = `000000`;

address = `ws://localhost:4455`;


connect();



switchSceneItem(`DESPERTATE`,`ENVIVO-DESPERTATE`,false);
























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



export const updateAux = async (req, res) => {
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
