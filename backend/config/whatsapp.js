import makeWASocket, {
    DisconnectReason,
    useMultiFileAuthState,
} from "@whiskeysockets/baileys";

import { Boom } from "@hapi/boom";
import qrcode from "qrcode-terminal";
import QRCode from "qrcode";
import path from "path";
import fs from "fs/promises";


// ========================================
// WHATSAPP STATE
// ========================================

export let whatsapp = null;

export let whatsappReady = false;

export let connecting = false;


// QR code for frontend
export let whatsappQR = null;


// Connection status
export let whatsappStatus = "disconnected";


// Connected WhatsApp number
export let whatsappPhone = null;


// Last connection error
export let whatsappError = null;


// ========================================
// BAILEYS AUTH DIRECTORY
// ========================================

// Local development:
// ./baileys_auth_info
//
// Render:
// Set WHATSAPP_AUTH_DIR in environment variables
//
// Example:
// /data/baileys_auth_info

const AUTH_DIR =
    "data"
    path.join(
        process.cwd(),
        "baileys_auth_info"
    );


// ========================================
// CONNECT WHATSAPP
// ========================================

export const connectWhatsApp = async () => {

    // Prevent duplicate connections
    if (connecting) {

        console.log(
            "⚠️ WhatsApp connection already in progress"
        );

        return;
    }


    // Already connected
    if (
        whatsapp &&
        whatsappReady
    ) {

        console.log(
            "✅ WhatsApp already connected"
        );

        return;
    }


    connecting = true;

    whatsappStatus = "connecting";

    whatsappError = null;


    try {

        // ========================================
        // AUTH STATE
        // ========================================

        const {
            state,
            saveCreds,
        } = await useMultiFileAuthState(
            AUTH_DIR
        );


        // ========================================
        // CREATE SOCKET
        // ========================================

        whatsapp = makeWASocket({

            auth: state,

            browser: [
                "Invoice Management",
                "Chrome",
                "1.0.0",
            ],

            markOnlineOnConnect: false,

        });


        // ========================================
        // SAVE CREDENTIALS
        // ========================================

        whatsapp.ev.on(
            "creds.update",
            saveCreds
        );


        // ========================================
        // CONNECTION UPDATE
        // ========================================

        whatsapp.ev.on(
            "connection.update",
            async (update) => {

                const {
                    connection,
                    lastDisconnect,
                    qr,
                } = update;


                // ====================================
                // QR CODE GENERATED
                // ====================================

                if (qr) {

                    console.log("");

                    console.log(
                        "📱 Scan WhatsApp QR Code"
                    );

                    console.log("");


                    // Terminal QR
                    qrcode.generate(
                        qr,
                        {
                            small: true,
                        }
                    );


                    // ====================================
                    // FRONTEND QR
                    // ====================================

                    try {

                        whatsappQR =
                            await QRCode.toDataURL(
                                qr
                            );

                        whatsappStatus = "qr";

                        whatsappReady = false;

                        whatsappError = null;

                        console.log(
                            "✅ WhatsApp QR available for frontend"
                        );

                    } catch (qrError) {

                        console.error(
                            "❌ QR generation error:",
                            qrError
                        );

                    }

                }


                // ====================================
                // CONNECTING
                // ====================================

                if (
                    connection === "connecting"
                ) {

                    whatsappStatus =
                        "connecting";

                    whatsappReady = false;

                    console.log(
                        "🔄 Connecting WhatsApp..."
                    );

                }


                // ====================================
                // CONNECTED
                // ====================================

                if (
                    connection === "open"
                ) {

                    whatsappReady = true;

                    connecting = false;

                    whatsappStatus =
                        "connected";

                    whatsappQR = null;

                    whatsappError = null;


                    // ====================================
                    // GET CONNECTED PHONE
                    // ====================================

                    if (whatsapp?.user?.id) {

                        whatsappPhone =
                            whatsapp.user.id
                                .split(":")[0]
                                .split("@")[0];

                    }


                    console.log("");

                    console.log(
                        "===================================="
                    );

                    console.log(
                        "✅ WHATSAPP CONNECTED"
                    );

                    console.log(
                        "📱 PHONE:",
                        whatsappPhone
                    );

                    console.log(
                        "===================================="
                    );

                    console.log("");

                }


                // ====================================
                // DISCONNECTED
                // ====================================

                if (
                    connection === "close"
                ) {

                    whatsappReady = false;

                    connecting = false;

                    whatsappPhone = null;


                    const statusCode =
                        new Boom(
                            lastDisconnect?.error
                        )?.output?.statusCode;


                    const shouldReconnect =
                        statusCode !==
                        DisconnectReason.loggedOut;


                    console.log(
                        "❌ WhatsApp disconnected"
                    );

                    console.log(
                        "Status:",
                        statusCode
                    );


                    // ====================================
                    // RECONNECT
                    // ====================================

                    if (shouldReconnect) {

                        whatsappStatus =
                            "disconnected";

                        whatsappQR = null;


                        console.log(
                            "🔄 Reconnecting WhatsApp..."
                        );


                        setTimeout(
                            () => {

                                connectWhatsApp();

                            },
                            3000
                        );

                    }

                    // ====================================
                    // LOGGED OUT
                    // ====================================

                    else {

                        whatsappStatus =
                            "logged_out";

                        whatsappQR = null;

                        whatsappPhone = null;

                        whatsapp = null;


                        console.log(
                            "🚪 WhatsApp logged out."
                        );

                    }

                }

            }
        );


    } catch (error) {

        connecting = false;

        whatsappReady = false;

        whatsappStatus = "error";

        whatsappError =
            error?.message ||
            "WhatsApp initialization failed";

        whatsapp = null;


        console.error(
            "❌ WhatsApp initialization error:",
            error
        );

    }

};


