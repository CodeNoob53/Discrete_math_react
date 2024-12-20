import React from "react";
import { MathJax, MathJaxContext } from "better-react-mathjax";

const MathJaxRenderer = ({ formula, inline = false }) => {
  const config = {
    loader: { load: ["[tex]/html"] },
    tex: {
      inlineMath: [["$", "$"], ["\\(", "\\)"]],
      displayMath: [["$$", "$$"], ["\\[", "\\]"]],
    },
  };

  return (
    <MathJaxContext config={config}>
      <MathJax inline={inline}>{formula}</MathJax>
    </MathJaxContext>
  );
};

export default MathJaxRenderer;
