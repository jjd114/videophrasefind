import { z } from "zod";
import { parse } from "@plussub/srt-vtt-parser";

import { secondsToVttFormat } from "../utils/json.schema";

export const transcriptionsSchema = z
  .object({
    value: z.string(), // (1) вопрос может ли api возвращать тут быть массив строк, как в прошлом
    start: z.number(), // вопрос в секундах ли это, по-моему да 🤔
    end: z.number(), // вопрос в секундах ли это, по-моему да 🤔
  })
  .array()
  .transform((transcriptions) => {
    const vttLines = transcriptions.map(
      (transcription) =>
        `${secondsToVttFormat(transcription.start)} --> ${secondsToVttFormat(
          transcription.end,
        )}\n- ${transcription.value}\n`, // (1) нужен ли тут тогда этот join (нет)
    );

    return {
      captionsVtt: `WEBVTT\n${vttLines.join("\n")}`,
    };
  })
  .transform((data) => ({
    ...data,
    parsedCaptions: parse(data.captionsVtt).entries,
  }));

export type TranscriptionsSchema = z.infer<typeof transcriptionsSchema>;
