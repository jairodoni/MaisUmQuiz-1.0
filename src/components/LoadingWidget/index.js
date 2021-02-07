import React from "react";
import Widget from "../../components/Widget";

import { motion } from 'framer-motion';

const loaderVariants = {
  animationOne: {
    x: [-120, 120],
    
    transition: {
      yoyo: Infinity,
      duration: 1
    },
    y:{
      yoyo: Infinity,
      duration: 1
    }
  }
}

export default function LoadingWidget() {
  return (
    <Widget>
      <Widget.Header>Carregando...</Widget.Header>

      <Widget.Content 
        as={motion.div}
        variants={loaderVariants}
        animate="animationOne"
      >
       <Widget.Load/>
       
      </Widget.Content>
    </Widget>
  );
}