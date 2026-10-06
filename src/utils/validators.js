export const validateContact = ({ name, email, message, subject }) => {
  const errors = {};
  if (!name.trim() || name.trim().length < 2) errors.name = 'Please enter your name (at least 2 characters).';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) errors.email = 'Enter a valid email address, like name@example.com.';
  if (subject && subject.length > 120) errors.subject = 'Keep the subject under 120 characters.';
  if (message.trim().length < 10) errors.message = 'Tell me a little more — at least 10 characters.';
  if (message.length > 500) errors.message = 'Please keep the message under 500 characters.';
  return errors;
};
