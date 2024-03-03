import mongoose from 'mongoose';

mongoose.set('strictQuery', true);
mongoose.set('strictPopulate', false);

export async function connect() {
	try {
		const connection = await mongoose.connect(
			'mongodb://localhost:27017/websocket',
		);
    console.log('Connected to MongoDB');
    return connection;
	} catch (err) {
		console.log(err.message);
	}
}
