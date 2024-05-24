import * as AWS from "aws-sdk";
import config from "config";
import fs from "fs";
import path from "path";
import AppError from "../utils/appError";
import {
  deleteFilesFromDirectoryService,
  uniqueFilenameService,
} from "./global.service";

// Custom

export const uploadToS3Service = async (
  pastaAws: string,
  stringBase64: any
): Promise<{ status: string; message: string; url: string }> => {
  try {
    const S3_ACCESS_KEY_ID = config.get<string>("awsS3AccessKeyId");
    const S3_SECRET_ACCESS_KEY = config.get<string>("awsS3SecretAccessKey");
    const BUCKET_NAME = config.get<string>("awsS3BucketName");
    const REGION = config.get<string>("awsS3Region");

    // AWS confs
    AWS.config.update({ region: REGION });
    const s3bucket = new AWS.S3({
      accessKeyId: S3_ACCESS_KEY_ID,
      secretAccessKey: S3_SECRET_ACCESS_KEY,
    });

    // deixa somente a string base64
    const base64Image = stringBase64.split(";base64,").pop();
    // extensão da imagem
    const extImage = stringBase64.split(";")[0].split("/")[1];
    // nome do arquivo
    const nameFile = (await uniqueFilenameService()) + "." + extImage;
    // pasta do arquivo
    const folderFile = `${path.resolve().toString()}\\src\\upload`;
    // cria pasta \upload se a mesma não existir
    if (!fs.existsSync(folderFile)) {
      try {
        await fs.promises.mkdir(folderFile, { recursive: true });
      } catch (err: any) {
        throw new AppError(
          500,
          `Erro ao criar pasta de upload: ${err.message}`
        );
      }
    }
    // path do arquivo
    const pathFile = `${folderFile}\\${nameFile}`;

    fs.writeFile(pathFile, base64Image, "base64", function (err) {});

    const readStream = fs.createReadStream(pathFile);

    // parâmetros de envio
    const params = {
      Bucket: BUCKET_NAME,
      Key: "main/" + pastaAws + "/" + nameFile,
      Body: readStream,
      ContentType: "image/" + extImage,
    };

    try {
      /**
       * Envio para AWS
       */
      const uploadedImage = await s3bucket.upload(params).promise();
      // url AWS s3
      let urlLocation = uploadedImage.Location;
      // deleta a arquivo salvo temporariamente
      // fs.unlinkSync(pathFile);
      await deleteFilesFromDirectoryService(folderFile);
      const s3Data = {
        status: "success",
        message: "Imagem salva com sucesso!",
        url: urlLocation,
      };

      return s3Data;
    } catch (err: any) {
      const s3Data = {
        status: "fail",
        message: `Não foi possível salvar a imagem! Erro: ${err.message}`,
        url: "",
      };

      return s3Data;
    }
  } catch (err: any) {
    throw new AppError(500, `Erro ao salvar imagem na AWS: ${err.message}`);
  }
};
