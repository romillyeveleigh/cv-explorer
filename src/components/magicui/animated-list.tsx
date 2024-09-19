"use client";

import React, { ReactElement, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export interface AnimatedListProps {
  className?: string;
  children: React.ReactNode;
  delay?: number;
}

export const AnimatedList = React.memo(
  ({ className, children, delay = 1000 }: AnimatedListProps) => {
    const [index, setIndex] = useState(0);
    const childrenArray = React.Children.toArray(children);

    // useEffect(() => {
    //   const interval = setInterval(() => {
    //     setIndex((prevIndex) => (prevIndex + 1) % childrenArray.length);
    //   }, delay);

    //   return () => clearInterval(interval);
    // }, [childrenArray.length, delay]);

    // const itemsToShow = useMemo(
    //   () => childrenArray,
    //   [index, childrenArray],
    // );

    return (
        <AnimatePresence>
          {childrenArray.map((item) => (
            <AnimatedListItem key={(item as ReactElement).key}>
              {item}
            </AnimatedListItem>
          ))}
        </AnimatePresence>
    );
  },
);

AnimatedList.displayName = "AnimatedList";

export function AnimatedListItem({ children }: { children: React.ReactNode }) {
  const animations = {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1, originX: 0 },
    exit: { scale: 0, opacity: 0 },
    transition: { type: "spring", stiffness: 350, damping: 40 },
  };

  return (
    <motion.div {...animations} layout >
      {children}
    </motion.div>
  );
}
