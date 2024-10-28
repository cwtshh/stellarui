import User from "../model/User"
import bcrypt from 'bcryptjs';

const create_baseAdmin = async() => {
    if(!await User.findOne({email: process.env.ADMIN_EMAIL || 'admin@admin.com'})) {


        const salt = await bcrypt.genSalt();
        const hashed_password = await bcrypt.hash(process.env.ADMIN_PASSWORD || '@admin4578', salt);

        const baseAdmin = await User.create({
            email: process.env.ADMIN_EMAIL || 'admin@admin.com',
            password: hashed_password,
            role: 'admin',
            name: process.env.ADMIN_NAME || 'Admin'
        })
        if(!baseAdmin) {
            console.log('Error creating base admin');
        }
        console.log('Base admin created');
        return;
    }
    console.log('Base admin already exists');
};

export default create_baseAdmin;