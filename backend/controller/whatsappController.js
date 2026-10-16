import {
    getWhatsAppStatus,
    getWhatsAppQR,
    logoutWhatsApp,
    reconnectWhatsApp,
} from "../config/whatsapp.js";


// ========================================
// GET STATUS
// ========================================

export const getWhatsAppStatusController =
    async (req, res) => {

        try {

            
            const status =
                getWhatsAppStatus();


                console.log(status)

            return res.json({

                success: true,

                data: status,

            });

        } catch (error) {

            console.error(error);

            res.json({success:false, error:e.message})

        }

    };


// ========================================
// GET QR
// ========================================

export const getWhatsAppQRController =
    async (req, res) => {

        try {

            const qr =
                getWhatsAppQR();

                console.log(qr)
            if (!qr) {

                return res.status(404).json({

                    success: false,

                    message:
                        "QR code is not available",

                });

            }


            return res.status(200).json({

                success: true,

                qr,

            });

        } catch (error) {

            console.error(error);

            return res.status(500).json({

                success: false,

                message:
                    error.message,

            });

        }

    };


// ========================================
// LOGOUT
// ========================================

export const logoutWhatsAppController =
    async (req, res) => {

        try {

            const result =
                await logoutWhatsApp();


            if (!result.success) {

                return res.status(500).json(
                    result
                );

            }


            return res.status(200).json(
                result
            );

        } catch (error) {

            console.error(error);

            return res.status(500).json({

                success: false,

                message:
                    "Failed to logout WhatsApp",

            });

        }

    };


// ========================================
// RECONNECT
// ========================================

export const reconnectWhatsAppController =
    async (req, res) => {

        try {

            const result =
                await reconnectWhatsApp();


            if (!result.success) {

                return res.status(500).json(
                    result
                );

            }


            return res.status(200).json(
                result
            );

        } catch (error) {

            console.error(error);

            return res.status(500).json({

                success: false,

                message:
                    "Failed to reconnect WhatsApp",

            });

        }

    };