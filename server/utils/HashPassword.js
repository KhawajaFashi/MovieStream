import bcrypt from 'bcrypt'

const saltRounds = process.env.SALT_ROUNDS || 10;
export const encryptPassword = async (password) => {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
}

export const decryptPassword = async (enteredPassword, hashedPassword) => {
    const result = await bcrypt.compare(enteredPassword, hashedPassword);
    return result;
}
