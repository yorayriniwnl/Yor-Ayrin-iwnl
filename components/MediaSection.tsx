"use client"

import React, { useEffect, useRef, useState } from 'react'
import Card from './ui/Card'
import Grid from './ui/Grid'
import { buttonClassName } from './ui/Button'
import { BodyText, Subheading } from './ui/Typography'

const YT_PLAYLIST = [
  {
    id: 'dQw4w9WgXcQ',
    title: 'Never Gonna Give You Up',
    channel: 'Rick Astley',
    duration: '3:33',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
  },
  {
    id: 'fJ9rUzIMcZQ',
    title: 'Bohemian Rhapsody',
    channel: 'Queen Official',
    duration: '5:55',
    thumbnail: 'https://img.youtube.com/vi/fJ9rUzIMcZQ/mqdefault.jpg',
  },
  {
    id: 'hT_nvWreIhg',
    title: 'Counting Stars',
    channel: 'OneRepublic',
    duration: '4:17',
    thumbnail: 'https://img.youtube.com/vi/hT_nvWreIhg/mqdefault.jpg',
  },
]

const FAV_VIDEOS = [
  {
    id: 'WqiW-KbSX9s',
    title: 'The Most Satisfying Video',
    note: 'Pure dopamine for stressed-out days.',
    duration: '10:00',
    thumbnail: 'https://img.youtube.com/vi/WqiW-KbSX9s/mqdefault.jpg',
  },
  {
    id: '8To-6VIJZRE',
    title: 'The Egg Theory',
    note: 'A quiet favorite that changes perspective fast.',
    duration: '8:34',
    thumbnail: 'https://img.youtube.com/vi/8To-6VIJZRE/mqdefault.jpg',
  },
  {
    id: 'HW29067qVWk',
    title: 'Jurassic Park Theme Slide Whistle',
    note: 'Short, absurd, and perfect.',
    duration: '0:48',
    thumbnail: 'https://img.youtube.com/vi/HW29067qVWk/mqdefault.jpg',
  },
]

const SONGS = [
  { id: 1, title: 'Blinding Lights', artist: 'The Weeknd', duration: '3:20' },
  { id: 2, title: 'Levitating', artist: 'Dua Lipa', duration: '3:23' },
  { id: 3, title: 'Sunflower', artist: 'Post Malone, Swae Lee', duration: '2:38' },
  { id: 4, title: 'Circles', artist: 'Post Malone', duration: '3:35' },
]

