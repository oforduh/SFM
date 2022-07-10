import React from "react";
import styles from "./footer.module.scss";

const Footer = () => {
  return (
    <div className={styles.container}>
      {" "}
      <span>© Copyright 2022 safemoon.com , Audited by CERTIK.</span>
    </div>
  );
};

export default Footer;
