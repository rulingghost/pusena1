// @ts-nocheck

export type SignupDtoGender = typeof SignupDtoGender[keyof typeof SignupDtoGender];


export const SignupDtoGender = {
  female: 'female',
  male: 'male',
  other: 'other',
} as const;
