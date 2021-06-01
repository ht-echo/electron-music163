import Datastore from 'nedb';
import path from 'path';
const { app } = require('electron').remote;
export default new Datastore({
  filename: path.join(app.getPath('userData'), '/data.db'),
  autoload: true,
});
