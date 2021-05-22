## Objetivo

Disponibilizar foto de fundo, possivelmente para tela de boas-vindas
ou login, possivelmente, no arquivo "foto-do-dia.jpg" em
bucket (S3).

Foto deve ter como tema a "felicidade" e, para evitar
repetição que pode ser cansativa, deve ser atualizada
diariamente.

## Configuração

- Credenciais da AWS empregadas para depositar arquivo em um bucket (S3).
  Em geral no arquivo credentials, criado no diretório .aws.
- Variável de ambiente `UNSPLASH_ACCESS_KEY` contendo chave para acesso
  ao Unsplash (https://unsplash.com/). Consulte documentação pertinente para acesso em conformidade com as exigências.
- Variável de ambiente `BUCKET_NAME`. Bucket no qual o arquivo obtido
  será depositado.

## Estratégia

- Identificar e disponibilizar foto de backup (foto-fallback.jpg). Esta foto será empregada quando o processo de atualização da foto a ser exibida não for realizado de forma satisfatória.

- Uma nova imagem é sorteada e baixada a cada dia no arquivo foto-do-dia.jpg.
