import { z } from "zod";

export const AuthenticationSchema = z.object({
  email: z.string().email("Merci d'entrer un format d'email valide."),
  password: z.string()
    .min(8, "Le mot de passe doit faire 8 caractères minimum.")
    .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, 'Le mot de passe doit contenir une lettre, un caractère spécial et 8 caractères minimum.')
})
