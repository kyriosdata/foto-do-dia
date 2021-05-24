import AWS from "aws-sdk";

AWS.config.update({ region: "sa-east-1" });

const s3 = new AWS.S3({ apiVersion: "2012-10-17" });

const uploadToBucket = (bucket, fileName, data, contenttype) => {
  const params = {
    Bucket: bucket,
    Key: fileName,
    Body: data,
    ContentType: contenttype,
  };

  s3.upload(params, function (s3Err, conteudo) {
    if (s3Err) throw s3Err;
    console.log(`Arquivo criado satisfatoriamente em ${conteudo.Location}`);
  });
};

export default uploadToBucket;
