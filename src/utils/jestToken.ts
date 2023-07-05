// 获取token

export const getJestToken = () => {
  if (!process.env.jestToken) {
    // eslint-disable-next-line max-len
    process.env.jestToken = 'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoidzYybzM0cFVHdkwzUFBNbSIsImNyZWF0ZWRfYXQiOjE2ODU5MzE3MTcsImV4cCI6MTY4NjUzNjUxN30.PLOqe2RejzzG0IbA7nent_61GppVI8BZ5WK2zpDsM-Y';
  }

  return process.env.jestToken;
};
