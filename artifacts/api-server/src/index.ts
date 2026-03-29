import app from "./app.js";
import { logger } from "./lib/logger.js";
import { startVeDirectReader } from "./victron/veDirect.js";
import { startMk3Reader } from "./victron/mk3.js";
import { startDs18b20Reader } from "./sensors/ds18b20.js";
import { startFanController } from "./fans/fanController.js";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

startVeDirectReader();
startMk3Reader();
startDs18b20Reader();
startFanController();

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");
});
