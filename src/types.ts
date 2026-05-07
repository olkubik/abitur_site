import { z } from "zod";

export const ProgramSchema = z.object({
  id: z.string().optional(),
  institute_id: z.coerce.number(),
  code: z.string().min(1),
  name: z.string(),
  degree_level: z.string(),
  duration_years: z.coerce.number(),
  study_form: z.string(),
  tuition_fee: z.coerce.number(),
  budget_places: z.coerce.number(),
  paid_places: z.coerce.number(),
  passing_score: z.coerce.number()
});

export type Program = z.infer<typeof ProgramSchema>;

export type Institute = {
  id: number;
  name: string;
};
