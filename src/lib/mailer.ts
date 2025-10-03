export async function sendEmailVerificationToken(email: string, token: string) {
  // todo: create send email fn here ...
  console.log(`\n\n sended to ${email} \n`)
  console.log(`${process.env.NEXT_PUBLIC_BASE_URL}/signup/verify?token=${token} \n\n`)
}
