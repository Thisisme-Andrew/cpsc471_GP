import fs from "fs";

export const HOST_ADDRESS = "cpsc471-project.mysql.database.azure.com";
export const USER = "andytang";
export const PASSWORD = "Password123"
export const DATABASE_NAME = "main";
export const PORT = 3306;
export const SSL = {ca: fs.readFileSync("../DigiCertGlobalRootCA.crt.pem")};


