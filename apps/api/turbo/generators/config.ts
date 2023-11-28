import type { PlopTypes } from "@turbo/gen";

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  // create a generator
  plop.setGenerator("plugin", {
    description: "Generator description",
    // gather information from the user
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'What is your plugin name?'
      },
      {
        type: 'confirm',
        name: 'customPath',
        message: 'Do you want to create a custom path for your plugin?',
      },
      {
        type: 'input',
        name: 'path',
        message: 'What is your custom path?',
        when: (answers) => answers.customPath,
      }
    ],
    // perform actions based on the prompts
    actions: function (data) {
      const actions: PlopTypes.Actions = []
      const directoryName = (data?.name as string)
        .toLowerCase()
        .replace(/plugin/g, '')
      if (data?.name) {
        data.name = directoryName
      }

      const path = data?.customPath
        ? data?.path
        : `src/plugins/${directoryName}`

      actions.push({
        type: 'add',
        path: `${path}/index.ts`,
        templateFile: 'templates/plugin.hbs'
      })

      return actions
    },
  });
}