// ========================================
// GET WHATSAPP SOCKET
// ========================================

export const getWhatsApp = () => {

    return whatsapp;

};


// ========================================
// CHECK WHATSAPP READY
// ========================================

export const isWhatsAppReady = () => {

    return (
        whatsappReady &&
        whatsapp !== null
    );

};


// ========================================
// GET WHATSAPP STATUS
// ========================================

export const getWhatsAppStatus = () => {

    return {

        status:
            whatsappStatus,

        ready:
            whatsappReady,

        connecting:
            connecting,

        phone:
            whatsappPhone,

        hasQR:
            !!whatsappQR,

        error:
            whatsappError,

    };

};


// ========================================
// GET WHATSAPP QR
// ========================================

export const getWhatsAppQR = () => {

    return whatsappQR;

};


// ========================================
// LOGOUT WHATSAPP
// ========================================

export const logoutWhatsApp = async () => {

    try {

        console.log(
            "🚪 Logging out WhatsApp..."
        );


        // ====================================
        // LOGOUT FROM WHATSAPP
        // ====================================

        if (whatsapp) {

            try {

                await whatsapp.logout();

            } catch (error) {

                console.log(
                    "WhatsApp socket logout error:",
                    error?.message
                );

            }

        }


        // ====================================
        // RESET STATE
        // ====================================

        whatsapp = null;

        whatsappReady = false;

        connecting = false;

        whatsappQR = null;

        whatsappPhone = null;

        whatsappStatus = "logged_out";

        whatsappError = null;


        // ====================================
        // DELETE AUTH SESSION
        // ====================================

        try {

            await fs.rm(
                AUTH_DIR,
                {
                    recursive: true,
                    force: true,
                }
            );

            console.log(
                "🗑️ WhatsApp auth session deleted"
            );

        } catch (error) {

            console.log(
                "⚠️ Auth directory delete error:",
                error?.message
            );

        }


            connectWhatsApp()
        return {

            success: true,

            message:
                "WhatsApp logged out successfully",

        };

          getWhatsAppQR()


    } catch (error) {

        console.error(
            "❌ WhatsApp logout error:",
            error
        );


        return {

            success: false,

            message:
                error?.message ||
                "WhatsApp logout failed",

        };

    }

};


// ========================================
// RECONNECT WHATSAPP
// ========================================

export const reconnectWhatsApp = async () => {

    try {

        // ====================================
        // CLOSE OLD SOCKET
        // ====================================

        if (whatsapp) {

            try {

                whatsapp.end(
                    new Error(
                        "Manual reconnect"
                    )
                );

            } catch (error) {

                console.log(
                    "Socket close error:",
                    error?.message
                );

            }

        }


        // ====================================
        // RESET
        // ====================================

        whatsapp = null;

        whatsappReady = false;

        connecting = false;

        whatsappQR = null;

        whatsappPhone = null;

        whatsappStatus =
            "connecting";

        whatsappError = null;


        // ====================================
        // START AGAIN
        // ====================================

        await connectWhatsApp();


        return {

            success: true,

            message:
                "WhatsApp reconnect started",

        };


    } catch (error) {

        whatsappStatus = "error";

        whatsappError =
            error?.message;


        return {

            success: false,

            message:
                error?.message ||
                "WhatsApp reconnect failed",

        };

    }

};