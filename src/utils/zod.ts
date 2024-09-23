import { z } from 'zod';
import { matchIsValidTel } from 'mui-tel-input';

export const zodBaseString = z.string({ invalid_type_error: 'Geçerli değer girin' });

export const zodName = () => zodBaseString.trim().min(2, 'Bu alan en az 2 karakter olabilir');

export const zodEmail = () => zodBaseString.toLowerCase().email('Email adresi geçersiz');

export const zodPhone = () => zodBaseString.refine((x) => matchIsValidTel(x), { message: 'Telefon numarası geçersiz' });

export const zodBoolean = () =>
  zodBaseString
    .toLowerCase()
    .transform((x) => x === 'true')
    .pipe(z.boolean());
