"use client";

import { useEffect, useState } from "react";
import { formatDate } from "@/lib/utils";

interface Props {
  date: Date;
  edited: boolean;
  className?: string;
}

export default function FormattedDate({ date, className, edited }: Props) {
  const [format, setFormat] = useState("");

  useEffect(() => {
    setFormat(formatDate(date));
  }, [date]);

  return (
    <div className={className}>
      {format} {edited && "(Edited)"}
    </div>
  );
}
