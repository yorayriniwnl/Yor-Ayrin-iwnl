import { describe, expect, it } from 'vitest'

import {
  findProjectByIdOrName,
  generateAnswerFromKnowledge,
  simpleGenerateAnswer,
} from '../lib/ai/chatHelpers'
import { ASSISTANT_KNOWLEDGE } from '../lib/ai/knowledgeBase'

describe('chat helpers', () => {
  it('answers experience questions from the shipped assistant data', () => {
    const answer = generateAnswerFromKnowledge(ASSISTANT_KNOWLEDGE, "What's your experience?")

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
    expect(findProjectByIdOrName(ASSISTANT_KNOWLEDGE, '')).toBeNull()
    expect(findProjectByIdOrName(ASSISTANT_KNOWLEDGE, '   ')).toBeNull()
  })

  it('returns a safe fallback when sparse data is loaded', () => {
    const answer = simpleGenerateAnswer({}, 'what projects have you built')

    expect(answer).toBe("I don't have any project entries loaded right now.")
  })
})
