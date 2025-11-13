"use client";

import { useEffect, useState } from "react";
import { formatDate } from "@/lib/utils";

export default function CommentDate({ date }: { date: Date }) {
  const [format, setFormat] = useState("");

  useEffect(() => {
    setFormat(formatDate(date));
  }, [date]);

  return <div className="text-sm">{format}</div>;
}
