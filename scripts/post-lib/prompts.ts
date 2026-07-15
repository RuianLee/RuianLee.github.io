import { createInterface } from "node:readline";

const rl = createInterface({ input: process.stdin, output: process.stdout });

// `readline`'s one-shot `.question()` drops any line that arrives before it's
// called (e.g. when input is piped rather than typed live), so queue lines
// off a persistent 'line' listener instead and let prompts pull from it.
const lineQueue: string[] = [];
const waiters: ((line: string) => void)[] = [];

rl.on("line", line => {
  const waiter = waiters.shift();
  if (waiter) waiter(line);
  else lineQueue.push(line);
});

function nextLine(): Promise<string> {
  const queued = lineQueue.shift();
  if (queued !== undefined) return Promise.resolve(queued);
  return new Promise(resolve => waiters.push(resolve));
}

export async function askText(
  question: string,
  defaultValue?: string
): Promise<string> {
  const suffix = defaultValue ? ` (預設: ${defaultValue})` : "";
  process.stdout.write(`${question}${suffix}: `);
  const answer = (await nextLine()).trim();
  return answer || defaultValue || "";
}

export async function askYesNo(
  question: string,
  defaultYes: boolean
): Promise<boolean> {
  const answer = await askText(
    `${question} (${defaultYes ? "Y/n" : "y/N"})`,
    defaultYes ? "y" : "n"
  );
  return answer.toLowerCase() === "y";
}

export async function askChoice<T extends string>(
  question: string,
  options: { value: T; label: string }[]
): Promise<T> {
  console.log(question);
  options.forEach((opt, i) => console.log(`  ${i + 1}) ${opt.label}`));

  while (true) {
    process.stdout.write("輸入編號: ");
    const raw = (await nextLine()).trim();
    const index = Number(raw) - 1;
    if (Number.isInteger(index) && options[index]) {
      return options[index].value;
    }
    console.log("無效的選項，請重新輸入。");
  }
}

export function closePrompts() {
  rl.close();
}
