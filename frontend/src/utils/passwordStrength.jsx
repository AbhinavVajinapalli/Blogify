const UPPERCASE_REGEX = /[A-Z]/;
const LOWERCASE_REGEX = /[a-z]/;
const NUMBER_REGEX = /\d/;
const SPECIAL_REGEX = /[^A-Za-z0-9]/;

export const passwordRules = [
  {
    key: 'minLength',
    label: 'At least 8 characters',
    test: (value) => value.length >= 8,
  },
  {
    key: 'uppercase',
    label: 'At least 1 uppercase letter',
    test: (value) => UPPERCASE_REGEX.test(value),
  },
  {
    key: 'lowercase',
    label: 'At least 1 lowercase letter',
    test: (value) => LOWERCASE_REGEX.test(value),
  },
  {
    key: 'number',
    label: 'At least 1 number',
    test: (value) => NUMBER_REGEX.test(value),
  },
  {
    key: 'special',
    label: 'At least 1 special character',
    test: (value) => SPECIAL_REGEX.test(value),
  },
];

export const getPasswordRuleStatus = (password) => {
  return passwordRules.map((rule) => ({
    ...rule,
    passed: rule.test(password),
  }));
};

export const getPasswordStrength = (password) => {
  if (!password) {
    return { label: 'Empty', score: 0, percentage: 0 };
  }

  const passedCount = getPasswordRuleStatus(password).filter((rule) => rule.passed).length;
  const percentage = Math.round((passedCount / passwordRules.length) * 100);

  if (passedCount <= 2) {
    return { label: 'Weak', score: passedCount, percentage };
  }

  if (passedCount <= 4) {
    return { label: 'Medium', score: passedCount, percentage };
  }

  return { label: 'Strong', score: passedCount, percentage };
};

export const isStrongPassword = (password) => {
  return getPasswordRuleStatus(password).every((rule) => rule.passed);
};

export const generateStrongPassword = (length = 12) => {
  const lower = 'abcdefghijklmnopqrstuvwxyz';
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const specials = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  const allChars = lower + upper + numbers + specials;

  const requiredChars = [
    lower[Math.floor(Math.random() * lower.length)],
    upper[Math.floor(Math.random() * upper.length)],
    numbers[Math.floor(Math.random() * numbers.length)],
    specials[Math.floor(Math.random() * specials.length)],
  ];

  while (requiredChars.length < length) {
    requiredChars.push(allChars[Math.floor(Math.random() * allChars.length)]);
  }

  for (let i = requiredChars.length - 1; i > 0; i -= 1) {
    const swapIndex = Math.floor(Math.random() * (i + 1));
    const temp = requiredChars[i];
    requiredChars[i] = requiredChars[swapIndex];
    requiredChars[swapIndex] = temp;
  }

  return requiredChars.join('');
};
