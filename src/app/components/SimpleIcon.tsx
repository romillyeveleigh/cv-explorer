"use client";

import React, { FC } from "react";
import * as SimpleIcons from "simple-icons";

interface SimpleIconProps {
  slug: string;
}

export const SimpleIcon: FC<SimpleIconProps> = ({ slug }) => {
  // parsed slug should capitalize the first letter and precede it with si
  let parsedSlug = slug.toLowerCase();
  // convert "." to "dot"
  parsedSlug = parsedSlug.replace(/\./g, "dot");
  parsedSlug = `si${parsedSlug.charAt(0).toUpperCase()}${parsedSlug.slice(1)}`;
  const icon = SimpleIcons[parsedSlug as keyof typeof SimpleIcons];

  return icon ? (
    <svg
      role="img"
      viewBox="0 0 24 24"
      className="h-4 w-4 mr-2"
      fill="currentColor"
    >
      <path d={icon.path} />
    </svg>
  ) : null;
};
