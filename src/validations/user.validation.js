import { z } from 'zod';

// Ortak kullanıcı şeması
const baseUserSchema = {
  name: z.string().min(2, 'İsim en az 2 karakter olmalıdır').max(50, 'İsim en fazla 50 karakter olmalıdır'),
  email: z.string().email('Geçerli bir email adresi giriniz'),
};

// Kullanıcı oluşturma şeması
export const createUserSchema = z.object({
  ...baseUserSchema,
  password: z
    .string()
    .min(6, 'Şifre en az 6 karakter olmalıdır')
    .max(50, 'Şifre en fazla 50 karakter olmalıdır')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Şifre en az bir büyük harf, bir küçük harf ve bir rakam içermelidir'
    ),
});

// Kullanıcı güncelleme şeması
export const updateUserSchema = z.object({
  ...baseUserSchema,
  password: z
    .string()
    .min(6, 'Şifre en az 6 karakter olmalıdır')
    .max(50, 'Şifre en fazla 50 karakter olmalıdır')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Şifre en az bir büyük harf, bir küçük harf ve bir rakam içermelidir'
    )
    .optional(),
  role: z.enum(['NORMAL', 'ADMIN']).optional(),
});

// ID validasyon şeması
export const idSchema = z.object({
  id: z.string().refine((val) => !isNaN(parseInt(val)), {
    message: 'Geçerli bir ID giriniz',
  }),
}); 