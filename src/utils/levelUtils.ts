export const getLevelTitle = (level: string): string => {
    const titles: Record<string, string> = {
        'A1': 'Beginner',
        'A2': 'Elementary',
        'B1': 'Intermediate',
        'B2': 'Upper Int.', // Abbreviated for badges
        'C1': 'Advanced',
        'C2': 'Mastery',
    };
    return titles[level] || level;
};

export const getLevelDescription = (level: string) => {
    const descriptions: Record<string, { title: string; subtitle: string }> = {
        'A1': { title: 'Beginner', subtitle: 'Basic phrases & greetings' },
        'A2': { title: 'Elementary', subtitle: 'Past tense & daily routines' },
        'B1': { title: 'Intermediate', subtitle: 'Complex grammar concepts' },
        'B2': { title: 'Upper Intermediate', subtitle: 'Professional German' },
    };
    return descriptions[level] || descriptions['A1'];
};
