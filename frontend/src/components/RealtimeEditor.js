import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { useDarkTheme } from "../theme/ThemeContextProvider";

function RealtimeEditor({ value, onChange }) {
  const { isDarkTheme } = useDarkTheme();
  const handleChange = (value, viewUpdate) => {
    onChange(value, viewUpdate);
  };

  return (
    <>
      <CodeMirror
        value={value}
        onChange={handleChange}
        theme={isDarkTheme ? "dark" : "light"}
        editable={true}
        height={"450px"}
        style={{
          margin: "0 auto",
          textAlign: "left",
          maxWidth: "60vw",
          overflow: "auto",
          borderRadius: "5px",
          position: "relative",
          zIndex: 999,
        }}
        // maxHeight={300}
        // minHeight={600}
        placeholder={"Enter your code here..."}
        basicSetup={true}
        extensions={[python()]}
      />
    </>
  );
}

export default RealtimeEditor;
