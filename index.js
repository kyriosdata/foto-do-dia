/**
 * Código que obtém imagem pública de unsplash e à deposita
 * em bucket (S3).
 *
 * Faz uso da variável de ambiente UNSPLASH_ACCESS_KEY, contendo
 * a chave de acesso do unsplash.
 *
 * Adicionalmente, a variável BUCKET_NAME define o nome do bucket
 * no qual o arquivo será depositado.
 */

import { createApi } from "unsplash-js";
import fetch from "node-fetch";
import fs from "fs";
import uploadToBucket from "./s3.js";

const sortear = (limite) => Math.floor(Math.random() * limite) + 1;
const disco = (bucket, nome, buffer) => fs.writeFileSync(nome, buffer);

async function obtenhaFotoDoDia(registraEm, bucket, filename) {
  function downloadImage(imagemUrl) {
    fetch(imagemUrl, { mode: "no-cors" })
      .then((response) => response.buffer())
      .then((buffer) => {
        registraEm(bucket, filename, buffer);
      });
  }

  try {
    const unsplash = createApi({
      accessKey: process.env.UNSPLASH_ACCESS_KEY,
      fetch,
    });

    const params = { query: "happiness", orderBy: "relevant" };

    const todas = await unsplash.search.getPhotos(params);

    if (todas.type !== "success") {
      throw new Error("erro ao obter foto...");
    }

    // Possivelmente elimina "menos relevantes"
    const totalPaginas = todas.response.total_pages;
    const paginasRelevantes = totalPaginas > 200 ? 200 : totalPaginas;
    const page = sortear(paginasRelevantes);

    const relevante = await unsplash.search.getPhotos({ ...params, page });

    const fotos = relevante.response.results;
    const indexFotoSorteada = sortear(fotos.length);

    const sorteada = fotos[indexFotoSorteada];
    downloadImage(sorteada.urls.raw);
  } catch (error) {}
}

obtenhaFotoDoDia(uploadToBucket, process.env.BUCKET_NAME, "foto-do-dia.jpg");
