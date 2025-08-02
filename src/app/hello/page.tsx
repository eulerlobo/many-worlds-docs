import React from "react";
import Barchart from "~/app/_components/barchat";
import NetworkGraph from "~/app/_components/networkGraph";

export default function Page() {
  return (
    <div>
      <Barchart />
      <br/>
      <br/>
      <br/>
      <NetworkGraph/>
    </div>
  );
}