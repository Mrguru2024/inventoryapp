module.exports = function (plop) {
  plop.setGenerator("component", {
    description: "Scaffold MCP component with test and story",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "Component name (e.g., FccIdCard)",
      },
      {
        type: "confirm",
        name: "withStyles",
        message: "Include CSS module?",
        default: false,
      },
    ],
    actions: [
      {
        type: "add",
        path: "components/{{pascalCase name}}/index.tsx",
        templateFile: "plop-templates/component.hbs",
      },
      {
        type: "add",
        path: "components/{{pascalCase name}}/{{pascalCase name}}.test.tsx",
        templateFile: "plop-templates/test.hbs",
      },
      {
        type: "add",
        path: "components/{{pascalCase name}}/{{pascalCase name}}.stories.tsx",
        templateFile: "plop-templates/story.hbs",
      },
      {
        type: "add",
        path: "components/{{pascalCase name}}/{{pascalCase name}}.module.css",
        templateFile: "plop-templates/styles.hbs",
        skipIfExists: true,
        when: (answers) => answers.withStyles,
      },
    ],
  });
};
