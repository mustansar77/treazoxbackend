import Cors from "cors";

const cors = Cors({
  origin: [
    "http://localhost:3000",
    "https://treazox1.vercel.app/"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
});

export default function runCors(req, res) {
  return new Promise((resolve, reject) => {
    cors(req, res, (result) => {
      if (result instanceof Error) return reject(result);
      return resolve(result);
    });
  });
}
