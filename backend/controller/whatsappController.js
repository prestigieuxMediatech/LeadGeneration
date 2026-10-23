import { error } from "qrcode-terminal";
import {
    getWhatsAppStatus,
    getWhatsAppQR,
    logoutWhatsApp,
    reconnectWhatsApp,
    getWhatsApp,
    whatsappReady,
    isWhatsAppReady,
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




export const addMember = async (req, res) => {
    try {
        const { phone } = req.body;

        if (!isWhatsAppReady()) {
            return res.status(503).json({
                success: false,
                message: "WhatsApp is not connected",
            });
        }

        if (!Array.isArray(phone) || phone.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Phone must be a non-empty array",
            });
        }

        const sock = getWhatsApp();
        const groupId = "120363429442282527@g.us";

        // ========================================
        // GET EXISTING GROUP MEMBERS
        // ========================================

        const metadata = await sock.groupMetadata(groupId);

        const existingMembers = new Set(
            metadata.participants.flatMap(member =>
                [member.id, member.phoneNumber]
                    .filter(Boolean)
            )
        );

        // ========================================
        // FILTER NUMBERS
        // ========================================

        const participants = [];
        const skipped = [];
        const seen = new Set();

        for (const number of phone) {
            let clean = String(number ?? "").replace(/\D/g, "");

            // Add Indian country code
            if (clean.length === 10) {
                clean = `91${clean}`;
            }

            // Skip invalid numbers
            if (!/^91[6-9]\d{9}$/.test(clean)) {
                skipped.push({
                    number,
                    reason: "Invalid mobile number"
                });
                continue;
            }

            const jid = `${clean}@s.whatsapp.net`;

            // Skip duplicates
            if (seen.has(jid)) {
                skipped.push({
                    number,
                    reason: "Duplicate number"
                });
                continue;
            }

            seen.add(jid);

            // Skip existing group members
            if (existingMembers.has(jid)) {
                skipped.push({
                    number,
                    reason: "Already in group"
                });
                continue;
            }

            participants.push(jid);
        }

        // ========================================
        // NO NEW MEMBERS
        // ========================================

        if (participants.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No new members to add",
                skipped,
                added: [],
                failed: []
            });
        }

        // ========================================
        // ADD NEW MEMBERS
        // ========================================

        const result = await sock.groupParticipantsUpdate(
            groupId,
            participants,
            "add"
        );

        const added = result.filter(
            item => String(item.status) === "200"
        );

        const failed = result.filter(
            item => String(item.status) !== "200"
        );

        return res.status(200).json({
            success: added.length > 0,
            message: `${added.length} added, ${failed.length} failed, ${skipped.length} skipped`,
            added,
            failed,
            skipped
        });

    } catch (error) {
        console.error("Add member error:", error.message);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
