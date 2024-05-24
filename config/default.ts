export default {
  origin: [`http://localhost:${process.env.PORT}`, `http://localhost:${process.env.PORT_CLIENT}`],
  accessTokenExpiresIn: 43200, // 3 meses
  refreshTokenExpiresIn: 216000, // 5 meses
};
