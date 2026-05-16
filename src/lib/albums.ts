import { getCollection } from 'astro:content'
import { readFileSync } from 'node:fs'
import { parse } from 'smol-toml'

export interface Album {
  name: string
  pubDate: Date
  cover: string
  coverAlt: string
  count: number
}

export function readAlbumsMeta(): {
  name: string
  pubDate: string
  cover?: string
}[] {
  const { albums } = parse(
    readFileSync('./src/content/gallery/albums.toml', 'utf-8'),
  ) as { albums: { name: string; pubDate: string; cover?: string }[] }
  return albums
}

export async function getAlbums(): Promise<Album[]> {
  const entries = await getCollection('albums')
  const meta = readAlbumsMeta()
  const coverOverride = new Map(
    meta.filter((a) => a.cover).map((a) => [a.name, a.cover!]),
  )

  const albumMap = new Map<string, typeof entries>()
  for (const entry of entries) {
    const { album: name } = entry.data
    if (!albumMap.has(name)) albumMap.set(name, [])
    albumMap.get(name)!.push(entry)
  }

  return [...albumMap.entries()]
    .map(([name, photos]) => {
      const specified = coverOverride.get(name)
      const cover =
        (specified && photos.find((p) => p.data.title === specified)) ||
        photos[Math.floor(Math.random() * photos.length)]
      return {
        name,
        pubDate: photos[0].data.pubDate,
        cover: cover.data.cover,
        coverAlt: cover.data.coverAlt,
        count: photos.length,
      }
    })
    .sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf())
}

export async function getAlbumPaths(): Promise<
  { params: { id: string }; props: { photos: string[] } }[]
> {
  const entries = await getCollection('albums')
  const albumMap = new Map<string, string[]>()
  for (const e of entries) {
    const name = e.data.album
    if (!albumMap.has(name)) albumMap.set(name, [])
    albumMap.get(name)!.push(e.data.cover)
  }
  return [...albumMap.entries()].map(([name, photos]) => ({
    params: { id: name },
    props: { photos },
  }))
}
