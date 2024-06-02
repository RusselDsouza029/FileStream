import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const variants = {
  open: { x: 0 },
  closed: { x: -100 },
};

const tabletVariants = {
  open: { y: 0 },
  closed: { y: 100 },
};

const isTabletMediaQuery = window.innerWidth <= 1024;

const SideMenu = ({ isOpen, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="side-menu"
          initial="closed"
          animate="open"
          exit="closed"
          variants={isTabletMediaQuery ? tabletVariants : variants}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SideMenu;
