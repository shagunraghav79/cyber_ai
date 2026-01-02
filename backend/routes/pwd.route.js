import express from "express";
import zxcvbn from "zxcvbn";

const router = express.Router();

router.post("/strength", (req, res) => {
    const { password } = req.body;

    if (!password) {
        return res.status(400).json({ error: "Password required" });
    }

    const result = zxcvbn(password);

    res.json({
        score: result.score,
        crack_time: result.crack_times_display.offline_slow_hashing_1e4_per_second,
        suggestions: result.feedback.suggestions,
        warning: result.feedback.warning
    });
});

export default router;

