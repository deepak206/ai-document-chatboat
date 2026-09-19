import { Router } from "express";

import { runAgent } from "../agent/agent";

const router = Router();

/**
 * POST /api/agent
 *
 * Runs the GenChat Agent.
 */
router.post("/agent", async (req, res) => {
  try {
    const { message } = req.body;

    // ---------------------------------------
    // Validate message
    // ---------------------------------------

    if (
      !message ||
      typeof message !== "string" ||
      !message.trim()
    ) {
      return res.status(400).json({
        error: "Message is required",
      });
    }

    console.log("\n==============================");
    console.log("AGENT REQUEST");
    console.log("Question:", message);
    console.log("==============================");

    // ---------------------------------------
    // Run agent
    // ---------------------------------------

    const result = await runAgent(
      message.trim()
    );

    // ---------------------------------------
    // Return agent result
    // ---------------------------------------

    res.json({
      answer: result.answer,
      steps: result.steps,
    });
  } catch (error: any) {
    console.error(
      "AGENT API ERROR:",
      error
    );

    res.status(500).json({
      error:
        error?.message ||
        "Something went wrong while running the agent",
    });
  }
});

export default router;