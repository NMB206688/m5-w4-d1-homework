// src/App.js

// Imports (all at the very top to satisfy eslint import/first)
import { useState, useEffect } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import countries from "i18n-iso-countries";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTemperatureLow,
  faTemperatureHigh,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";

// Now it's safe to run code after all imports:
countries.registerLocale(require("i18n-iso-countries/langs/en.json"));

// Helper (keep the slide’s name/spelling)
const kelvinToFarenheit = (k) => ((k - 273.15) * 1.8 + 32).toFixed(0);

function App() {
  // --- State (as in slides) ---
  const [apiData, setApiData] = useState({});
  const [getState, setGetState] = useState("Irvine, USA");
  const [state, setState] = useState("Irvine, USA");

  // --- API KEY and URL (as in slides) ---
  const apiKey = process.env.REACT_APP_API_KEY; // from .env
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${state}&appid=${apiKey}`;

  // --- Side effect (fetch pattern from slides) ---
  useEffect(() => {
    if (!state || !apiKey) return;
    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => setApiData(data));
  }, [apiUrl]);

  // --- Handlers (from slides) ---
  const inputHandler = (event) => setGetState(event.target.value);
  const submitHandler = () => setState(getState);

  // Convenience lookups
  const icon = apiData?.weather?.[0]?.icon;
  const iconUrl = icon ? `http://openweathermap.org/img/w/${icon}.png` : "";
  const description = apiData?.weather?.[0]?.description || "";
  const countryCode = apiData?.sys?.country || "";
  const countryName =
    countryCode &&
    (countries.getName(countryCode, "en", { select: "official" }) ||
      countries.getName(countryCode, "en") ||
      countryCode);

  return (
    <div className="App">
      <header className="d-flex justify-content-center align-items-center">
        <h2>React Weather App</h2>
      </header>

      <div className="container">
        {/* Form wrapper */}
        <div className="mt-3 d-flex flex-column justify-content-center align-items-center">
          <div className="col-auto">
            <label htmlFor="location-name" className="col-form-label">
              Enter Location :
            </label>
          </div>

          <div className="col-auto" style={{ minWidth: 260, width: "100%", maxWidth: 720 }}>
            <input
              type="text"
              id="location-name"
              className="form-control"
              onChange={inputHandler}
              value={getState}
              placeholder="e.g., Irvine, USA"
            />
          </div>

          <div className="col-auto">
            <button className="btn btn-primary mt-2" onClick={submitHandler}>
              Search
            </button>
          </div>
        </div>

        {/* Weather card wrapper */}
        <div className="card mt-3 mx-auto">
          {apiData.main ? (
            <div className="card-body text-center">
              {iconUrl && (
                <img
                  src={iconUrl}
                  alt="weather status icon"
                  className="weather-icon"
                />
              )}

              <p className="h2">{kelvinToFarenheit(apiData.main.temp)}&deg; F</p>

              <p className="h5">
                <FontAwesomeIcon
                  icon={faMapMarkerAlt}
                  className="fas fa-1x mr-2 text-dark"
                />{" "}
                <strong>{apiData.name}</strong>
              </p>

              <div className="row mt-4">
                <div className="col-md-6">
                  <p>
                    <FontAwesomeIcon
                      icon={faTemperatureLow}
                      className="fas fa-1x mr-2 text-primary"
                    />{" "}
                    <strong>{kelvinToFarenheit(apiData.main.temp_min)}&deg; F</strong>
                  </p>
                  <p>
                    <FontAwesomeIcon
                      icon={faTemperatureHigh}
                      className="fas fa-1x mr-2 text-danger"
                    />{" "}
                    <strong>{kelvinToFarenheit(apiData.main.temp_max)}&deg; F</strong>
                  </p>
                </div>

                <div className="col-md-6">
                  <p>
                    {" "}
                    <strong>{apiData.weather?.[0]?.main}</strong>
                  </p>
                  <p>
                    <strong>
                      {" "}
                      {countries.getName(apiData.sys?.country, "en", {
                        select: "official",
                      })}
                    </strong>
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <h1 className="text-center my-4">Loading....</h1>
          )}
        </div>
      </div>

      <footer className="footer">&copy; React Weather App</footer>
    </div>
  );
}

export default App;
