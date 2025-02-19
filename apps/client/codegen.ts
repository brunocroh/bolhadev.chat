import fs from 'node:fs'
import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  overwrite: true,
  schema: process.env.EXPO_PUBLIC_GRAPHQL_API,
  documents: ['./graphql/**/*.graphql'],
  generates: {
    './generated/index.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-react-apollo',
      ],
      config: {
        withHooks: true,
        skipTypename: true,
        useTypeImports: true,
        withFragmentHooks: true,
      },
    },
  },
  hooks: {
    afterAllFileWrite: async (filePath) => {
      try {
        const file = fs.readFileSync(filePath, { encoding: 'utf8' })

        const newFile =
          'import {client} from "@/lib/apollo"\n' +
          file.replace(
            /const options = {...defaultOptions, ...baseOptions}/g,
            'const options = {...defaultOptions, ...baseOptions, client };'
          )

        fs.writeFileSync(filePath, newFile, { encoding: 'utf8' })
      } catch (error) {
        console.log({ error })
      }
    },
  },
}
export default config
