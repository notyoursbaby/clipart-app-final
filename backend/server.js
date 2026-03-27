const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

const REPLICATE_API = "";

app.post("/generate", async (req, res) => {
  const { image, style } = req.body;

  const promptMap = {
    cartoon: "cartoon style portrait",
    anime: "anime style portrait",
    sketch: "pencil sketch portrait",
    pixel: "pixel art portrait",
    flat: "flat illustration portrait",
  };

  try {
    const response = await axios.post(
      "https://api.replicate.com/v1/predictions",
      {
        version: "stability-ai/sdxl", // simple working model
        input: {
          prompt: promptMap[style],
          image: image,
        },
      },
      {
        headers: {
          Authorization: `Token ${REPLICATE_API}`,
        },
      }
    );

    res.json({
      image: "https://picsum.photos/300", // TEMP fallback
    });
  } catch (err) {
    res.status(500).json({ error: "failed" });
  }
});

app.listen(5000, "0.0.0.0", () => {
  console.log("Server running on 5000");
});