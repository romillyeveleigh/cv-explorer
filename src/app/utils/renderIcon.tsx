"use client";

import React from "react";
import * as SimpleIcons from "simple-icons";

export const renderIcon = (slug: string) => {
  // parsed slug should capitalize the first letter and precede it with si
  const parsedSlug = `si${slug.charAt(0).toUpperCase()}${slug.slice(1)}`;
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
