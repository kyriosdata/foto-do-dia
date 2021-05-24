## Objetivo

Disponibilizar foto de fundo, possivelmente para tela de boas-vindas
ou login, no arquivo "foto-do-dia.jpg" em
bucket (S3).

Foto será obtida de forma arbitrária, dentre aquelas localizadas com o tema "felicidade" no serviço Unsplash (https://unsplash.com). Regras devem ser
observadas para o consumo em conformidade com as orientações deste serviço.
Os créditos são documentados em JSON no arquivo "foto-do-dia.json".

## Instalação

- `npm i foto-do-dia`

## Configuração

- Variável de ambiente `UNSPLASH_ACCESS_KEY` contendo chave para acesso
  ao Unsplash (https://unsplash.com/). Consulte documentação pertinente para acesso em conformidade com as exigências.
- Credenciais da AWS com autorização de escrita em bucket (S3) utilizado para armazenar foto obtida do serviços Unsplash. Em geral no arquivo credentials, criado no diretório .aws contido no diretório de trabalho do usuário.
- Variável de ambiente `BUCKET_NAME`. Bucket no qual o arquivo obtido
  será depositado.

## Execução

- `npm install`
- `node node_modules\foto-do-dia\index.js`.

## Estratégia

- **foto-fallback.jpg** e **foto-fallback.json** contém, respectivamente, a foto e os créditos correspondentes. Esta é a foto a ser empregada caso
  a atualização falhe ou não seja possível adquirir a foto do dita.

- **foto-do-dia.jpg** e **foto-do-dia.json** contém, respectivamente, a
  foto e os créditos correspondentes da foto do dia.

## Observação

Busca do Unsplash, em alguns cenários, retornam fotos cuja imagem não
reflete adequadamente os critérios de busca. Em consequência, pode ser
necessário, por segurança, executar a curadoria do conjunto de fotos
a ser considerado, guardar os identificadores destas fotos e só
realizar o sorteio da foto do dia entre aquelas previamente avaliadas.
