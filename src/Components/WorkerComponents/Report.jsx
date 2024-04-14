import { useState } from "react";
import Timer from "./Timer";

import "./report.css";

function Report() {
  const [displayCircle, setDisplayCircle] = useState(true);
  return (
    <div id="report-container">
      {displayCircle && (
        <div id="start-circle" onClick={() => setDisplayCircle(!displayCircle)}>
          start your shift
        </div>
      )}
      {!displayCircle && (
        <div id="end-circle" onClick={() => setDisplayCircle(!displayCircle)}>
          end your shift
          <Timer></Timer>
        </div>
      )}
    </div>
  );
}

export default Report;
