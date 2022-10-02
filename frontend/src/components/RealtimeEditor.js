import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";

function RealtimeEditor({ value, onChange }) {
  const handleChange = (value, viewUpdate) => {
    console.log(viewUpdate.state.values[0]);
    onChange(value, viewUpdate);
  };

  return (
    <>
      <CodeMirror
        value={value}
        onChange={handleChange}
        theme="dark"
        editable={true}
        height={"400px"}
        placeholder={"Enter your code here..."}
        basicSetup={true}
        extensions={[python()]}
      />
    </>
  );
}

export default RealtimeEditor;
