import { nanoid } from 'ai';
import { createStreamableUI, createStreamableValue } from 'ai/rsc';
import { OpenAI } from 'openai';
import { ReactNode } from 'react';
import { createAI } from 'ai/rsc';
import { Stream } from 'openai/streaming.mjs';
import { getAIState, getMutableAIState } from 'ai/rsc';
import Image from 'next/image';
import AIChatBubble from '../components/chat/AIChatBubble';
import fs from 'fs';


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

  const assistantResponse = createStreamableUI(<div className="flex flex-row mt-4 items-center justify-center">
    <p className="text-md lg:text-lg text-[#17123D] mr-3">Working on it partner</p>
    <span className="loading loading-dots loading-md large:loading-lg mt-1 text-[#17123D]"></span>
  </div>);
  let RUN_ID = '';
  let text = '';
  console.log(`Getting answer for question: ${question} with threadId: ${THREAD_ID} and assistantId: ${ASSISTANT_ID}`);


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
          } else if (event === 'thread.run.failed') {
            console.log(data);
          } else if (event === 'thread.run.requires_action' && 'thread.run.required_action.submit_tool_outputs') {
            console.log(`Tool outputs required for run ${latestRun.id}`);
                while (true) {
                  const tool_outputs = data.required_action?.submit_tool_outputs.tool_calls.map((toolCall: any) => {
                    console.log(`Tool call: ${toolCall.function.name}`)
                    const parameters = JSON.parse(toolCall.function.arguments);
                    switch (toolCall.function.name) {
                      case 'generateMusic': {
                        assistantResponse.update(<AIChatBubble message={`I've generated the following prompt for you: ${parameters.musicGenPrompt}.`} />);
                        return {
                          tool_call_id: toolCall.id,
                          output: `You are generating music for the user for the inputs: ${parameters.musicGenPrompt}.  For now
                          tbis is just a placeholder response, so continue the conversation as if the music has been generated.
                          Let the user know what your ideas were for the prompt and continue the conversation.`,
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

export async function getClonedVocalsResponse(THREAD_ID: string, ASSISTANT_ID: string, transcriptionText: string) : Promise<ClientMessage> {
  'use server'
  const assistantResponse = createStreamableUI(<div><span className="loading loading-spinner loading-md text-red-900"></span></div>);
  let RUN_ID = '';
  let text = '';
  console.log(`Getting cloned vocals response with threadId: ${THREAD_ID} and assistantId: ${ASSISTANT_ID}`);

  const runQueue: { id: string; run: Stream<OpenAI.Beta.Assistants.AssistantStreamEvent>; }[] = [];

  (async () => {

    const threadMessages = await openai.beta.threads.messages.create(
      THREAD_ID,
      { role: "user", content: `I've just submitted some vocals with lyrics of <lyrics>${transcriptionText}</lyrics> that you've sang back to me in your voice.  
      You could respond with something like, 'How does that sound?  Let me know what you think! -- That's just an example, 
      adapt according to the context of our conversation and the lyrics of the vocals.'`
      }
    );

    console.log(`Submitted clone vocals message to thread: ${THREAD_ID} with message: ${threadMessages.id}`)

    const run = await openai.beta.threads.runs.create(THREAD_ID, {
      assistant_id: ASSISTANT_ID,
      stream: true,
      });

      runQueue.push({ id: nanoid(), run });

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
          } else if (event === 'thread.run.failed') {
            console.log(data);
          
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
  getAnswer, getClonedVocalsResponse
},
initialAIState: [],
initialUIState: [],
});