const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

const serviceAccount = require('./projeto-feira-a3212-default-rtdb-EspStatus-export.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://projeto-feira-a3212-default-rtdb.firebaseio.com/',
});

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/EspStatus', (req, res) => {
  const { QuantidadePast, Status, StatusMotor } = req.body.EspStatus;


  const now = new Date();
  const ultimaAtualizacao = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()} - ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;

  const data = {
    online: Status,
    motorAtivo: StatusMotor,
    pastilhasRestantes: QuantidadePast,
    ultimaAtualizacao,
  };

  admin.database().ref('dados-iot').set(data, (error) => {
    if (error) {
      res.status(500).json({ error: 'Erro ao atualizar dados no Firebase' });
    } else {
      res.status(200).json({ message: 'Dados atualizados com sucesso' });
    }
  });
});


app.use(express.static(path.join(__dirname, 'public')));


app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
