import app from "./app";

app.listen(app.get("port"));
console.log("Server on port", app.get("port"));


let url = 'http://localhost' + ':' + app.get('port');
let start = (process.platform == 'darwin'? 'open': process.platform == 'win32'? 'start': 'xdg-open');
require('child_process').exec(start + ' ' + url);

