export const createTeamSlug = (teamName) => {
  if (!teamName) return '';
  
  return encodeURIComponent(teamName.toString().trim());
};

export const createMatchSlug = (teamA, teamB) => {
  const slugA = createTeamSlug(teamA);
  const slugB = createTeamSlug(teamB);
  return `${slugA}-vs-${slugB}`;
};

export const parseMatchSlug = (slug) => {
  if (!slug) return { teamA: '', teamB: '' };
  
  const decodedSlug = decodeURIComponent(slug);
  const parts = decodedSlug.split('-vs-');
  
  if (parts.length !== 2) {
    return { teamA: '', teamB: '' };
  }
  
  const teamA = decodeURIComponent(parts[0]);
  const teamB = decodeURIComponent(parts[1]);
  
  return { teamA, teamB };
};

export const normalizeTeamName = (teamName) => {
  if (!teamName) return '';
  
  return teamName.toString().trim();
};

export const teamNamesMatch = (name1, name2) => {
  return name1?.toString().trim() === name2?.toString().trim();
};