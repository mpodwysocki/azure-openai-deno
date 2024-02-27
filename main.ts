import { load } from "https://deno.land/std@0.217.0/dotenv/mod.ts";
const env = await load();

import { AzureKeyCredential } from "npm:@azure/openai@1.0.0-alpha.20240223.1";
import { streamCompletions, createOpenAI } from "npm:@azure/openai@1.0.0-alpha.20240223.1/api";

const prompt = ["What is Azure OpenAI?"];

export async function main() {
  const endpoint = env["ENDPOINT"];
  const azureApiKey = env["AZURE_API_KEY"];
  if (!azureApiKey || !endpoint) {
    throw new Error("Please provide an ENDPOINT and AZURE_API_KEY environment variable");
  }

  console.log("== Stream Completions Sample ==");

  const client = createOpenAI(endpoint, new AzureKeyCredential(azureApiKey));
  const deploymentId = "text-davinci-003";
  const events = await streamCompletions(client, deploymentId, prompt, { maxTokens: 128 });

  for await (const event of events) {
    for (const choice of event.choices) {
      console.log(choice.text);
    }
  }
}

// Learn more at https://deno.land/manual/examples/module_metadata#concepts
if (import.meta.main) {
  try {
    await main();
  } catch (error) {
    console.error("An Error occurred", error);
  }
}
