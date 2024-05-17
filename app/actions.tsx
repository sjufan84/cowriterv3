import { nanoid } from 'ai';
import { createStreamableUI, createStreamableValue } from 'ai/rsc';
import { OpenAI } from 'openai';
import { ReactNode } from 'react';
import { createAI } from 'ai/rsc';
import { Stream } from 'openai/streaming.mjs';
import { getAIState, getMutableAIState } from 'ai/rsc';
import Image from 'next/image';
import AIChatBubble from '../components/chat/AIChatBubble';


export const maxDuration = 300; // 300 seconds (5min)
export const dynamic = 'force-dynamic';
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY});

async function submitToolOutputs({toolOutputs, threadId, runId} : {toolOutputs: any, threadId: string, runId: string}) {
  // Convert the tool outputs to the required a json object
  const toolOutputsJson = toolOutputs.map((toolOutput: any) => {
    return {
      tool_call_id: toolOutput.tool_call_id,
      output: toolOutput.output,
    };
  });

  console.log(`Submitting tool outputs: ${JSON.stringify(toolOutputsJson)}`);

  return await openai.beta.threads.runs.submitToolOutputs(
    threadId,
    runId,
    {
      tool_outputs: toolOutputsJson,
    }
  );
}
    

export interface ClientMessage {
  id: string;
  content?: ReactNode | string;
  threadId: string;
  role: 'user' | 'assistant';
}

export interface ServerMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function getAnswer(question: string, THREAD_ID: string, ASSISTANT_ID: string) : Promise<ClientMessage> {
  'use server'
  const history = getMutableAIState();
  // const speechOutput = createStreamableValue('');

  const assistantResponse = createStreamableUI(<div className="flex flex-row text-md md:text-lg items-center mt-4" id="initialAssisantResponse">
    <span className="text-black mr-2">Writing</span>
    <span className="loading loading-dots loading-md md:loading-lg text-black text-sm" />
  </div>
  );
  let RUN_ID = '';
  let text = '';


  const runQueue: { id: string; run: Stream<OpenAI.Beta.Assistants.AssistantStreamEvent>; }[] = [];

  (async () => {
    if (THREAD_ID) {
      await openai.beta.threads.messages.create(THREAD_ID, {
        role: 'user',
        content: question,
      });

      const run = await openai.beta.threads.runs.create(THREAD_ID, {
        assistant_id: ASSISTANT_ID,
        stream: true,
        });

      runQueue.push({ id: nanoid(), run });
    } else {
      const run = await openai.beta.threads.createAndRun({
        assistant_id: ASSISTANT_ID,
        stream: true,
        thread: {
          messages: [{ role: 'user', content: question }],
        },
      });

      runQueue.push({ id: nanoid(), run });
    }

    while (runQueue.length > 0) {
      const latestRun = runQueue.shift();

      if (latestRun) {
        for await (const delta of latestRun.run) {
          const { data, event } = delta;


          if (event === 'thread.created') {
            THREAD_ID = data.id;
          } else if (event === 'thread.run.created') {
            RUN_ID = data.id;
          } else if (event === 'thread.message.delta') {
            data.delta.content?.map(part => {
              if (part.type === 'text') {
                if (part.text) {
                  text += part.text.value;
                  assistantResponse.update(<AIChatBubble message={text} />);
                }
              }
            });
          } else if (event === 'thread.message.completed') {
            console.log(`Run completed with text: ${text}`);
            // speechOutput.update(text);
          } else if (event === 'thread.run.failed') {
            console.log(data);
          } else if (event === 'thread.run.requires_action' && 'thread.run.required_action.submit_tool_outputs') {
            console.log(`Tool outputs required for run ${latestRun.id}`);
                while (true) {
                  const tool_outputs = data.required_action?.submit_tool_outputs.tool_calls.map((toolCall: any) => {
                    console.log(`Tool call: ${toolCall.function.name}`)
                    const parameters = JSON.parse(toolCall.function.arguments);
                    switch (toolCall.function.name) {
                      case 'generateRecipe': {
                        console.log('Placeholder function')
                        return {
                          tool_call_id: toolCall.id,
                          output: 'Placeholder function',
                        };
                      }
                      default: {
                        return {
                          tool_call_id: toolCall.id,
                          output: 'Sorry, I can\'t help with that.',
                        };
                      }
                    }
                  });
                  console.log(tool_outputs);
                  await submitToolOutputs({toolOutputs: tool_outputs, threadId: THREAD_ID, runId: RUN_ID});
                  assistantResponse.update('');
                  break;
                }
            }
          }
        }
      }

    // iF there is text, update the assistant response, otherwise return ''
    assistantResponse.done();
    })();
  
    return {
      role: 'assistant',
      id: nanoid(),
      content: assistantResponse.value,
      threadId: THREAD_ID,
      // speechFile: speechOutput.value as string
  };
}

export const AI = createAI<ServerMessage[], ClientMessage[]>({
actions: {
  getAnswer,
},
initialAIState: [],
initialUIState: [],
});