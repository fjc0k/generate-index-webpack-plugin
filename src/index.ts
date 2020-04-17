import { Compiler, Plugin } from 'webpack'
import {
  generateManyIndex,
  GenerateManyIndexPayload,
} from 'vscode-generate-index-standalone'
import { IndexGenerator } from 'vscode-generate-index-standalone/out/IndexGenerator'

export interface GenerateIndexPluginOptions
  extends Pick<GenerateManyIndexPayload, 'patterns'> {
  silent?: boolean
}

class GenerateIndexPlugin implements Plugin {
  constructor(private options: GenerateIndexPluginOptions) {}

  apply = (compiler: Compiler) => {
    compiler.hooks.run.tapPromise(GenerateIndexPlugin.name, this.generate)
    compiler.hooks.watchRun.tapPromise(GenerateIndexPlugin.name, this.generate)
  }

  generate = async (compilation: Compiler) => {
    return generateManyIndex({
      patterns: this.options.patterns,
      cwd: compilation.context,
      replaceFile: true,
      onSuccess: filePath => {
        if (!this.options.silent) {
          const shortFilePath = IndexGenerator.getRelativePath(
            compilation.context,
            filePath,
          )
          console.log(
            `✔️ All indexes in ${shortFilePath} have been generated or updated`,
          )
        }
      },
    })
  }
}

export default GenerateIndexPlugin

module.exports = GenerateIndexPlugin
