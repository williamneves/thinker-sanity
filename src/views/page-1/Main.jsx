import React, { useState, useEffect } from "react";
import sanityClient from "../../../client.js";

function Main() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    sanityClient
      .fetch(
        `
      *[_type == 'userProfile']{
  ...,
  }
      `
      )
      .then((res) => {
        setData(res);
        setLoading(false);
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <>
      <div className="intro-y flex items-center mt-8">
        <h2 className="text-lg font-medium mr-auto">Page 1</h2>
      </div>
      {/* BEGIN: Page Layout */}
      <div className="intro-y box p-5 mt-5">Name: {data[0]?.name}</div>
      {/* END: Page Layout */}
    </>
  );
}

export default Main;
