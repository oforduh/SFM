import React from "react";
import styles from "./header.module.scss";

const Header = ({ marqueeText }) => {
  return (
    <header>
      <section className={styles.widget}>
        {/* <marquee>
          <b>I Love it Beautiful, Classy and Simple🥰😌😍</b>
        </marquee> */}
        <div className={styles.marquee}>
          <span>{marqueeText}</span>
        </div>
      </section>
    </header>
  );
};

export default Header;
