// has number
// eslint-disable-next-line prefer-regex-literals
const hasNumber = (number) => new RegExp(/[0-9]/).test(number);

// has mix of small and capitals
// eslint-disable-next-line prefer-regex-literals
const hasMixed = (number) => new RegExp(/[a-z]/).test(number) && new RegExp(/[A-Z]/).test(number);

// has special chars
// eslint-disable-next-line prefer-regex-literals
const hasSpecial = (number) => new RegExp(/[!#@$%^&*)(+=._-]/).test(number);

// set color based on password strength
export const strengthColor = (count) => {
  if (count < 2) return { lever: count, label: 'Poor', color: '#C0C0C0' };
  if (count < 3) return { lever: count, label: 'Weak', color: '#969696' };
  if (count < 4) return { lever: count, label: 'Normal', color: '#808080' };
  if (count < 5) return { lever: count, label: 'Good', color: '#646464' };
  if (count < 6) return { lever: count, label: 'Strong', color: '#4B4B4B' };
  return { lever: count, label: 'Poor', color: '#C0C0C0' };
};

// password strength indicator
const strengthIndicator = (password) => {
  let strengths = 0;
  if (password.length > 12) strengths += 1;
  if (password.length >= 16) strengths += 1;
  if (hasNumber(password)) strengths += 1;
  if (hasSpecial(password)) strengths += 1;
  if (hasMixed(password)) strengths += 1;

  return strengthColor(strengths);
};

export default strengthIndicator;
