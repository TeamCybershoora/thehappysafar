"use client";

import dynamic from "next/dynamic";

const Skiper39 = dynamic(() => import("./skiper39").then((m) => m.Skiper39), {
  ssr: false,
  loading: () => null,
});

export default function Skiper39Client() {
  return <Skiper39 />;
}
