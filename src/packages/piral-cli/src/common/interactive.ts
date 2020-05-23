import { inquirer } from '../external';

export function promptSelect(message: string, values: Array<string>, defaultValue: string): Promise<string> {
  const questions = [
    {
      name: 'q',
      type: 'list' as const,
      choices: values,
      message,
      default: defaultValue,
    },
  ];
  return inquirer.prompt(questions).then((answers: any) => answers.q);
}

export function promptConfirm(message: string, defaultValue: boolean): Promise<boolean> {
  const questions = [
    {
      name: 'q',
      type: 'confirm' as const,
      message,
      default: defaultValue,
    },
  ];
  return inquirer.prompt(questions).then((answers: any) => answers.q);
}
