import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

/**
 * Şifreyi hashler
 * @param {string} password - Hashlenecek şifre
 * @returns {Promise<string>} Hashlenmiş şifre
 */
export const hashPassword = async (password) => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Şifreyi doğrular
 * @param {string} password - Doğrulanacak şifre
 * @param {string} hashedPassword - Hashlenmiş şifre
 * @returns {Promise<boolean>} Şifre doğru mu?
 */
export const verifyPassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
}; 