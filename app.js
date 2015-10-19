var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var SQL = require('sql.js');
var barcode = require('barcode');
var path = require('path');

if(!process.argv[2]) {
  console.log("Usage: node app.js [database]");
  return;
}

var database_file = process.argv[2];

var filebuffer = fs.readFileSync(database_file);
var db = new SQL.Database(filebuffer);

console.log('Read database');

var app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, PUT");
  next();
});

app.use(bodyParser.json());

app.use(express.static(__dirname + '/public',{ dotfiles : 'allow' }));

app.get('/api', function (req, res) {
  res.send('HIS API is running');
});

app.get('/api/locais', function (req, res) {
  var result = db.exec("SELECT * FROM LOC");
  var locais = [];
  if(result[0]) {
    result[0].values.forEach(function(item) {
      locais.push({'ID': item[0], 'Nome': item[1]});
    });
  }
  res.json(locais);
});

app.get('/api/tipos', function (req, res) {
  var result = db.exec("SELECT * FROM TIP");
  var tipos = [];
  if(result[0]) {
    result[0].values.forEach(function(item) {
      tipos.push({'ID': item[0], 'Nome': item[1]});
    });
  }
  res.json(tipos);
});

app.get('/api/tipos/:id', function (req, res) {
  var id = req.params.id;
  var result = db.exec("SELECT ID, DSC FROM STP WHERE TIP = " + id);
  var subtipos = [];
  if(result[0]) {
    result[0].values.forEach(function(item) {
      subtipos.push({'ID': item[0], 'Nome': item[1]});
    });
  }
  res.json(subtipos);
});

app.get('/api/marcas', function (req, res) {
  var result = db.exec("SELECT * FROM MAR");
  var marcas = [];
  if(result[0]) {
    result[0].values.forEach(function(item) {
      marcas.push({'ID': item[0], 'Nome': item[1]});
    });
  }
  res.json(marcas);
});

var generateBarcode = function(barcode_str, id) {
  var code = barcode('code128', {
    data: barcode_str,
    width: 300,
    height: 150
  });

  filename="barcodes/"+id+".png";

  var outfile = path.join(__dirname, "public", filename);
  code.saveImage(outfile, function (err) {
    if (err) throw err;
  });

  return id;
};

app.post('/api/objecto', function (req, res) {
  var query = 'INSERT INTO ART(LOC, TIP, STP, MAR, DSC) VALUES(' + req.body.LOC + ', ';
  query += req.body.TIP + ', ';
  query += req.body.STP + ', ';
  query += req.body.MAR + ', ';
  query += "'" + JSON.stringify(req.body.INF) + "');";
  query += "SELECT ID FROM ART ORDER BY ID DESC LIMIT 1;"
  var result = db.exec(query);
  var id = result[0].values[0];
  fs.writeFileSync(database_file, new Buffer(db.export()));
  
  var barcode_str = req.body.LOC + " " + req.body.TIP + " " + req.body.STP + " " + req.body.MAR + " " + id;
  res.json(generateBarcode(barcode_str, id));
});

app.put('/api/objecto/:id', function (req, res) {
  var id = req.params.id;
  var query = "UPDATE ART SET LOC='" + req.body.LOC + "'";
  query += ", TIP='" + req.body.TIP + "'";
  query += ", STP='" + req.body.STP + "'";
  query += ", MAR='" + req.body.MAR + "'";
  query += ", DSC='" + JSON.stringify(req.body.INF) + "'";
  query += " WHERE ID='" + id + "'";
  db.run(query);
  fs.writeFileSync(database_file, new Buffer(db.export()));

  var barcode_str = req.body.LOC + " " + req.body.TIP + " " + req.body.STP + " " + req.body.MAR + " " + id;
  res.json(generateBarcode(barcode_str, id));
});

app.get('/api/objecto/:id', function (req, res) {
  var id = req.params.id;
  var result = db.exec("SELECT * FROM ART WHERE ID='"+id+"'")[0].values[0];
  var object = {
    'ID'  : result[0],
    'LOC' : result[1],
    'TIP' : result[2],
    'STP' : result[3],
    'MAR' : result[4],
    'INF' : result[5]
  };
  res.json(object);
});

app.post('/api/local', function (req, res) {
  var query = "INSERT INTO LOC(DSC) VALUES('"+req.body.LOC+"');"
  query += "SELECT ID FROM LOC ORDER BY ID DESC LIMIT 1;"
  var result = db.exec(query)[0].values[0][0];
  fs.writeFileSync(database_file, new Buffer(db.export()));
  res.json(result);  
});

app.post('/api/tipo', function (req, res) {
  var query = "INSERT INTO TIP(DSC) VALUES('"+req.body.TIP+"');"
  query += "SELECT ID FROM TIP ORDER BY ID DESC LIMIT 1;"
  var result = db.exec(query)[0].values[0][0];
  fs.writeFileSync(database_file, new Buffer(db.export()));
  res.json(result);
});

app.post('/api/marca', function (req, res) {
  var query = "INSERT INTO MAR(DSC) VALUES('"+req.body.MAR+"');"
  query += "SELECT ID FROM MAR ORDER BY ID DESC LIMIT 1;"
  var result = db.exec(query)[0].values[0][0];
  fs.writeFileSync(database_file, new Buffer(db.export()));
  res.json(result);
});

app.post('/api/tipo/:id', function (req, res) {
  var id = req.params.id;
  var query = "INSERT INTO STP(TIP, DSC) VALUES('"+id+"', '"+req.body.STP+"');"
  query += "SELECT ID FROM STP ORDER BY ID DESC LIMIT 1;"
  var result = db.exec(query)[0].values[0][0];
  fs.writeFileSync(database_file, new Buffer(db.export()));
  res.json(result);
});

app.get('/api/objectos', function (req, res) {
  var objectos = [];

  var result = db.exec("SELECT * FROM ART");

  if(result[0]) {
    result[0].values.forEach(function (item) {
      objectos.push({
        'ID'  : item[0],
        'LOC' : item[1],
        'TIP' : item[2],
        'STP' : item[3],
        'MAR' : item[4],
        'INF' : JSON.parse(item[5])
      });
    });
  }

  res.json(objectos);
});

app.get('/api/subtipos', function (req, res) {
  var result = db.exec("SELECT ID, DSC FROM STP");
  var subtipos = [];
  if(result[0]) {
    result[0].values.forEach(function(item) {
      subtipos.push({'ID': item[0], 'Nome': item[1]});
    });
  }
  res.json(subtipos);
});

var server = app.listen(80);
