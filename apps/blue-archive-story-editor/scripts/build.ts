/**
 * 根据解包后文件转换为数据结构
 */

import * as path from 'node:path/posix'
import fs from 'node:fs/promises'
import type { Asset, ResourceTree } from '../src/types/resource'

const ASSET_PATH = 'D:/ba-assets-extractor/data/~output'

async function processAssets(assetsPath: string) {
  const resourceTree: ResourceTree = {
    name: assetsPath,
    children: [],
  }
  const build = async (rt: ResourceTree, currentPath: string) => {
    // console.log(currentPath);

    const dirlist = await fs.readdir(path.join(ASSET_PATH, currentPath), {
      withFileTypes: true,
    })
    for (const item of dirlist) {
      if (item.isDirectory()) {
        const newPath = path.join(currentPath, item.name)
        const newResourceTree: ResourceTree = {
          name: item.name,
          children: [],
        }
        rt.children.push(newResourceTree)
        await build(newResourceTree, newPath)
      }
      else if (item.isFile()) {
        const filePath = path.join(currentPath, item.name)
        const newAsset: Asset = {
          name: item.name,
          crc: 'calcCrc',
          path: filePath,
          type: 'other',
        }
        rt.children.push(newAsset)
      }
    }
  }
  await build(resourceTree, path.join(assetsPath, 'AssetBundles'))
  return resourceTree
}

function processMedia(mediaPath: string) {}

function processOBB(obbPath: string) {}

const realResourceTree: ResourceTree = {
  name: ASSET_PATH,
  children: [],
}

const files = await fs.readdir(ASSET_PATH, { recursive: false })
for (const value of files) {
  if (value.startsWith('assets'))
    realResourceTree.children.push(await processAssets(value))

  else if (value.startsWith('media'))
    processMedia(value)

  else if (value.startsWith('obb'))
    processOBB(value)
}

async function saveRealResourceTree() {
  console.log('Write result to RealResourceTree.json')
  console.log(realResourceTree)
  await fs.writeFile(
    'RealResourceTree.json',
    JSON.stringify(realResourceTree, null, 2),
  )
  console.log('Write finished.')
}
await saveRealResourceTree()
