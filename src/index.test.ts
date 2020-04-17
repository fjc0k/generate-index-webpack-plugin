import GenerateIndexPlugin from '.'
import tmp from 'tempy'
import webpack from 'webpack'
import { copySync, readFileSync, removeSync, writeFileSync } from 'fs-extra'
import { join } from 'path'

let cwd: string

beforeEach(() => {
  cwd = tmp.directory()
  copySync(join(__dirname, './__fixtures__'), join(cwd, 'src'))
})

afterEach(() => {
  removeSync(cwd)
})

test('run', done => {
  const compiler = webpack({
    entry: './src/index.js',
    output: {
      path: join(cwd, './dist'),
    },
    optimization: {
      minimize: false,
    },
    plugins: [
      new GenerateIndexPlugin({
        patterns: ['./src/index.js', './src/assets/index.js'],
      }),
    ],
    context: cwd,
  })
  compiler.run(err => {
    expect(err).toBeFalsy()
    expect(
      readFileSync(join(cwd, './src/index.js')).toString(),
    ).toMatchSnapshot('src/index.js')
    expect(
      readFileSync(join(cwd, './src/assets/index.js')).toString(),
    ).toMatchSnapshot('src/assets/index.js')
    expect(
      eval(readFileSync(join(cwd, './dist/main.js')).toString()),
    ).toMatchSnapshot('eval dist/main.js')
    done()
  })
})

test('watch-run', done => {
  const compiler = webpack({
    entry: './src/index.js',
    output: {
      path: join(cwd, './dist'),
    },
    optimization: {
      minimize: false,
    },
    plugins: [
      new GenerateIndexPlugin({
        patterns: ['./src/index.js', './src/assets/index.js'],
      }),
    ],
    context: cwd,
  })
  let lastHash: string | undefined
  let i = 0
  const watching = compiler.watch({}, (err, stats) => {
    if (stats.hash === lastHash) return
    lastHash = stats.hash
    i++
    expect(err).toBeFalsy()
    expect(
      readFileSync(join(cwd, './src/index.js')).toString(),
    ).toMatchSnapshot(`<${i}> src/index.js`)
    expect(
      readFileSync(join(cwd, './src/assets/index.js')).toString(),
    ).toMatchSnapshot(`<${i}> src/assets/index.js`)
    expect(
      eval(readFileSync(join(cwd, './dist/main.js')).toString()),
    ).toMatchSnapshot(`<${i}> eval dist/main.js`)
  })
  setTimeout(() => {
    writeFileSync(join(cwd, './src/hello.js'), 'export const hello = "ok"')
    setTimeout(() => {
      watching.close(() => {
        done()
      })
    }, 1000)
  }, 1000)
})
