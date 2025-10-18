import { z } from "zod";

export const SignUpSchema = z
  .object({
    name: z.string().min(2, { message: "Namn måste vara minst 2 tecken" }).max(50),
    email: z.string().email({ message: "Ogiltig e-postadress" }).max(100),
    password: z.string().min(8, { message: "Lösenordet måste vara minst 8 tecken" }).max(100),
    confirmPass: z.string(),
  })
  .refine((vals) => vals.password === vals.confirmPass, {
    message: "Lösenorden matchar inte",
    path: ["confirmPass"],
  });

export type SignUpInput = z.infer<typeof SignUpSchema>;

export const SignInSchema = z.object({
  email: z.string().email({ message: "Ogiltig e-postadress" }).max(100),
  password: z.string().min(8, { message: "Lösenordet måste vara minst 8 tecken" }).max(100),
});

export type SignInInput = z.infer<typeof SignInSchema>;

export const PasswordResetRequestSchema = z.object({
  email: z.string().email({ message: "Ogiltig e-postadress" }).max(100),
});

export type PasswordResetRequestInput = z.infer<typeof PasswordResetRequestSchema>;

export const PasswordResetSchema = z
  .object({
    token: z.string().min(1),
    newPassword: z.string().min(8).max(100),
    confirmNewPassword: z.string(),
  })
  .refine((v) => v.newPassword === v.confirmNewPassword, {
    message: "Lösenorden matchar inte",
    path: ["confirmNewPassword"],
  });

export type PasswordResetInput = z.infer<typeof PasswordResetSchema>;

const schemas = {
  SignUpSchema,
  SignInSchema,
  PasswordResetRequestSchema,
  PasswordResetSchema,
};

export default schemas;
