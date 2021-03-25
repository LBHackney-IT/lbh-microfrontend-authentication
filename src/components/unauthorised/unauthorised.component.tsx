import React from "react";
import style from "./unathorised.module.scss";

export default function Unauthorised() {
  return (
    <div className={style.unauthorised}>
      <p>You do not have permission to access this service.</p>
      <p>To request permission please contact [xxxxxxxxxxx]</p>
    </div>
  );
}
