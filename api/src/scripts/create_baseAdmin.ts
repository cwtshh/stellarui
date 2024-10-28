import User from "../model/User"

const create_baseAdmin = async() => {
    if(!await User.findOne({email: process.env.ADMIN_EMAIL || 'admin@admin.com'})) {
        const baseAdmin = await User.create({
            email: process.env.ADMIN_EMAIL || 'admin@admin.com',
            password: process.env.ADMIN_PASSWORD || '@admin4578',
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