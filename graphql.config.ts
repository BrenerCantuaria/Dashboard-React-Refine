// Importa o tipo IGraphQLConfig da biblioteca graphql-config para tipagem
import type { IGraphQLConfig } from "graphql-config";

// Define a configuração do GraphQL como uma constante tipada
const config: IGraphQLConfig = {
  // Especifica o endpoint da API GraphQL que será usado
  schema: "https://api.crm.refine.dev/graphql",
  
  // Define extensões para a configuração (opções adicionais)
  extensions: {
    // Configuração para o codegen (geração de código)
    codegen: {
      // Hooks que são executados em determinados momentos do processo
      hooks: {
        // Comandos executados após cada arquivo ser escrito
        afterOneFileWrite: ["eslint --fix", "prettier --write"],
      },
      // Configuração dos arquivos que serão gerados
      generates: {
        // Arquivo que conterá os tipos do schema GraphQL
        "src/graphql/schema.types.ts": {
          // Plugin usado para gerar os tipos TypeScript
          plugins: ["typescript"],
          // Configurações específicas do plugin
          config: {
            skipTypename: true,        // Omite o campo __typename nos tipos gerados
            enumsAsTypes: true,         // Trata enums como tipos em vez de enums TypeScript
            // Configuração de scalars personalizados
            scalars: {
              DateTime: {              // Define como o scalar DateTime deve ser tratado
                input: "string",        // Tipo usado para inputs
                output: "string",       // Tipo usado para outputs
                format: "date-time",    // Formato do scalar (informação adicional)
              },
            },
          },
        },
        // Arquivo que conterá os tipos das operações GraphQL
        "src/graphql/types.ts": {
          preset: "import-types",      // Usa um preset para importar tipos existentes
          documents: ["src/**/*.{ts,tsx}"],  // Padrão para encontrar arquivos com operações GraphQL
          plugins: ["typescript-operations"],  // Plugin para gerar tipos das operações
          config: {
            skipTypename: true,        // Omite __typename
            enumsAsTypes: true,        // Trata enums como tipos
            preResolveTypes: false,    // Desativa resolução antecipada de tipos
            useTypeImports: true,      // Usa import type para imports de tipos
          },
          presetConfig: {
            typesPath: "./schema.types",  // Caminho para importar os tipos do schema
          },
        },
      },
    },
  },
};

// Exporta a configuração como padrão do módulo
export default config;