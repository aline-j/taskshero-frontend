"use client";



function LoadingThreeDotsJumping() {
  const dotVariants = {
    jump: {
      y: -30, // translateY(-30px)
      transition: {
        duration: 0.8,
        repeat: Infinity,
        repeatType: "mirror",
        ease: "easeInOut",
      },
    },
    initial: {
      y: 0,
    },
  };

  const containerVariants = {
    initial: {
      opacity: 1,
    },
    animate: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <motion.div
      className="container"
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      <motion.div
        className="dot"
        variants={dotVariants}
        initial="initial"
        animate="jump"
      />
      <motion.div
        className="dot"
        variants={dotVariants}
        initial="initial"
        animate="jump"
      />
      <motion.div
        className="dot"
        variants={dotVariants}
        initial="initial"
        animate="jump"
      />
      <StyleSheet />
    </motion.div>
  );
}

/**
 * ==============   Styles   ================
 */
function StyleSheet() {
  return (
    <style>
      {`
            .container {
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 10px;
            }

            .dot {
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background-color: #d97706;
                will-change: transform;
            }
            `}
    </style>
  );
}

export default LoadingThreeDotsJumping;
