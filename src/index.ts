import express, { Request, Response, NextFunction } from "express";
import axios from 'axios';
import cors from 'cors';
import md5 from 'md5';
import 'dotenv/config'

const privateKey = process.env.PRIVATE_KEY;
const publicKey = process.env.PUBLIC_KEY;
const apiUrl = 'http://gateway.marvel.com/v1/public'

const app = express()

const port = process.env.PORT

app.listen(port, () => {
  console.log(`started server on PORT:${port} `);
});

app.use(cors());
app.use(express.json());

app.get('/personagem', (req: Request, res: Response, next: NextFunction) => {
  const page:number = Number(req.query.page) - 1;
  const limit:number = Number(req.query.limit);
  const ts = new Date().getTime().toString();
  const hash = md5(ts + privateKey + publicKey);

  axios.get(`${apiUrl}/characters`, {
    params: {
      ts: ts,
      apikey: publicKey,
      hash: hash,
      orderBy: 'name',
      limit: limit,
      offset: page * limit
    }
  }).then((response => {
    const personagens: Array<any> = response.data.data.results;
    const nomes: Array<any> = personagens.map(personagem => {
      return  {
        nome: personagem.name,
        descricao: personagem.description,
        id: personagem.id,
        thumbnail: personagem.thumbnail
      } 
    });
    const objRetorno = {
      page: page + 1,
      count: nomes.length,
      totalPages: Math.floor((response.data.data.total/limit) + 1),
      personagens: [...nomes]
    };
    res.json(objRetorno);
  })).catch( err => {
    console.log(err);
    res.status(500).send("Internal error");
  })
})

app.get('/personagem/:id', (req: Request, res: Response, next: NextFunction) => {

  const page:number = Number(req.query.page) - 1;
  const limit:number = Number(req.query.limit);
  const idPer:number = Number(req.params.id)
  const ts = new Date().getTime().toString();
  const hash = md5(ts + privateKey + publicKey);

  axios.get(`${apiUrl}/characters`, {
    params: {
      ts: ts,
      apikey: publicKey,
      hash: hash,
      id: idPer
      /* orderBy: 'name',
      limit: limit,
      offset: page * limit */
    }
  }).then((response => {
    const personagens: Array<any> = response.data.data.results;
    const nomes: Array<any> = personagens.map(personagem => {
      return {
        nome: personagem.name,
        descricao: personagem.description,
        id: personagem.id,
        thumbnail: personagem.thumbnail,
        comics: personagem.comics.items
      }
    });
    const objRetorno = {
      page: page + 1,
      count: nomes.length,
      totalPages: Math.floor((response.data.data.total/limit) + 1),
      personagens: [...nomes]
    };
    res.json(objRetorno);
  })).catch( err => {
    console.log(err);
    res.status(500).send("Internal error");
  })

})



app.get('/quadrinhos/:character', (req: Request, res: Response, next: NextFunction) => {
  const page:number = Number(req.query.page) - 1;
  const limit:number = Number(req.query.limit);
  const idChar:number = Number(req.params.character);
  const ts = new Date().getTime().toString();
  const hash = md5(ts + privateKey + publicKey);

  axios.get(`${apiUrl}/comics`, {
    params: {
      ts: ts,
      apikey: publicKey,
      hash: hash,
      characters: idChar,
      limit: limit,
      offset: page * limit
    }
  }).then((response => {
    const quadrinhos: Array<any> = response.data.data.results;
    const nomes: Array<any> = quadrinhos.map(quadrinhos => {
      return   {
        nome: quadrinhos.title,
        descricao: quadrinhos.description,
        id: quadrinhos.id,
        thumbnail: quadrinhos.thumbnail
      } 
    });
    const objRetorno = {
      page: page + 1,
      count: nomes.length,
      totalPages: Math.floor((response.data.data.total/limit) + 1),
      quadrinhos: [...nomes]
    };
    res.json(objRetorno);
  })).catch( err => {
    console.log(err);
    res.status(500).send("Internal error");
  })
})