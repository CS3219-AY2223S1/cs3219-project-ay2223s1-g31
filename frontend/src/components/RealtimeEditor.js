import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { useDarkTheme } from "../theme/ThemeContextProvider";
import { Paper } from "@mui/material";

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
        height={300}
        // maxHeight={300}
        placeholder={"Enter your code here..."}
        basicSetup={true}
        extensions={[python()]}
      />
    </>
  );
}

export default RealtimeEditor;
