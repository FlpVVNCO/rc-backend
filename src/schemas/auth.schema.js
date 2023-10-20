import { z } from "zod";

export const registerSchema = z.object({
  name: z.string({
    required_error: "Username is required",
  }),
  email: z
    .string({
      required_error: "Email is required",
    })
    .email({
      required_error: "Invalid email",
    }),
  password: z
    .string({
      required_error: "Password is required",
    })
    .refine(
      (password) => {
        // Al menos una mayúscula
        const uppercaseRegex = /[A-Z]/;
        // Al menos una minúscula
        const lowercaseRegex = /[a-z]/;
        // Al menos un signo
        const specialCharacterRegex = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/;
        return (
          uppercaseRegex.test(password) &&
          lowercaseRegex.test(password) &&
          specialCharacterRegex.test(password)
        );
      },
      {
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, and one special character.",
      }
    ),
});

export const loginSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
    })
    .email({
      message: "Invalid email",
    }),
  password: z
    .string({
      required_error: "Password is required",
    })
    .refine(
      (password) => {
        // Al menos una mayúscula
        const uppercaseRegex = /[A-Z]/;
        // Al menos una minúscula
        const lowercaseRegex = /[a-z]/;
        // Al menos un signo
        const specialCharacterRegex = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/;
        return (
          uppercaseRegex.test(password) &&
          lowercaseRegex.test(password) &&
          specialCharacterRegex.test(password)
        );
      },
      {
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, and one special character.",
      }
    ),
});
