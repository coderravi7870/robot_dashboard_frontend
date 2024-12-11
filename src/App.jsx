import React, { useState, useEffect } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const App = () => {
  const [robots, setRobots] = useState([]);

  useEffect(() => {
    // Fetch initial robot data
    axios.get("http://127.0.0.1:8000/robots").then((response) => {
      setRobots(response.data);
    });

    // WebSocket for real-time updates
    const ws = new WebSocket("ws://127.0.0.1:8000/ws/updates");
    ws.onmessage = (event) => {
      setRobots(JSON.parse(event.data));
    };

    return () => ws.close();
  }, []);

  return (
    <div style={{ fontFamily: "'Roboto', sans-serif" }}>
      {/* Navigation Bar */}
      <header
        style={{
          backgroundColor: "#4CAF50",
          color: "white",
          padding: "10px 20px",
          textAlign: "center",
        }}
      >
        <h1>Robot Fleet Monitoring</h1>
      </header>

      {/* Main Content */}
      <div style={{ display: "flex", flexWrap: "wrap", padding: "20px" }}>
        {/* Robot List */}
        <div style={{ flex: 1, marginRight: "20px" }}>
          <h2>Robot Details</h2>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "15px",
            }}
          >
            {robots.map((robot) => (
              <div
                key={robot["Robot ID"]}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "15px",
                  backgroundColor:
                    !robot["Online/Offline"] || robot["Battery Percentage"] < 20
                      ? "#fdecea"
                      : "#e8f5e9",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                }}
              >
                <h3 style={{ margin: "0 0 10px" }}>
                  Robot ID: {robot["Robot ID"]}
                </h3>
                <p>
                  Status: {robot["Online/Offline"] ? "🟢 Online" : "🔴 Offline"}
                </p>
                <p>Battery: {robot["Battery Percentage"]}%</p>
                <p>CPU: {robot["CPU Usage"]}%</p>
                <p>RAM: {robot["RAM Consumption"]} MB</p>
                <p>Last Updated: {robot["Last Updated"]}</p>
                <p>
                  Location: [{robot["Location Coordinates"][0]},{" "}
                  {robot["Location Coordinates"][1]}]
                </p>

                {/* Individual Map */}
                <div style={{ height: "300px", marginTop: "10px" }}>
                  <MapContainer
                    center={robot["Location Coordinates"]}
                    zoom={10}
                    style={{ height: "100%", width: "100%" }}
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker position={robot["Location Coordinates"]}>
                      <Popup>
                        <h3>{robot["Robot ID"]}</h3>
                        <p>Battery: {robot["Battery Percentage"]}%</p>
                        <p>
                          Status:{" "}
                          {robot["Online/Offline"] ? "Online" : "Offline"}
                        </p>
                      </Popup>
                    </Marker>
                  </MapContainer>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
