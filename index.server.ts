import path from "node:path";
import { z } from "zod";
import { defineAgentTool, type PluginServerContext } from "@getpaseo/plugin/server";
import { createJevClientFromEnv, type JevClient } from "./server/client";
import { formatJevGrepResult, searchWithJev } from "./server/grep";

function jevgrepTool(client: JevClient) {
  return defineAgentTool({
    name: "jevgrep",
    title: "Jevgrep",
    description:
      "Find source by asking what it does. Use this instead of Grep or rg when you do not know which file holds the behavior. Pass a repository question. Keep Grep for an exact symbol or regex. Returns ranked paths and verbatim excerpts.",
    input: z.object({
      query: z
        .string()
        .trim()
        .min(1)
        .max(2_000)
        .describe("Behavior question, for example where authentication is checked."),
      root: z
        .string()
        .trim()
        .min(1)
        .optional()
        .describe("Folder to search. Defaults to the agent working directory."),
    }),
    async execute({ query, root }, { agent, signal }) {
      const result = await searchWithJev({
        query,
        root: root ? path.resolve(agent.cwd, root) : agent.cwd,
        ask: client,
        signal,
      });
      return { text: formatJevGrepResult(result) };
    },
  });
}

export default function contribute(server: PluginServerContext) {
  const client = createJevClientFromEnv();
  if (!client) return () => {};
  const tool = jevgrepTool(client);
  server.addHook("agent.open.before", async ({ request }) => ({
    ...request,
    tools: [...request.tools, tool],
  }));
  return () => {};
}