export default function MediaSection(): JSX.Element {
  const [ytActive, setYtActive] = useState(0)
  const [songPlaying, setSongPlaying] = useState<number | null>(null)
  const [songProgress, setSongProgress] = useState(0)
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null)

  function playSong(id: number) {
    if (songPlaying === id) {
      setSongPlaying(null)
      setSongProgress(0)
      if (progressRef.current) clearInterval(progressRef.current)
      return
    }

    setSongPlaying(id)
    setSongProgress(0)
    if (progressRef.current) clearInterval(progressRef.current)

    progressRef.current = setInterval(() => {
      setSongProgress((value) => {
        if (value >= 100) {
          if (progressRef.current) clearInterval(progressRef.current)
          setSongPlaying(null)
          return 0
        }

        return value + 0.8
      })
    }, 100)
  }

  useEffect(() => {
    return () => {
      if (progressRef.current) clearInterval(progressRef.current)
    }
  }, [])

  return (
    <section id="media" className="ds-section">
      <div className="ds-container">
        <div className="ds-stack ds-stack--loose">
          <section className="ds-stack">
            <div className="ds-section-intro">
              <Subheading>Video queue</Subheading>
              <BodyText>
                Curated references and comfort watches, now displayed inside the same
                premium card language as the rest of the site.
              </BodyText>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
              <Card as="div">
                <div className="overflow-hidden rounded-[1rem] border border-[var(--ds-border)]">
                  <iframe
                    width="100%"
                    height="340"
                    src={`https://www.youtube.com/embed/${YT_PLAYLIST[ytActive].id}?autoplay=0&rel=0`}
                    title={YT_PLAYLIST[ytActive].title}
                    allow="accelerometer; autoplay; clipboard-write; compute-pressure; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ border: 'none', display: 'block' }}
                  />
                </div>
                <div className="mt-4 ds-stack ds-stack--tight">
                  <span className="ds-badge ds-tag--accent">{YT_PLAYLIST[ytActive].channel}</span>
                  <Subheading>{YT_PLAYLIST[ytActive].title}</Subheading>
                  <BodyText>{YT_PLAYLIST[ytActive].duration}</BodyText>
                </div>
              </Card>

              <div className="ds-grid ds-grid--cols-1 ds-grid--gap-sm">
                {YT_PLAYLIST.map((video, index) => (
                  <button
                    key={video.id}
                    type="button"
                    onClick={() => setYtActive(index)}
                    className="text-left"
                  >
                    <Card interactive className="h-full">
                      <div className="flex gap-4">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="h-16 w-24 rounded-[0.75rem] object-cover"
                        />
                        <div className="ds-stack ds-stack--tight">
                          <Subheading className="text-base">{video.title}</Subheading>
                          <BodyText className="ds-text--small">
                            {video.channel} / {video.duration}
                          </BodyText>
                        </div>
                      </div>
                    </Card>
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="ds-stack">
            <div className="ds-section-intro">
              <Subheading>Favorites</Subheading>
              <BodyText>Shortlist of standout videos worth rewatching.</BodyText>
            </div>

            <Grid cols={3} gap="md">
              {FAV_VIDEOS.map((video) => (
                <Card key={video.id} as="article" interactive>
                  <div className="ds-stack ds-stack--tight">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="h-40 w-full rounded-[1rem] object-cover"
                    />
                    <span className="ds-badge">{video.duration}</span>
                    <Subheading className="text-base">{video.title}</Subheading>
                    <BodyText className="ds-text--small">{video.note}</BodyText>
                    <a
                      href={`https://www.youtube.com/watch?v=${video.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={buttonClassName('secondary', 'sm')}
                    >
                      Watch
                    </a>
                  </div>
                </Card>
              ))}
            </Grid>
          </section>

          <section className="ds-stack">
            <div className="ds-section-intro">
              <Subheading>Playlist</Subheading>
              <BodyText>Interactive audio rows keep the playful behavior, just with cleaner visuals.</BodyText>
            </div>

            <div className="ds-card">
              <div className="ds-grid ds-grid--cols-1 ds-grid--gap-sm">
                {SONGS.map((song, index) => {
                  const isPlaying = songPlaying === song.id

                  return (
                    <button
                      key={song.id}
                      type="button"
                      onClick={() => playSong(song.id)}
                      className="rounded-[1rem] border border-[var(--ds-border)] bg-[rgba(17,16,9,0.45)] p-4 text-left transition hover:border-[var(--ds-border-strong)] hover:bg-[rgba(26,23,16,0.72)]"
                    >
                      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div className="ds-stack ds-stack--tight">
                          <span className="ds-badge">{isPlaying ? 'Playing' : `Track ${index + 1}`}</span>
                          <Subheading className="text-base">{song.title}</Subheading>
                          <BodyText className="ds-text--small">
                            {song.artist} / {song.duration}
                          </BodyText>
                        </div>

                        <span className={buttonClassName(isPlaying ? 'primary' : 'ghost', 'sm')}>
                          {isPlaying ? 'Pause' : 'Preview'}
                        </span>
                      </div>

                      {isPlaying ? (
                        <div className="mt-4 ds-progress">
                          <div
                            className="ds-progress__bar"
                            style={{ width: `${songProgress}%` }}
                          />
                        </div>
                      ) : null}
                    </button>
                  )
                })}
              </div>
            </div>
          </section>
        </div>
      </div>
    </section>
  )
}
