import { useEffect, useState } from 'react';
import { loadContent, defaultSettings } from '../services/contentService';
import { projects as staticProjects } from '../data/projects';
import { skills as staticSkills } from '../data/skills';
import { env } from '../config/env';

/** Returns bundled content instantly, then swaps in backend content when enabled. */
export default function useContent() {
  const [content, setContent] = useState({ projects: staticProjects, skills: staticSkills, settings: defaultSettings });
  useEffect(() => {
    if (!env.remoteContent) return undefined;
    let alive = true;
    loadContent().then((c) => alive && setContent(c));
    return () => { alive = false; };
  }, []);
  return content;
}
