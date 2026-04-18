import { describe, expect, it } from 'vitest'

import assistantData from '../public/assistant_data.json'
import {
  findProjectByIdOrName,
  generateAnswerFromKnowledge,
  simpleGenerateAnswer,
} from '../lib/ai/chatHelpers'

describe('chat helpers', () => {
  it('answers experience questions from the shipped assistant data', () => {
    const answer = generateAnswerFromKnowledge(assistantData, "What's your experience?")

    expect(answer).toContain('Experience:')
    expect(answer).toContain('Independent Project Work')
    expect(answer).toContain('Portfolio Platform')
  })

  it('falls back to profile summary when experience entries are missing', () => {
    const answer = generateAnswerFromKnowledge(
      {
        profile: {
          summary: 'Builder focused on product and systems work.',
        },
      },
      'resume',
    )

    expect(answer).toContain('Builder focused on product and systems work.')
  })

  it('does not match a project for a blank query', () => {
    expect(findProjectByIdOrName(assistantData, '')).toBeNull()
    expect(findProjectByIdOrName(assistantData, '   ')).toBeNull()
  })

  it('returns a safe fallback when sparse data is loaded', () => {
    const answer = simpleGenerateAnswer({}, 'what projects have you built')

    expect(answer).toBe("I don't have any project entries loaded right now.")
  })
})
