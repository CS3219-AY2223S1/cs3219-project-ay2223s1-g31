import { promises as fs } from "fs";
import { v4 } from "uuid";
import { PythonShell } from "python-shell";

export async function codeExec(req, res) {
  try {
    const { code } = req.body;
    console.log(code);
    if (typeof code !== "string") {
      return res.status(400).json({ message: "Invalid request!" });
    }
    PythonShell.runString(code, null, (err, output) => {
      if (err) {
        console.log(err.message);
        return res.status(200).json({ error: err.message });
      }
      console.log(output);
      return res.status(200).json({ output });
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server failure when executing code!" });
  }
}
