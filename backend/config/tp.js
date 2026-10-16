
import makeWASocket, {
  useMultiFileAuthState,
  Browsers,
} from "@whiskeysockets/baileys";

import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (text) =>
  new Promise((resolve) => rl.question(text, resolve));

// Exportable function
export const connectWhatsApp = async () => {

  const { state, saveCreds } =
    await useMultiFileAuthState("auth_info_baileys");

  const sock = makeWASocket({
    auth: state,
    browser: Browsers.macOS("Chrome"),
  });

  let requested = false;

 sock.ev.on("connection.update", async (update) => {
  const { connection, qr, lastDisconnect } = update;

  console.log("Connection:", connection);

  // Generate pairing code
  if (qr && !state.creds.registered && !requested) {
    requested = true;

    try {
      const number = await question(
        "Enter number with country code: "
      );

      const code = await sock.requestPairingCode(
        number.replace(/\D/g, "")
      );

      console.log("PAIRING CODE:", code);

    } catch (error) {
      console.log("Pairing Error:", error);
    }
  }

  if (connection === "open") {
    console.log("WhatsApp Connected!");
    console.log("Number:", sock.user?.id);
    rl.close();
  }

  if (connection === "close") {
    console.log("WhatsApp Disconnected");

    console.log(
      "Status Code:",
      lastDisconnect?.error?.output?.statusCode
    );

    console.log(
      "Reason:",
      lastDisconnect?.error?.message
    );

    console.log(
      "Full Error:",
      lastDisconnect?.error
    );

    rl.close();
  }
});

  // Save authentication
  sock.ev.on("creds.update", saveCreds);

  return sock;
};
