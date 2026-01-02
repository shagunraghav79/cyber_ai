
import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

function localSecurityScan(url) {
  const lower = url.toLowerCase();

  const riskyTLDs = [".xyz", ".top", ".gq", ".ml", ".cf", ".fun", ".work", ".casino"];
  const shorteners = ["bit.ly", "tinyurl", "goo.gl", "t.co", "ow.ly", "is.gd"];
  const scamWords = ["free-money", "win-prize", "verify-account", "login-verification", "earn-fast"];

  let score = 0;
  let flags = [];

  if (lower.startsWith("http://")) {
    score += 2;
    flags.push("Unencrypted HTTP");
  }
  if (shorteners.some(s => lower.includes(s))) {
    score += 3;
    flags.push("Shortened URL");
  }
  if (lower.includes("xn--")) {
    score += 3;
    flags.push("Punycode Domain");
  }
  if (/^https?:\/\/\d+\.\d+\.\d+\.\d+/.test(lower)) {
    score += 3;
    flags.push("IP-based URL");
  }
  if (riskyTLDs.some(t => lower.endsWith(t))) {
    score += 2;
    flags.push("Suspicious TLD");
  }
  if (scamWords.some(w => lower.includes(w))) {
    score += 4;
    flags.push("Scam Keyword Detected");
  }
  if (url.length > 150) {
    score += 2;
    flags.push("Unusually Long URL");
  }
  if (lower.includes("redirect=") || lower.includes("token=") || lower.includes("login=")) {
    score += 2;
    flags.push("Suspicious Parameters");
  }

  return { score, flags };
}


// URL SCAN ROUTE

router.post("/scan", async (req, res) => {
  const { url } = req.body;
  if (!url) return res.json({ error: "URL required" });

  try {
    
    const form = new URLSearchParams();
    form.append("url", url);

    const submit = await axios.post(
      "https://www.virustotal.com/api/v3/urls",
      form,
      {
        headers: {
          "x-apikey": process.env.VT_API_KEY,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const scanId = submit.data.data.id;

    console.log("Scan started. ID:", scanId);

   
    async function pollVirusTotal(maxAttempts = 10) {
      for (let i = 0; i < maxAttempts; i++) {
        const resp = await axios.get(
          `https://www.virustotal.com/api/v3/analyses/${scanId}`,
          {
            headers: { "x-apikey": process.env.VT_API_KEY },
          }
        );

        const analysis = resp.data.data.attributes;

        
        if (analysis.status === "completed") {
          return analysis.results;
        }

        console.log(`VT Scan not ready. Attempt ${i + 1}/10`);

        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      return null;
    }

   
    const results = await pollVirusTotal();

    if (!results) {
      return res.json({
        error: "VirusTotal scan still pending. Try again in a few seconds."
      });
    }

    
    let harmless = 0, malicious = 0, suspicious = 0, unrated = 0;

    for (let engine in results) {
      const cat = results[engine].category;
      if (cat === "harmless") harmless++;
      else if (cat === "malicious") malicious++;
      else if (cat === "suspicious") suspicious++;
      else unrated++;
    }

  
    const localCheck = localSecurityScan(url);

 
    let status = "safe";

    if (malicious > 0 || localCheck.score >= 6) status = "danger";
    else if (suspicious > 0 || localCheck.score >= 3) status = "suspicious";

  
    res.json({
      url,
      status,
      virustotal: {
        harmless,
        malicious,
        suspicious,
        unrated,
        total: harmless + malicious + suspicious + unrated,
      },
      localScan: localCheck,
      engines: results,
    });

  } catch (error) {
    console.error("SCAN ERROR:", error);
    res.status(500).json({ error: "URL scan failed" });
  }
});

export default router;
