import bcrypt from 'bcrypt'

export const hashPassword = async (password) => {
    try {
        const hashRounds = 10;
        const hashedPassword = await bcrypt.hash(password,hashRounds);
        return hashedPassword;
    } catch (error) {
        console.log('Error in hashed bcrypt password :');
        console.log(error);
    }
};

export const comparePassword = async (password,hashedPassword) => {
    return  bcrypt.compare(password,hashedPassword);
};