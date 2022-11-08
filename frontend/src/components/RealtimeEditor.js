import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { useDarkTheme } from "../theme/ThemeContextProvider";

const CODE_CACHE_KEY = "code-cache";

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
          overflow: "auto",
          borderRadius: "10px",
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
