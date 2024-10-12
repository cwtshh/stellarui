import mongoose from 'mongoose';
const CONNECTION_STRING = process.env.CONNECTION_STRING;
if(!CONNECTION_STRING) {
    console.error('No connection string provided');
    process.exit(1);
}

const connect_db = async() => {
    try {
        console.log('Connecting to database' + ' ... ' + CONNECTION_STRING);
        await mongoose.connect(CONNECTION_STRING);
        console.log('Connected to database');
    } catch (error) {
        console.error('Error connecting to database', error);
        process.exit(1);
    }
};

export default connect_db;