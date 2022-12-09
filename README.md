# OBS Text Express

- `English` OBS Text Express is a Web Application; to create, modify and list texts.
This app creates two text outputs to be imported as input from the OBS Studio text layer.
This solution is based on the need to dynamically modify lowerthirds texts.
The list of data does not use a database, it is saved in JSON format.

- `Spanish` OBS Text Express es una Aplicacion Web; para crear, modificar y listar textos. 
Esta app crea dos salidas de texto para ser importados como entrada desde la capa de texto del OBS Studio. 
Esta solucion se basa en la necesidad de modificar textos de los lowerthirds dinamicamente.
La lista de datos no utililiza una base de datos, estas se guardan en formato JSON.




# ScreenShoot

![Zocalo Express](docs/screenshot.png)

# Installation

```shell
git clone https://github.com/walter8729/obs-text-express.git
npm install
npm run build
npm start
```

# Environment Variables

- `PORT`, this is the http port of the server. by default is `5000`.
- `APPID` - (optional), this is an unique ID for the application to identify in a load balancer

Also you can create a .env file with the environment variables mentioned above.

# Docker

```shell
docker build -t obs-text-express .
```

```shell
docker run -v /path/of/data/:/usr/src/app -p 80:5000 obs-text-express .
```

then visit: `http://localhost:5000`

# Considerations

- Make sure nodemon ignores the file `src/zocalos.json`.

## Reference

- https://babeljs.io/docs/en/babel-plugin-transform-runtime

- Based in code of: https://github.com/fazt/books-express 

### Todo

- [ ] Add user authentication
- [ ] Allow to download the json data
- [ ] Publish a docker container image on dockerhub
- [x] Change to dark theme
