import { prompt } from 'inquirer';

export function promptSelect(message: string, values: Array<string>, defaultValue: string) {
  const questions = [
    {
      name: 'q',
      type: 'list',
      choices: values,
      message,
      default: defaultValue,
    },
  ];
  return prompt(questions).then(answers => answers.q);
}

export function promptConfirm(message: string, defaultValue: boolean) {
  const questions = [
    {
      name: 'q',
      type: 'confirm',
      message,
      default: defaultValue,
    },
  ];
  return prompt(questions).then(answers => answers.q);
}
