import copy from '../../content/copy.json';

export type CopyContent = typeof copy;

export const content = copy as CopyContent;

// Helper functions for accessing content
export const getCopy = (path: string) => {
  const keys = path.split('.');
  let value: any = content;
  
  for (const key of keys) {
    value = value?.[key];
    if (value === undefined) return undefined;
  }
  
  return value;
};

export const getRandomMicrocopy = () => {
  const microcopy = content.quiz.microcopy_top;
  if (Array.isArray(microcopy)) {
    return microcopy[Math.floor(Math.random() * microcopy.length)];
  }
  return microcopy;
};

export const getDomainLabel = (domain: string, level: 'low' | 'mid' | 'high') => {
  return content.levels.labels[domain as keyof typeof content.levels.labels]?.[level];
};

export const getAvatarInfo = (avatar: string) => {
  return content.avatars[avatar as keyof typeof content.avatars];
};

export const getSevenDayPlay = (domain: string) => {
  return content.plays['7day'][domain as keyof typeof content.plays['7day']];
};

export const getThirtyDayPlay = (domain: string) => {
  return content.plays['30day'][domain as keyof typeof content.plays['30day']];
};

export const formatProgressText = (current: number, total: number) => {
  return content.quiz.progress
    .replace('{current}', current.toString())
    .replace('{total}', total.toString());
};

export const formatLevelUpToast = (domain: string, level: string) => {
  return content.toasts.levelUp
    .replace('{domain}', domain)
    .replace('{level}', level);
};

export const formatAvatarReveal = (avatar: string) => {
  return content.results.headers.avatar.replace('{avatar}', avatar);
};

export default content;
