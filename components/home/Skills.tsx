'use client'

import { HOME_SKILL_GROUPS } from '../../data/home'
import { useSkillsReveal } from './hooks/useReveal'

/**
 * Skills
 *
 * Two-column skills section with animated bar fills.
 * Needs 'use client' for useSkillsReveal (IntersectionObserver that
 * triggers the CSS width animation on all skill bars simultaneously).
 */
export default function Skills() {
  const { skillsVisible, setSkillRef } = useSkillsReveal()

  return (
    <section className="skills" id="skills">
      <div className="section-wrap">
        <div className="skills-inner">
          <div className="skills-text">
            <div className="section-label">Capabilities</div>
            <h2 className="skills-heading">
              Craft meets <em>systems</em>
              <br />
              thinking.
            </h2>
            <div className="skills-desc">
              <p>
                From high-fidelity UI systems to backend data pipelines, I build
                across the full product surface.
              </p>
              <p>
                No skill exists in isolation here. Every technical signal is
                backed by a real shipped project or production experiment.
              </p>
            </div>
          </div>

          <div className="skills-categories" id="skillsContainer">
            {HOME_SKILL_GROUPS.map((group, groupIndex) => (
              <div
                className="skill-group"
                key={group.title}
                ref={setSkillRef(groupIndex)}
              >
                <div className="skill-category-title">{group.title}</div>
                {group.items.map(([name, value]) => (
                  <div className="skill-bar-row" key={name}>
                    <span className="skill-name">{name}</span>
                    <div className="skill-track">
                      <div
                        className={`skill-fill ${skillsVisible ? 'animate' : ''}`}
                        style={{ width: `${value}%` }}
                      />
                    </div>
                    <span className="skill-val">{value}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
