import { Router, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { authenticate } from "../../middleware/authenticate";
import * as paymentService from "./payment.service";
import { getMe } from "../auth/auth.service";

const router = Router();

router.post(
  "/initialize",
  authenticate,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await getMe(req.user!.sub);
      const txRef = `aclp-${uuidv4()}`;

      // Use req.get('host') to easily build the backend callback url
      const protocol =
        process.env.NODE_ENV === "production" ? "https" : req.protocol;
      const backendUrl = `${protocol}://${req.get("host")}`;

      // We send both callback_url (webhook) and return_url (redirect) to the same verify endpoint,
      // which handles the redirect to frontend.
      const chapaCallbackUrl = `${backendUrl}/api/payment/chapa/verify?tx_ref=${txRef}`;

      const data = await paymentService.initializePayment(
        user.id,
        user.email,
        user.display_name.split(" ")[0] || "Student",
        user.display_name.split(" ").slice(1).join(" ") || "Name",
        txRef,
        chapaCallbackUrl,
        chapaCallbackUrl,
      );

      res.json(data);
    } catch (err: any) {
      res
        .status(500)
        .json({ error: err.message || "Internal error initializing payment" });
    }
  },
);

router.get(
  "/chapa/verify",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const txRef = req.query.tx_ref as string;
      if (!txRef) {
        res.status(400).send("Missing tx_ref parameter");
        return;
      }
      await paymentService.verifyPayment(txRef);

      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
      res.redirect(`${frontendUrl}/lessons`);
    } catch (err: any) {
      console.error("[chapa verify]", err.message);
      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
      res.redirect(`${frontendUrl}/lessons?payment=failed`);
    }
  },
);

export default router;
