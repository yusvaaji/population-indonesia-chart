const express = require("express");
const highcharts = require("highcharts");

const app = express();
const port = 3000;

// Replace with your actual API key
const API_KEY = `f77510a83b8d4e0396ade8ec5548415e`;
const API_URL = `https://webapi.bps.go.id/v1/api/list/model/data/lang/ind/domain/7100/var/958/key/${API_KEY}`;

app.use(express.static("public"));

app.get("/chart", async (req, res) => {
  try {
    const response = await fetch(API_URL);
    const jsonData = await response.json();

    const result = {};
    Object.keys(jsonData.datacontent).forEach((key) => {
      let provinsi;
      let tahun;

      if (key.length === 10) {
        provinsi = jsonData.vervar.find(
          (p) => p.val === parseInt(key.slice(0, 2))
        );
        tahun = jsonData.tahun.find((t) => t.val === parseInt(key.slice(6, 9)));
      } else if (key.length === 9) {
        provinsi = jsonData.vervar.find(
          (p) => p.val === parseInt(key.slice(0, 1))
        );
        tahun = jsonData.tahun.find((t) => t.val === parseInt(key.slice(5, 8)));
      }

      if (tahun && provinsi) {
        if (tahun != undefined && provinsi != undefined) {
          const nilai = jsonData.datacontent[key];
          //   console.log(nilai);
          result[provinsi.label] = nilai;
        }
      }
    });

    console.log(result);
    // Send data to the front end
    res.send(result);
  } catch (error) {
    res.status(500).send("Error fetching indonesia population data 2024");
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
