import React from "react";
import { createRoot } from "react-dom/client";
import Application from "./Application.js";

import "./application.css";

createRoot(document.getElementById("root")!).render(<Application />);
