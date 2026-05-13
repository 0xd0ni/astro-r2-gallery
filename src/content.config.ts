import { defineCollection } from 'astro:content'
import { r2Loader } from '@/content/config'
import { z } from 'astro/zod'
import { readAlbumsMeta } from '@/lib/albums'

const albumEntries = readAlbumsMeta()

const albumPrefixes = albumEntries.map((a) => a.name)
const albumDates: Record<string, Date> = Object.fromEntries(
  albumEntries.map((a) => [a.name, new Date(a.pubDate)]),
)

const albums = defineCollection({
  loader: r2Loader(albumPrefixes, albumDates),
  schema: z.object({
    title: z.string(),
    album: z.string(),
    description: z.string(),
    pubDate: z.date(),
    cover: z.string(),
    coverAlt: z.string(),
  }),
})

export const collections = { albums }
