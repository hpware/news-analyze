export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug");
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn("python3", ["scraping/hot_articles.py"]);

    let dataString = "";

    pythonProcess.stdout.on("data", (data) => {
      dataString += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      console.error(`Error: ${data}`);
    });

    pythonProcess.on("close", (code) => {
      resolve({ status: "completed", output: dataString });
    });
  });
});
