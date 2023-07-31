const express = require("express");
const https = require("https");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/weather", function(req, res) {
  const cityName = req.body.cityName;
  const apiKey = "44f4476cb7ee9f9bc3f89a71a8ff9713";
  const unit = "metric";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=${unit}`;

  https.get(url, function(response) {
    console.log("The status code is " + response.statusCode);

    let weatherData = "";

    response.on("data", function(data) {
      weatherData += data;
    });

    response.on("end", function() {
      const weatherInfo = JSON.parse(weatherData);
      console.log("The temperature is " + weatherInfo.main.temp);

      if (weatherInfo.cod !== 200) {
        res.send("<h1>Error: " + weatherInfo.message + "</h1>");
        return;
      }

      const temp = weatherInfo.main.temp;
      const seaLevel = weatherInfo.main.sea_level;
      const maxTemp = weatherInfo.main.temp_max;
      const icon = weatherInfo.weather[0].icon;
      const imageUrl = `http://openweathermap.org/img/wn/${icon}.png`;

      res.send(`
        <html>
        <head>
          <title>Weather Report</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f2f2f2;
              margin: 0;
              padding: 20px;
              text-align: center;
            }
            h1 {
              color: #333;
              font-size: 32px;
              margin-bottom: 20px;
            }
            .weather-container {
              width: 500px;
              margin: 0 auto;
              padding: 20px;
              border: 1px solid #ccc;
              background-color: #ffffff;
              box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
              border-radius: 5px;
            }
            p {
              font-size: 18px;
              margin-bottom: 10px;
            }
            img {
              margin-top: 20px;
              width: 100px;
              border-radius: 50%;
              box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            }
          </style>
        </head>
        <body>
          <div class="weather-container">
            <h1>Weather Report for ${cityName}</h1>
            <p><strong>Current Temperature:</strong> ${temp}°C</p>
            <p><strong>Max Temperature:</strong> ${maxTemp}°C</p>
            <p><strong>Sea Level:</strong> ${seaLevel} meters</p>
            <img src="${imageUrl}" alt="Weather Icon">
          </div>
        </body>
        </html>
      `);
    });
  }).on("error", function(error) {
    res.send("<h1>Error: " + error.message + "</h1>");
  });
});

app.listen(3000, function() {
  console.log("Server started running on port 3000");
});
