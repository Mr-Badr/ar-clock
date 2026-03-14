"use client";
import { useState, useEffect } from "react";

export default function CurrentTime() {
  const [nowISO, setNowISO] = useState("");

  useEffect(() => {
    setNowISO(new Date().toISOString());
  }, []);

  if (!nowISO) return null; // or a placeholder

  return <time dateTime={nowISO}>{new Date(nowISO).toLocaleString("ar-EG")}</time>;
}