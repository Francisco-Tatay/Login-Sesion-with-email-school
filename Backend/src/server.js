import app from "./app.js";
import { connectDB } from "./Data/Db.js";

const PORT = process.env.PORT || 3000;

const startServer = async () => {
	const dbConnected = await connectDB();
	if (!dbConnected) {
		process.exit(1);
	}
	app.listen(PORT, () => {
		console.log(`Server is running on port http://localhost:${PORT}`);
	});
};
startServer();
