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

/**
 * Monta sequência de caracteres que estabelece atribuição
 * legal exigida pela Unsplash para exibição de fotos.
 *
 * @param {string} html Endereço do fotógrafo no Unsplash
 * @param {string} fotografo Nome do fotógrafo
 * @returns Atribuição legal da foto conforme Unsplash
 */
function atribuicao(html, fotografo) {
  return `Foto de <a href="${html}?utm_source=regulacao&utm_medium=referral">${fotografo}</a> no <a href="https://unsplash.com/?utm_source=regulacao&utm_medium=referral">Unsplash</a>`;
}

async function obtenhaFotoDoDia(registraEm, bucket, filename) {
  function downloadImage(imagemUrl) {
    fetch(imagemUrl, { mode: "no-cors" })
      .then((response) => response.buffer())
      .then((buffer) => {
        registraEm(bucket, filename, buffer, "image/jpeg");
      });
  }

  try {
    const unsplash = createApi({
      accessKey: process.env.UNSPLASH_ACCESS_KEY,
      fetch,
    });

    const params = { query: "natureza brasil", orderBy: "relevant" };

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

    // Foto sorteada para o dia
    const sorteada = fotos[indexFotoSorteada];

    // Monta créditos (exigência Unsplash)
    const html = sorteada.user.links.html;
    const nome = sorteada.user.name;
    const creditos = { creditos: atribuicao(html, nome) };
    uploadToBucket(
      bucket,
      "foto-do-dia.json",
      JSON.stringify(creditos),
      "application/json"
    );

    // Créditos (exigido pelo unsplash)
    unsplash.photos.trackDownload({
      downloadLocation: sorteada.links.download_location,
    });

    downloadImage(sorteada.urls.raw);
  } catch (error) {
    console.log(error.toString());
    console.log(sorteada);
    console.log("indice", indexFotoSorteada);
  }
}

obtenhaFotoDoDia(uploadToBucket, process.env.BUCKET_NAME, "foto-do-dia.jpg");
