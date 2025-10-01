export async function sendEmailVerificationToken(email: string, token: string) {
  // todo: create send email fn here ...
  console.log(`${process.env.NEXT_PUBLIC_BASE_URL}/verify?token=${token}`)
  console.log(`sended to ${email}`)
}
