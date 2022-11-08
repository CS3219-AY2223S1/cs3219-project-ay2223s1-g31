import axios from "axios";
import "dotenv/config";

const JDOODLE_API = "https://api.jdoodle.com/v1/execute";
const JDOODLE_CLIENT_ID = process.env.JDOODLE_CLIENT_ID;
const JDOODLE_CLIENT_SECRET = process.env.JDOODLE_CLIENT_SECRET;

export async function codeExec(req, res) {
  try {
    const { code } = req.body;
    console.log(code);
    if (typeof code !== "string") {
      return res.status(400).json({ message: "Invalid request!" });
    }
    const response = await axios.post(JDOODLE_API, {
      clientId: JDOODLE_CLIENT_ID,
      clientSecret: JDOODLE_CLIENT_SECRET,
      script: code,
      language: "python3",
      versionIndex: "4",
    });
    console.log(response);
    if (response.data.error) {
      return req.status(500).json({ message: "Cannot execute code" });
    }
    const { output, cpuTime } = response.data;
    return res.status(200).json({ output: output.trim(), cpuTime });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server failure when executing code!" });
  }
}
